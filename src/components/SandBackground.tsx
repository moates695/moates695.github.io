import { SAND } from "./sand";

/**
 * Static warm sand backdrop for the Tech Sand home page, replacing the animated
 * flow canvas there. Solid colour only: the dunes image lives inside the hero
 * (within the content's max width); everything past that is this flat colour.
 */
export default function SandBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundColor: SAND.bg,
      }}
    />
  );
}
