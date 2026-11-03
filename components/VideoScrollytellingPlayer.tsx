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
    poster: "/porton_finca_turrialba.webp",
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
  currentStage: number;
  localStageProgress: number;
  globalProgress: number;
  cameraDollyScale?: number;
  liteMode?: boolean;
  className?: string;
}

export function VideoScrollytellingPlayer({ currentStage, localStageProgress, cameraDollyScale = 1, liteMode = false, className = "" }: VideoScrollytellingPlayerProps) {
  const root = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const target = useRef({ stage: currentStage, progress: localStageProgress });
  target.current = { stage: currentStage, progress: localStageProgress };
  const [ready, setReady] = useState<Record<number, boolean>>({});
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const [ambient, setAmbient] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    videos.current.forEach((v, index) => {
      if (!v) return;
      if (ambient && visible && !liteMode && index === currentStage) v.play().catch(() => {});
      else v.pause();
    });
  }, [ambient, currentStage, liteMode, visible, ready]);
  useEffect(() => {
    if (liteMode || ambient || !visible) return;
    let frame = 0;
    const tick = () => {
      const {stage, progress} = target.current;
      const v = videos.current[stage];
      if (v && v.readyState >= 2 && Number.isFinite(v.duration) && !v.seeking) {
        const time = Math.max(0, Math.min(v.duration - .08, progress * v.duration));
        if (Math.abs(v.currentTime - time) > .08) v.currentTime = time;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [liteMode, ambient, visible]);
  return <div ref={root} className={`relative w-full h-full overflow-hidden ${className}`}>
    {JOURNEY_VIDEOS.map((clip, i) => <div key={clip.id} className="absolute inset-0 transition-opacity duration-700" style={{opacity: currentStage === i ? 1 : 0, transform: `scale(${currentStage === i ? cameraDollyScale : 1.02})`, transition: "opacity 700ms ease, transform 180ms linear"}} aria-hidden="true">
      <img src={clip.poster} srcSet={i === 0 ? "/porton_finca_turrialba-mobile.webp 768w, /porton_finca_turrialba.webp 1376w" : undefined} sizes="100vw" alt="" className="absolute inset-0 w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"}/>
      {!liteMode && !failed[i] && (localStageProgress > .005 || ambient || currentStage > 0) && Math.abs(i - currentStage) <= 1 && <video ref={v => { videos.current[i] = v; }} src={clip.src} muted playsInline loop preload={i === currentStage ? "auto" : "metadata"}
        onLoadedData={() => setReady(r => ({...r, [i]: true}))} onError={() => setFailed(r => ({...r, [i]: true}))}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" style={{opacity: ready[i] ? 1 : 0}}/>}
    </div>)}
    {!liteMode && <button type="button" aria-pressed={ambient} onClick={() => setAmbient(a => !a)} className="cinematic-play">{ambient ? "Pausar reproducción" : "Reproducir sin desplazar"}</button>}
  </div>;
}
