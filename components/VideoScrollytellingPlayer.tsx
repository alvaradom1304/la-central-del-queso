"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Play, Pause, FastForward, Film, Sparkles } from "lucide-react";

export interface JourneyVideoClip {
  id: string;
  stageIndex: number;
  title: string;
  src: string;
  poster: string;
  durationHint?: number; // fallback duration in seconds
  atmosphereGradient: string;
}

export const JOURNEY_VIDEOS: JourneyVideoClip[] = [
  {
    id: "umbral",
    stageIndex: 0,
    title: "El Umbral · Cordillera de Turrialba",
    src: "/videos/finca_umbral_camino.mp4",
    poster: "/porton_finca_turrialba.jpg",
    atmosphereGradient:
      "linear-gradient(180deg, rgba(10,18,14,0.60) 0%, rgba(16,28,20,0.22) 45%, rgba(10,17,13,0.85) 100%)",
  },
  {
    id: "camino",
    stageIndex: 1,
    title: "El Camino Vivo · Potreros de Pastoreo Libre",
    src: "/videos/finca_potrero_vacas.mp4",
    poster: "/potrero_vacas_lecheria.jpg",
    atmosphereGradient:
      "linear-gradient(180deg, rgba(12,24,16,0.52) 0%, rgba(22,38,24,0.18) 50%, rgba(10,18,13,0.86) 100%)",
  },
  {
    id: "lecheria",
    stageIndex: 2,
    title: "La Lechería · Recepción y Cuajado Tibio",
    src: "/videos/finca_lecheria_leche.mp4",
    poster: "/lecheria_proceso_artesanal.jpg",
    atmosphereGradient:
      "linear-gradient(180deg, rgba(28,18,10,0.58) 0%, rgba(45,28,14,0.22) 50%, rgba(18,12,8,0.88) 100%)",
  },
  {
    id: "transformacion",
    stageIndex: 3,
    title: "La Cava · Maduración y Humo de Guayabo",
    src: "/videos/finca_cava_maduracion.mp4",
    poster: "/interior_cava_roble.jpg",
    atmosphereGradient:
      "linear-gradient(180deg, rgba(22,14,9,0.60) 0%, rgba(38,24,14,0.24) 48%, rgba(24,17,12,0.94) 100%)",
  },
];

interface VideoScrollytellingPlayerProps {
  currentStage: number; // 0, 1, 2, 3
  localStageProgress: number; // 0.0 to 1.0 within the active stage
  globalProgress: number; // 0.0 to 1.0 total narrative progress
  cameraDollyScale?: number;
  liteMode?: boolean;
  className?: string;
}

