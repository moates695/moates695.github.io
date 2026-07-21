import { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material';

/**
 * Ocean-like living background.
 *
 * A height-field wave simulation (classic two-buffer wave equation) runs on a
 * coarse grid: mouse movement and clicks inject energy that propagates outward
 * as wavefronts and decays with momentum. The surface is drawn as a stack of
 * slowly drifting "swell" contour lines whose vertical position is bent by the
 * simulated water height. Disturbed water shifts colour teal -> amber and
 * brightens; calm water rests as gentle swell.
 *
 * Full-viewport, fixed, pointer-events:none canvas behind all content; input is
 * read from window so clicks still reach the UI.
 */
export default function FlowBackground() {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mode = theme.palette.mode;
  const bg = theme.palette.background.default;
  const tealHex = theme.palette.primary.main;
  const amberHex = theme.palette.secondary.main;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dark = mode === 'dark';
    const hexToRgb = (h: string) => {
      const n = parseInt(h.replace('#', ''), 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    };
    const teal = hexToRgb(tealHex);
    const amber = hexToRgb(amberHex);
    const mix = (t: number) => ({
      r: Math.round(teal.r + (amber.r - teal.r) * t),
      g: Math.round(teal.g + (amber.g - teal.g) * t),
      b: Math.round(teal.b + (amber.b - teal.b) * t),
    });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Tunables ──────────────────────────────────────────────────────
    const CELL = 22; // sim grid pitch (px)
    const DAMP = 0.977; // wave persistence (higher = ripples travel further)
    const EDGE_MARGIN = 6; // cells near each edge that absorb (no reflection)
    const LINE_GAP = 46; // vertical spacing of swell rows
    const STEP = 15; // horizontal spacing of dots along each row
    const DOT_R = 1.3; // base dot radius (px)
    const DOT_R_ENERGY = 2.2; // extra radius on disturbed water
    const SIM_SCALE = 0.5; // px of line bend per unit water height
    const MAX_BEND = 26; // clamp on displacement so a hit never flings a line
    const A1 = 12; // swell amplitudes (bigger = more surface movement)
    const A2 = 7;
    const A3 = 3.5;
    const CURSOR_R = 200; // colour halo radius around cursor
    const LINE_ALPHA = dark ? 0.16 : 0.22;
    const composite: GlobalCompositeOperation = dark ? 'lighter' : 'source-over';

    let w = 0;
    let h = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let cur = new Float32Array(0);
    let prev = new Float32Array(0);
    // Per-cell damping: base DAMP inside, ramping down near edges so ripples
    // are absorbed before the border wall and never reflect back inward.
    let dampField = new Float32Array(0);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 2;
      rows = Math.ceil(h / CELL) + 2;
      cur = new Float32Array(cols * rows);
      prev = new Float32Array(cols * rows);
      dampField = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const dist = Math.min(x, y, cols - 1 - x, rows - 1 - y);
          const ramp = Math.min(1, dist / EDGE_MARGIN);
          // Absorb at the very edge (0.6×) easing linearly up to full DAMP a
          // few cells in: enough to soak a wavefront so it doesn't reflect,
          // narrow enough that clicks near the edge still ripple inward.
          dampField[y * cols + x] = DAMP * (0.6 + 0.4 * ramp);
        }
      }
    };
    resize();

    // Live input state.
    const mouse = { x: -9999, y: -9999, speed: 0 };
    let lastMx = -9999;
    let lastMy = -9999;

    const inject = (px: number, py: number, amt: number, radius: number) => {
      const cx = Math.round(px / CELL);
      const cy = Math.round(py / CELL);
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const gx = cx + dx;
          const gy = cy + dy;
          if (gx < 1 || gy < 1 || gx >= cols - 1 || gy >= rows - 1) continue;
          const falloff = 1 - Math.hypot(dx, dy) / (radius + 0.5);
          if (falloff > 0) cur[gy * cols + gx] += amt * falloff;
        }
      }
    };

    const sampleSim = (px: number, py: number) => {
      const gx = px / CELL;
      const gy = py / CELL;
      const x0 = Math.floor(gx);
      const y0 = Math.floor(gy);
      if (x0 < 0 || y0 < 0 || x0 >= cols - 1 || y0 >= rows - 1) return 0;
      const fx = gx - x0;
      const fy = gy - y0;
      const i = y0 * cols + x0;
      const a = cur[i];
      const b = cur[i + 1];
      const c = cur[i + cols];
      const d = cur[i + cols + 1];
      return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
    };

    const stepSim = () => {
      for (let y = 1; y < rows - 1; y++) {
        const row = y * cols;
        for (let x = 1; x < cols - 1; x++) {
          const i = row + x;
          let v = (cur[i - 1] + cur[i + 1] + cur[i - cols] + cur[i + cols]) / 2 - prev[i];
          v *= dampField[i];
          prev[i] = v;
        }
      }
      const tmp = cur;
      cur = prev;
      prev = tmp;
    };

    const draw = (nowMs: number) => {
      const t = nowMs / 1000;

      if (!reduce) stepSim();
      mouse.speed *= 0.88; // decay glow between moves

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = composite;

      const mx = mouse.x;
      const my = mouse.y;
      const glow = Math.min(1, mouse.speed / 26);

      for (let baseY = -LINE_GAP; baseY < h + LINE_GAP; baseY += LINE_GAP) {
        for (let x = 0; x <= w; x += STEP) {
          const swell =
            A1 * Math.sin(x * 0.008 + t * 0.72 + baseY * 0.02) +
            A2 * Math.sin(x * 0.017 - t * 0.54 + baseY * 0.011) +
            A3 * Math.sin(x * 0.031 + t * 1.05 + baseY * 0.03);
          const s = reduce ? 0 : sampleSim(x, baseY);
          const bend = Math.max(-MAX_BEND, Math.min(MAX_BEND, s * SIM_SCALE));
          const yy = baseY + swell + bend;

          // Local energy → colour + brightness.
          let e = Math.min(1, Math.abs(s) * 0.055);
          const dm = Math.hypot(mx - x, my - baseY);
          if (dm < CURSOR_R) {
            e = Math.max(e, (1 - dm / CURSOR_R) * (0.28 + glow * 0.72));
          }

          const c = mix(Math.min(1, e * 1.35));
          const a = LINE_ALPHA + e * (0.82 - LINE_ALPHA);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${a})`;
          ctx.beginPath();
          ctx.arc(x, yy, DOT_R + e * DOT_R_ENERGY, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(draw);
    };

    let raf = 0;
    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onMove = (e: PointerEvent) => {
      if (lastMx > -1000) {
        // Cursor only tints the water (via mouse.speed → glow); it does not
        // disturb the surface. Only clicks inject ripples.
        mouse.speed = Math.hypot(e.clientX - lastMx, e.clientY - lastMy);
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMx = e.clientX;
      lastMy = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      lastMx = -9999;
    };
    const onDown = (e: PointerEvent) => {
      if (!reduce) inject(e.clientX, e.clientY, -42, 3);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('resize', resize);
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', resize);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [bg, tealHex, amberHex, mode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
