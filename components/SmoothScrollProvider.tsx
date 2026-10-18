"use client";

import React, { useEffect, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  if (reduced) return <>{children}</>;
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.14,
        duration: 0.85,
        smoothWheel: true,
        wheelMultiplier: 1.08,
        touchMultiplier: 1.4,
      }}
    >
      {children}
    </ReactLenis>
  );
}
