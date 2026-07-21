import { SAND } from "./sand";

/**
 * Calm "Tech Sand" backdrop for the inner (non-home) pages. Unlike the home
 * page's dune photo, content pages get a quiet near-black sand fill with a soft
 * warm glow up top and a faint cool wash at the base, so long, text-dense pages
 * stay legible while still reading as part of the same warm world.
 */
export default function SandInnerBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundColor: SAND.bg,
        backgroundImage: [
          "radial-gradient(120% 70% at 50% -10%, rgba(216,170,120,.10) 0%, rgba(216,170,120,0) 55%)",
          "radial-gradient(120% 80% at 50% 120%, rgba(143,208,212,.05) 0%, rgba(143,208,212,0) 55%)",
        ].join(", "),
      }}
    />
  );
}
