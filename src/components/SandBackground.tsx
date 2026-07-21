import { useState } from "react";
import heroImg from "../assets/tech-sand-hero.webp";
import { SAND } from "./sand";

/**
 * Static "Tech Sand" backdrop for the home page. The dune image is pinned to the
 * viewport (a fixed layer, not background-attachment: fixed, which mobile Safari
 * mishandles) so the page content scrolls over it and the dunes stay visible all
 * the way down.
 *
 * The solid base colour paints instantly; the dune image is a real <img> (so the
 * browser prioritises it and we can react to load) that fades in once decoded,
 * avoiding the slow reveal you get from a CSS background-image. A soft scrim on
 * top keeps foreground text legible.
 */
export default function SandBackground() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        // Size to the largest viewport height (lvh) rather than inset:0 so the
        // mobile address bar hiding/showing on scroll doesn't resize the layer
        // and shift the dune image.
        width: "100%",
        height: "100lvh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: SAND.bg,
      }}
    >
      <img
        src={heroImg}
        alt=""
        aria-hidden
        decoding="async"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ fetchpriority: "high" } as any)}
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "60% center",
          opacity: loaded ? 1 : 0,
          transition: "opacity .4s ease",
        }}
      />
      {/* Scrim: darkens the dunes so foreground text stays legible. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(11,9,8,.42)",
        }}
      />
    </div>
  );
}
