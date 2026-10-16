import { useReducedMotion } from "motion/react";

// Motion needs numbers, CSS needs custom properties. The CSS values in
// app/globals.css (--ease-trilsy, --duration-base, --duration-slow) are the
// definition; change both together. Motion takes seconds.
export const ease = [0.22, 1, 0.36, 1] as const;
export const duration = { base: 0.4, slow: 0.6 } as const;
export const transition = { duration: duration.slow, ease } as const;
export const transitionBase = { duration: duration.base, ease } as const;
export const instant = { duration: 0 } as const;

/** Values that move or resize something; under reduced motion they change at once. */
const moving = ["x", "y", "scale", "scaleX", "scaleY", "rotate", "height", "width"] as const;
type Moving = (typeof moving)[number];

/**
 * The transition for an `m.*` element. Under `prefers-reduced-motion` the
 * site's policy is fades, not moves: opacity and colour keep `t`, while
 * position, scale and size change at once. Motion animates on the Web
 * Animations API, which the reduced-motion rule in globals.css does not reach,
 * so every Motion transition outside the hero's own painters goes through this.
 */
export function useMotionTransition<T extends object>(t: T): T | (T & Record<Moving, typeof instant>) {
  const reduced = useReducedMotion();
  return reduced ? { ...t, ...Object.fromEntries(moving.map((k) => [k, instant])) } as T & Record<Moving, typeof instant> : t;
}
