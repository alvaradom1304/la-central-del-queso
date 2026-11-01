#!/usr/bin/env python3
"""Read-only sample measurements for local integer PCM WAV files (not approval)."""

import argparse
import hashlib
import json
import math
import os
from pathlib import Path
import struct
import sys


DEFAULT_MAX_BYTES = 512 * 1024 * 1024
DEFAULT_MAX_SECONDS = 3600.0
BLOCK_FRAMES = 8192


class AudioQAError(ValueError):
    """Invalid, unsupported, incomplete, or over-limit input."""


def _read(stream, count):
    data = stream.read(count)
    if len(data) != count:
        raise AudioQAError("Truncated WAV")
    return data


def _db(value):
    return 20 * math.log10(value) if value > 0 else None


def analyze(input_path, *, max_bytes=DEFAULT_MAX_BYTES,
            max_seconds=DEFAULT_MAX_SECONDS):
    """Measure a complete WAV in bounded blocks; never modify the input.

    Limits reject the whole input, never yield a report for a partial scan.
    dBFS uses the integer negative-full-scale magnitude as reference.
    """
    name = str(input_path)
    if "://" in name or name.lower().startswith(("http:", "https:", "file:")):
        raise AudioQAError("Input must be a local .wav path, not a URL")
    path = Path(input_path)
    if path.suffix.lower() != ".wav":
        raise AudioQAError("Input must have a .wav extension")
    if (not isinstance(max_bytes, int) or isinstance(max_bytes, bool)
            or max_bytes <= 0 or not math.isfinite(max_seconds)
            or max_seconds <= 0):
        raise AudioQAError("Size and duration limits must be finite and positive")
    with path.open("rb") as stream:
        original_stat = os.fstat(stream.fileno())
        stream.seek(0, 2)
        size = stream.tell()
        if size > max_bytes:
            raise AudioQAError("WAV exceeds maximum file size")
        # Hash the complete bounded RIFF, including chunks not used by the meter.
        source_hash = hashlib.sha256()
        stream.seek(0)
        remaining_bytes = size
        while remaining_bytes:
            count = min(remaining_bytes, 1024 * 1024)
            source_hash.update(_read(stream, count))
            remaining_bytes -= count
        stream.seek(0)
        riff, declared, kind = struct.unpack("<4sI4s", _read(stream, 12))
        if riff != b"RIFF" or kind != b"WAVE":
            raise AudioQAError("Only RIFF WAVE integer PCM is supported")
        if declared + 8 != size:
            raise AudioQAError("RIFF size does not match complete file")
        fmt = None
        audio = None
        while stream.tell() < size:
            tag, length = struct.unpack("<4sI", _read(stream, 8))
            start = stream.tell()
            end = start + length + (length & 1)
            if end > size:
                raise AudioQAError("Truncated WAV chunk")
            if tag == b"fmt ":
                if fmt is not None or length < 16:
                    raise AudioQAError("Missing or duplicate/invalid format chunk")
                fmt = struct.unpack("<HHIIHH", _read(stream, 16))
            elif tag == b"data":
                if audio is not None:
                    raise AudioQAError("Multiple data chunks are unsupported")
                audio = (start, length)
            stream.seek(end)
        if fmt is None or audio is None:
            raise AudioQAError("WAV requires format and data chunks")
        encoding, channels, rate, byte_rate, alignment, bits = fmt
        if encoding != 1 or bits not in (8, 16, 24, 32):
            raise AudioQAError("Only 8/16/24/32-bit integer PCM is supported")
        if channels not in (1, 2) or rate <= 0:
            raise AudioQAError("Expected mono/stereo and positive sample rate")
        width = bits // 8
        if alignment != width * channels or byte_rate != rate * alignment:
            raise AudioQAError("Inconsistent PCM format metadata")
        start, length = audio
        if not length or length % alignment:
            raise AudioQAError("Empty or incomplete PCM frames")
        frames = length // alignment
        duration = frames / rate
        if duration > max_seconds:
            raise AudioQAError("WAV exceeds maximum duration")
        sums = [0.0] * channels
        squares = [0.0] * channels
        peaks = [0.0] * channels
        full = [0] * channels
        cross = 0.0
        scale = 1 << (bits - 1)
        remaining = frames
        stream.seek(start)
        while remaining:
            count = min(remaining, BLOCK_FRAMES)
            block = _read(stream, count * alignment)
            for offset in range(0, len(block), alignment):
                samples = []
                for channel in range(channels):
                    pos = offset + channel * width
                    raw = block[pos:pos + width]
                    integer = raw[0] - 128 if bits == 8 else int.from_bytes(
                        raw, "little", signed=True)
                    value = integer / scale
                    sums[channel] += value
                    squares[channel] += value * value
                    peaks[channel] = max(peaks[channel], abs(value))
                    full[channel] += int(integer in (-scale, scale - 1))
                    samples.append(value)
                if channels == 2:
                    cross += samples[0] * samples[1]
            remaining -= count
        # Detect common concurrent edits; caller must keep the input stable.
        # This is not an atomic snapshot or a lock against hostile writers.
        stream.seek(0, 2)
        final_stat = os.fstat(stream.fileno())
        if (stream.tell() != size or
                any(getattr(final_stat, key) != getattr(original_stat, key)
                    for key in ('st_size', 'st_mtime_ns', 'st_ctime_ns'))):
            raise AudioQAError("Input changed during analysis")
    correlation = None
    mono_loss = None
    cancellation = False
    if channels == 2:
        variance = [max(0.0, squares[c] - sums[c] ** 2 / frames)
                    for c in range(2)]
        denominator = math.sqrt(variance[0] * variance[1])
        if denominator > 0:
            correlation = max(-1.0, min(1.0,
                (cross - sums[0] * sums[1] / frames) / denominator))
        total = sum(squares)
        if total > 0:
            ratio = max(0.0, (total + 2 * cross) / (2 * total))
            mono_loss = _db(math.sqrt(ratio))
            cancellation = ratio <= 0.01
    return {
        "status": "MEASURED_NOT_APPROVED",
        "source": {"sha256": source_hash.hexdigest(), "size_bytes": size},
        "sample_rate_hz": rate, "channels": channels, "bit_depth": bits,
        "frames": frames, "duration_seconds": duration,
        "channel_measurements": [
            {"channel": c + 1, "sample_peak_dbfs": _db(peaks[c]),
             "rms_dbfs": _db(math.sqrt(squares[c] / frames)),
             "dc_offset": sums[c] / frames,
             "full_scale_sample_count": full[c]} for c in range(channels)],
        "silence": all(peak == 0 for peak in peaks),
        "stereo_correlation": correlation,
        "mono_sum_rms_change_db": mono_loss,
        "mono_cancellation_risk": cancellation,
        "integrated_lufs": None, "true_peak_dbtp": None,
        "listening_review": "NOT_PERFORMED", "rights": "NOT_VERIFIED",
        "commercial_certification": False,
        "measurement_notes": (
            "Sample measurements only; no LUFS or true-peak measurement. "
            "Mono uses (L+R)/2; change is relative to stereo mean energy. "
            "Null dB means zero amplitude, including complete mono cancellation. "
            "Correlation is centered Pearson correlation, null if undefined. "
            "Risk means at least 20 dB mono energy loss; no listening approval.")}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", help="Local .wav file; required; opened read-only")
    parser.add_argument("--max-bytes", type=int, default=DEFAULT_MAX_BYTES,
                        help="Reject larger files (default: 536870912 bytes)")
    parser.add_argument("--max-seconds", type=float, default=DEFAULT_MAX_SECONDS,
                        help="Reject longer audio (default: 3600 seconds)")
    args = parser.parse_args(argv)
    try:
        report = analyze(args.input, max_bytes=args.max_bytes,
                         max_seconds=args.max_seconds)
        print(json.dumps(report, allow_nan=False, indent=2))
    except (OSError, ValueError, OverflowError) as exc:
        print(json.dumps({"status": "ERROR", "error": str(exc)},
                         allow_nan=False), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
