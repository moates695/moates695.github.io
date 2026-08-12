/**
 * Wires the analytics collector to the router.
 *
 * Mounted once, inside the Router so it can read the current route. It renders
 * nothing and holds no state, so it cannot cause a re-render: the only thing it
 * can do to the page is nothing at all.
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageview } from "./analytics";

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
};

/**
 * Defer to after first paint.
 *
 * Analytics setup has no business competing with the page for the main thread
 * during load, and nothing it does is time critical. `requestIdleCallback` is
 * still missing on Safari, hence the timeout fallback.
 */
function whenIdle(fn: () => void): void {
  try {
    const idle = window as IdleWindow;
    if (typeof idle.requestIdleCallback === "function") {
      idle.requestIdleCallback(fn, { timeout: 2000 });
    } else {
      setTimeout(fn, 0);
    }
  } catch {
    /* if even scheduling fails, skip analytics entirely */
  }
}

export default function useAnalytics(): void {
  const { pathname } = useLocation();

  // Read through a ref so a visitor who navigates before the idle callback runs
  // is recorded on the page they are actually on, not the one they landed on.
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  useEffect(() => {
    whenIdle(() => initAnalytics(pathRef.current));
  }, []);

  useEffect(() => {
    trackPageview(pathname);
  }, [pathname]);
}