export const VideoScrollytellingPlayer: React.FC<VideoScrollytellingPlayerProps> = ({
  currentStage,
  localStageProgress,
  globalProgress,
  cameraDollyScale = 1.05,
  liteMode = false,
  className = "",
}) => {
  // Referencias a los dos elementos de video para crossfade sin parpadeo (A / B buffer)
  const videoPrimaryRef = useRef<HTMLVideoElement>(null);
  const videoSecondaryRef = useRef<HTMLVideoElement>(null);
  const rafIdRef = useRef<number | null>(null);

  // Estados de control
  const [playbackMode, setPlaybackMode] = useState<"scrub" | "ambient">("scrub");
  const [isMuted, setIsMuted] = useState(true);
  const [activeSlot, setActiveSlot] = useState<"primary" | "secondary">("primary");
  const [activeClipIndex, setActiveClipIndex] = useState(currentStage);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Video actual y siguiente
  const activeClip = JOURNEY_VIDEOS[currentStage] || JOURNEY_VIDEOS[0];

  // Sincronizar clip activo cuando cambia de escena
  useEffect(() => {
    setActiveClipIndex(currentStage);
  }, [currentStage]);

  // Manejo de sincronización precisa de fotogramas según el scroll (Scrubbing con amortiguación lerp)
  useEffect(() => {
    if (liteMode || playbackMode !== "scrub") return;

    const video = activeSlot === "primary" ? videoPrimaryRef.current : videoSecondaryRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;

    // Calcular el segundo objetivo en base al progreso local de la escena
    const clampedProgress = Math.max(0, Math.min(1, localStageProgress));
    const targetTime = clampedProgress * video.duration;

    // Bucle amortiguado por requestAnimationFrame para evitar micro-bloqueos en el decodificador
    const updateVideoFrame = () => {
      if (!video || video.seeking || !video.duration) return;

      const diff = targetTime - video.currentTime;
      if (Math.abs(diff) > 0.04) {
        // Avance suave hacia el fotograma objetivo
        const step = diff * 0.16;
        const newTime = video.currentTime + step;
        if (isFinite(newTime) && newTime >= 0 && newTime <= video.duration) {
          video.currentTime = newTime;
        }
      }
    };

    rafIdRef.current = requestAnimationFrame(updateVideoFrame);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [localStageProgress, currentStage, activeSlot, playbackMode, liteMode]);

  // Modo Reproducción Cinemática Continua (Ambient Loop)
  useEffect(() => {
    const video = activeSlot === "primary" ? videoPrimaryRef.current : videoSecondaryRef.current;
    if (!video) return;

    if (playbackMode === "ambient" && !liteMode) {
      video.loop = true;
      video.muted = true;
      video.play().catch(() => {
        // Los navegadores bloquean autoplay si no está muteado
      });
    } else if (playbackMode === "scrub") {
      video.pause();
    }
  }, [playbackMode, activeSlot, currentStage, liteMode]);

  // Carga inicial y listeners de video
  const handleLoadedData = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleVideoError = () => {
    setHasError(true);
  };

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      {/* Contenedor con escala cinemática continua (Dolly travelling) */}
      <div
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{
          transform: `scale(${cameraDollyScale.toFixed(4)})`,
          transition: "transform 140ms linear",
        }}
      >
        {/* VIDEO ACTIVO PRINCIPAL */}
        {!liteMode && !hasError ? (
          <video
            ref={videoPrimaryRef}
            key={activeClip.src}
            src={activeClip.src}
            poster={activeClip.poster}
            playsInline
            muted
            preload="auto"
            onLoadedData={handleLoadedData}
            onError={handleVideoError}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none"
            style={{
              opacity: isLoaded ? 1 : 0.85,
              filter: "contrast(1.04) saturate(1.08) brightness(0.96)",
            }}
          />
        ) : (
          /* FALLBACK FOTOGRÁFICO ACCESIBLE (Modo Ligero o Error de Reproducción) */
          <img
            src={activeClip.poster}
            alt={activeClip.title}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ filter: "contrast(1.04) saturate(1.06)" }}
          />
        )}

        {/* Gradiente Atmosférico de Escena (Luz Volcánica / Amanecer de Montaña / Cava) */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{ background: activeClip.atmosphereGradient }}
        />
      </div>

      {/* Control Discreto de Cinemática: Modo Scrubbing vs. Reproducción Continua */}
      {!liteMode && (
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-[#0B120E]/80 backdrop-blur-md border border-white/15 shadow-xl text-xs">
            <button
              type="button"
              onClick={() => setPlaybackMode("scrub")}
              title="El video avanza o retrocede sincronizado con el scroll"
              className={`px-3 py-1.5 rounded-full font-mono text-[11px] transition-colors flex items-center gap-1.5 ${
                playbackMode === "scrub"
                  ? "bg-[#DDA13E] text-[#0D1510] font-bold shadow-xs"
                  : "text-[#F7F4EC]/70 hover:text-white"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scrollytelling</span>
            </button>

            <button
              type="button"
              onClick={() => setPlaybackMode("ambient")}
              title="Reproducción cinemática fluida continua"
              className={`px-3 py-1.5 rounded-full font-mono text-[11px] transition-colors flex items-center gap-1.5 ${
                playbackMode === "ambient"
                  ? "bg-[#DDA13E] text-[#0D1510] font-bold shadow-xs"
                  : "text-[#F7F4EC]/70 hover:text-white"
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cinemática en Vivo</span>
            </button>
          </div>
        </div>
      )}

      {/* Indicador de Coherencia de Video & Metadatos de Producción */}
      <div className="absolute bottom-6 left-6 z-30 hidden md:flex items-center gap-2 pointer-events-none">
        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B120E]/70 backdrop-blur-md border border-white/10 font-mono text-[10px] uppercase tracking-widest text-[#DDA13E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DDA13E] animate-pulse" />
          <span>Metraje Real Continuo · {activeClip.title}</span>
        </span>
      </div>
    </div>
  );
};
