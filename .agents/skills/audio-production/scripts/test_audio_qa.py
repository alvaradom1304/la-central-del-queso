"""Synthetic tests; only temporary fixtures are written."""

import contextlib
import hashlib
import io
import json
import math
import os
from pathlib import Path
import struct
import tempfile
import unittest
from unittest.mock import patch
import wave

import audio_qa


class AudioQATests(unittest.TestCase):
    def test_source_identity_matches_complete_multiblock_file_without_paths(self):
        path = self.fixture([1000, -1000] * 10000)
        before = path.read_bytes()
        report = audio_qa.analyze(path)
        self.assertEqual(report['source'], {'sha256': hashlib.sha256(before).hexdigest(), 'size_bytes': len(before)})
        self.assertNotIn(str(path), json.dumps(report))
        self.assertEqual(path.read_bytes(), before)

    def test_source_identity_includes_unmeasured_riff_chunks(self):
        path = self.fixture([1000, -1000] * 10)
        first = audio_qa.analyze(path)
        raw = path.read_bytes()
        raw = raw[:12] + b'JUNK' + struct.pack('<I', 4) + b'abcd' + raw[12:]
        raw = raw[:4] + struct.pack('<I', len(raw)-8) + raw[8:]
        path.write_bytes(raw)
        second = audio_qa.analyze(path)
        self.assertEqual(second['source']['sha256'], hashlib.sha256(raw).hexdigest())
        self.assertNotEqual(first['source']['sha256'], second['source']['sha256'])
        self.assertEqual(first['channel_measurements'], second['channel_measurements'])

    def test_same_size_input_edit_during_measurement_is_rejected(self):
        path = self.fixture([1000, -1000] * 10)
        original_read = audio_qa._read
        changed = False
        def read_then_edit(stream, count):
            nonlocal changed
            data = original_read(stream, count)
            if count == 40 and not changed:
                changed = True
                stamp = path.stat()
                with path.open('r+b') as output:
                    output.seek(44)
                    output.write(b'\x01\x00')
                os.utime(path, ns=(stamp.st_atime_ns, stamp.st_mtime_ns + 1000000000))
            return data
        with patch.object(audio_qa, '_read', side_effect=read_then_edit):
            with self.assertRaisesRegex(audio_qa.AudioQAError, 'changed during analysis'):
                audio_qa.analyze(path)
        self.assertTrue(changed)
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = Path(self.temp.name) / "fixture.wav"

    def fixture(self, samples, bits=16, channels=1, rate=8000):
        width = bits // 8
        pcm = b"".join(bytes([v + 128]) if bits == 8 else
                       v.to_bytes(width, "little", signed=True) for v in samples)
        with wave.open(str(self.path), "wb") as wav:
            wav.setnchannels(channels)
            wav.setsampwidth(width)
            wav.setframerate(rate)
            wav.writeframes(pcm)
        return self.path

    def test_silence_strict_json_and_read_only(self):
        path = self.fixture([0] * 9000)
        before = path.read_bytes()
        stat = path.stat()
        report = audio_qa.analyze(path)
        self.assertTrue(report["silence"])
        self.assertIsNone(report["channel_measurements"][0]["rms_dbfs"])
        self.assertIsNone(report["channel_measurements"][0]["sample_peak_dbfs"])
        self.assertIsNone(report["integrated_lufs"])
        self.assertIsNone(report["true_peak_dbtp"])
        self.assertEqual(report["listening_review"], "NOT_PERFORMED")
        self.assertEqual(report["rights"], "NOT_VERIFIED")
        self.assertEqual(report["status"], "MEASURED_NOT_APPROVED")
        json.dumps(report, allow_nan=False)
        self.assertEqual(hashlib.sha256(before).digest(),
                         hashlib.sha256(path.read_bytes()).digest())
        self.assertEqual(stat.st_mtime_ns, path.stat().st_mtime_ns)
        self.assertEqual(list(path.parent.iterdir()), [path])

    def test_sine_known_peak_rms_and_metadata(self):
        samples = [round(16384 * math.sin(2 * math.pi * i / 80))
                   for i in range(16000)]
        report = audio_qa.analyze(self.fixture(samples))
        channel = report["channel_measurements"][0]
        self.assertAlmostEqual(channel["sample_peak_dbfs"], -6.0206, places=3)
        self.assertAlmostEqual(channel["rms_dbfs"], -9.0309, places=3)
        self.assertAlmostEqual(channel["dc_offset"], 0.0, places=8)
        self.assertEqual((report["frames"], report["duration_seconds"],
                          report["sample_rate_hz"]), (16000, 2, 8000))

    def test_all_integer_widths_full_scale_and_unsigned(self):
        for bits in (8, 16, 24, 32):
            with self.subTest(bits=bits):
                scale = 1 << (bits - 1)
                report = audio_qa.analyze(self.fixture(
                    [-scale, scale - 1, 0, 0], bits=bits))
                channel = report["channel_measurements"][0]
                self.assertEqual(report["bit_depth"], bits)
                self.assertEqual(channel["sample_peak_dbfs"], 0.0)
                self.assertEqual(channel["full_scale_sample_count"], 2)
                self.assertAlmostEqual(channel["dc_offset"], -1 / (4 * scale))
        report = audio_qa.analyze(self.fixture([0] * 10, bits=8))
        self.assertTrue(report["silence"])

    def test_stereo_antiphase_and_in_phase(self):
        left = [10000, -10000] * 100
        for sign in (-1, 1):
            report = audio_qa.analyze(self.fixture(
                [v for value in left for v in (value, sign * value)], channels=2))
            self.assertAlmostEqual(report["stereo_correlation"], sign)
            self.assertEqual(report["mono_cancellation_risk"], sign == -1)
            if sign == -1:
                self.assertIsNone(report["mono_sum_rms_change_db"])
            else:
                self.assertAlmostEqual(report["mono_sum_rms_change_db"], 0)

    def test_undefined_silent_stereo_correlation(self):
        report = audio_qa.analyze(self.fixture([0] * 20, channels=2))
        self.assertIsNone(report["stereo_correlation"])
        self.assertFalse(report["mono_cancellation_risk"])

    def test_reject_empty_truncated_and_bad_metadata(self):
        good = self.fixture([0, 1, -1]).read_bytes()
        variants = [b"", good[:-1], good + b"extra"]
        for offset, value in ((20, struct.pack("<H", 3)),
                              (22, struct.pack("<H", 3)),
                              (24, struct.pack("<I", 0)),
                              (28, struct.pack("<I", 1)),
                              (32, struct.pack("<H", 7)),
                              (34, struct.pack("<H", 20)),
                              (40, struct.pack("<I", 999))):
            mutated = bytearray(good)
            mutated[offset:offset + len(value)] = value
            variants.append(mutated)
        for data in variants:
            with self.subTest(data=bytes(data[:36])):
                self.path.write_bytes(data)
                with self.assertRaises(audio_qa.AudioQAError):
                    audio_qa.analyze(self.path)
        self.fixture([])
        with self.assertRaises(audio_qa.AudioQAError):
            audio_qa.analyze(self.path)

    def test_frame_remainder_even_when_riff_length_matches(self):
        data = bytearray(self.fixture([1, 2]).read_bytes())
        # Three data bytes plus one pad byte retain a structurally complete RIFF.
        data[40:44] = struct.pack("<I", 3)
        self.path.write_bytes(data)
        with self.assertRaises(audio_qa.AudioQAError):
            audio_qa.analyze(self.path)

    def test_limits_reject_instead_of_partial_report(self):
        self.fixture([1] * 100)
        for limits in ({"max_bytes": 20}, {"max_seconds": .001},
                       {"max_bytes": 0}, {"max_seconds": float("nan")},
                       {"max_seconds": float("inf")}):
            with self.subTest(limits=limits):
                with self.assertRaises(audio_qa.AudioQAError):
                    audio_qa.analyze(self.path, **limits)

    def test_urls_rejected_and_cli_errors_do_not_emit_success(self):
        with self.assertRaises(audio_qa.AudioQAError):
            audio_qa.analyze("https://example.com/audio.wav")
        output, error = io.StringIO(), io.StringIO()
        with contextlib.redirect_stdout(output), contextlib.redirect_stderr(error):
            result = audio_qa.main([str(self.path)])
        self.assertNotEqual(result, 0)
        self.assertEqual(output.getvalue(), "")
        self.assertEqual(json.loads(error.getvalue())["status"], "ERROR")


if __name__ == "__main__":
    unittest.main()
