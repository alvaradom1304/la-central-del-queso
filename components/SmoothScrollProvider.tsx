"use client";

import React from "react";

// Keep the server-rendered tree stable. Browser scrolling already supports touch,
// keyboard and reduced-motion CSS; replacing its root during hydration remounts
// the journey and can shift the page while restoring a saved scroll position.
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
