"use client";

import { LazyMotion, domAnimation } from "motion/react";

// Loads Motion's DOM animation features once for the whole app. `strict` makes
// a full `motion.*` component throw, so client leaves use the light `m.*` ones.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
