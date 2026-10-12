import type { SVGProps } from "react";

/** Three rising notes: a compact, single-color mark, drawn for small sizes. */
export function Mark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 21.5C7.5 21.5 7.5 10.5 11 10.5"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M13 25C16.5 25 15 6 20 6"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M23 21.5C26.5 21.5 24.5 10.5 28 10.5"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
