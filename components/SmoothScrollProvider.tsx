"use client";

import React from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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
