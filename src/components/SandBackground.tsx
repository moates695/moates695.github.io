import heroImg from "../assets/tech-sand-hero.png";
import { SAND } from "./sand";

/**
 * Static "Tech Sand" backdrop for the home page. The dune image is pinned to the
 * viewport (a fixed layer, not background-attachment: fixed, which mobile Safari
 * mishandles) so the page content scrolls over it and the dunes stay visible all
 * the way down. A soft scrim keeps foreground text legible; a solid base colour
 * fills anything the image does not cover.
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
        backgroundImage: `linear-gradient(rgba(11,9,8,.42), rgba(11,9,8,.42)), url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "60% center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
