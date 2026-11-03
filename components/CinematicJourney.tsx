"use client";

import React from "react";
import { VideoScrollytellingPlayer } from "./VideoScrollytellingPlayer";

const chapters = [
  { title: "Donde comienza el sabor.", label: "Finca Doña Martha", text: "Abra el portón. El camino de la montaña nos lleva hasta la mesa.", },
  { title: "El camino se saborea.", label: "Los potreros", text: "Entre bruma y pastos de altura, seguimos el origen de cada pieza.", },
  { title: "El oficio de cada mañana.", label: "La lechería", text: "Leche, tiempo y manos artesanas. Acérquese al granero.", },
  { title: "El tiempo tiene su lugar.", label: "La cava", text: "Madera y penumbra. Al otro lado de estas puertas, su mesa está servida.", },
];
const clamp = (n: number) => Math.max(0, Math.min(1, n));

function TimberDoors({ open, barn = false }: { open: number; barn?: boolean }) {
  return <div className={`timber-portal ${barn ? "timber-barn" : ""}`} aria-hidden="true"
    style={{ opacity: 1 - clamp((open - .82) / .18), transform: `scale(${1 + open * .18})` }}>
    <div className="timber-sign">{barn ? "LA MESA ESTÁ SERVIDA" : "FINCA DOÑA MARTHA"}<small>{barn ? "La Central del Queso" : "Turrialba · Costa Rica"}</small></div>
    {[0, 1].map(side => <div key={side} className={`timber-leaf timber-leaf-${side}`}
      style={{ transform: `rotateY(${(side ? -1 : 1) * open * 100}deg)` }}>
      <i className="timber-brace"/><i className="timber-rail"/><b className="timber-hinge timber-hinge-top"/><b className="timber-hinge timber-hinge-bottom"/><b className="timber-handle"/>
    </div>)}
  </div>;
}

export default function CinematicJourney({ containerRef, progress, liteMode, fullMotionOverride, onNavigate }: {
  containerRef: React.RefObject<HTMLDivElement>; progress: number; liteMode: boolean; fullMotionOverride: boolean; onNavigate: (index: number) => void;
}) {
  const stage = progress < .25 ? 0 : progress < .5 ? 1 : progress < .76 ? 2 : 3;
  const starts = [0, .25, .5, .76], spans = [.25, .25, .26, .24];
  const local = clamp((progress - starts[stage]) / spans[stage]);
  const chapter = chapters[stage];
  return <section ref={containerRef} id="inicio-umbral" className={`cinematic-journey ${liteMode ? "cinematic-lite" : ""} ${fullMotionOverride ? "cinematic-user-full" : ""}`} aria-label="De la finca a su mesa">
    <div className="cinematic-stage">
      <div className="cinematic-media"><VideoScrollytellingPlayer currentStage={stage} localStageProgress={local} globalProgress={progress} cameraDollyScale={liteMode ? 1 : 1.02 + local * .07} liteMode={liteMode}/></div>
      {!liteMode && stage === 0 && <TimberDoors open={clamp(progress / .16)}/>}
      {!liteMode && stage === 3 && <TimberDoors barn open={clamp((local - .12) / .75)}/>}
      <div className="cinematic-shade"/>
      <div className="cinematic-topline"><span>DE LA FINCA A SU MESA · {String(stage + 1).padStart(2, "0")} / 04</span><button onClick={() => onNavigate(5)}>Saltar al catálogo ↗</button></div>
      <div className="cinematic-copy">
        <span className="cinematic-eyebrow">{chapter.label} · Desde 1980</span>
        <h1>{chapter.title}</h1><p>{chapter.text}</p>
        <div className="cinematic-actions"><button onClick={() => onNavigate(stage === 3 || liteMode ? 4 : stage + 1)}>{stage === 3 || liteMode ? "Descubrir la mesa" : stage === 0 ? "Abrir el portón" : "Seguir el camino"} <span>↗</span></button><button onClick={() => document.getElementById("calculadora-sommelier")?.scrollIntoView({behavior: liteMode ? "auto" : "smooth"})}>Calcular mi selección</button></div>
      </div>
      <nav className="cinematic-chapters" aria-label="Capítulos del recorrido">{chapters.map((c, i) => <button key={c.label} onClick={() => onNavigate(i)} aria-current={stage === i ? "step" : undefined}><span>0{i + 1}</span>{c.label}<i style={{transform: `scaleX(${i < stage ? 1 : i === stage ? local : 0})`}}/></button>)}</nav>
    </div>
  </section>;
}

