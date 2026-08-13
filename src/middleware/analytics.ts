/**
 * Site analytics collector.
 *
 * The site is on GitHub Pages, so there are no server logs: if we want to know
 * what visitors do, the page has to say so itself. This module batches page
 * views and clicks and beacons them to stats.moates.com.au.
 *
 * The governing rule is that analytics must never affect the site. Concretely:
 *
 * - **It cannot throw.** Every entry point is wrapped. `localStorage` access is
 *   wrapped too, because Safari in private mode throws on the property access
 *   itself, not just on write.
 * - **It cannot render.** Nothing here touches React state, so it can never
 *   trigger a re-render, a render loop, or a blank page. There is no error
 *   boundary because there is nothing in the render path to catch.
 * - **It cannot block.** `sendBeacon` is fire-and-forget with no promise to
 *   reject. Click listeners are passive and never call preventDefault, so a
 *   link navigates whether or not its beacon left. The fetch fallback is
 *   keepalive, aborted after 3s, and its rejection is swallowed.
 * - **It cannot grow.** The queue is bounded, and a circuit breaker disables
 *   collection for the rest of the session after a few consecutive failures, so
 *   a blocked endpoint costs one failed beacon and then silence.
 * - **It cannot be noisy.** No console output outside development.
 */

const API_BASE = process.env.REACT_APP_STATS_API_BASE ?? "https://stats.moates.com.au";

/** Beacons are sent after 3s of quiet, or as soon as the queue reaches this. */
const BATCH_SIZE = 10;
const FLUSH_DELAY_MS = 3000;

/**
 * Hard cap on queued events. A long session against a dead endpoint drops the
 * oldest rather than growing without limit.
 */
const MAX_QUEUE = 50;

/** Consecutive failures before collection gives up for this page load. */
const MAX_FAILURES = 3;

const FETCH_TIMEOUT_MS = 3000;

const SESSION_KEY = "moates.sid";

type EventKind = "pageview" | "click" | "outbound" | "session_end";

type QueuedEvent = {
  k: EventKind;
  p?: string;
  t?: string;
  ts: number;
  m?: Record<string, string | number | boolean>;
};

type Context = {
  ref?: string;
  land?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  lang?: string;
  sw?: number;
  sh?: number;
};

const isDev = process.env.NODE_ENV === "development";

let started = false;
let disabled = false;
let failures = 0;
let sessionId = "";
let context: Context = {};
let queue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let lastPath = "";

/** Log only in development; production stays silent whatever happens. */
function debug(...args: unknown[]): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", ...args);
  }
}

/**
 * Run something that must never take the page down with it.
 *
 * Every public entry point goes through this, so a bug anywhere in this module
 * degrades to "no analytics" rather than a broken site.
 */
function safely(label: string, fn: () => void): void {
  try {
    fn();
  } catch (err) {
    debug(`${label} failed`, err);
  }
}

/** sessionStorage, treated as something that may not exist and may throw. */
function readStore(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStore(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* private browsing, or storage disabled; the id stays in memory instead */
  }
}

function uuid(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through to the manual version */
  }
  // RFC 4122 v4 shape, sufficient for a session id that only needs to be unique
  // enough to group one tab's events.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Whether to collect at all.
 *
 * Do Not Track is honoured. It costs a slice of the data, but storing hashed
 * IPs and then ignoring an explicit opt-out would be an odd combination. To
 * collect regardless, delete the doNotTrack check.
 */
function shouldCollect(): boolean {
  try {
    const nav = window.navigator as Navigator & { msDoNotTrack?: string };
    const win = window as Window & { doNotTrack?: string };
    const dnt = nav.doNotTrack ?? win.doNotTrack ?? nav.msDoNotTrack;
    if (dnt === "1" || dnt === "yes") {
      debug("disabled by Do Not Track");
      return false;
    }

    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1" || host === "";
    if (isLocal && process.env.REACT_APP_STATS_DEV !== "1") {
      debug("disabled on localhost (set REACT_APP_STATS_DEV=1 to enable)");
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/** Session-scoped id, so one tab's events group together. */
function getSessionId(): string {
  if (sessionId) return sessionId;
  const existing = readStore(SESSION_KEY);
  if (existing) {
    sessionId = existing;
  } else {
    sessionId = uuid();
    writeStore(SESSION_KEY, sessionId);
  }
  return sessionId;
}

/**
 * One-off visitor context, captured on the first event of the session.
 *
 * UTM tags are read from the real query string rather than the hash route:
 * campaign links land as `moates.com.au/?utm_source=x#/`, since HashRouter owns
 * everything after the `#`.
 */
function buildContext(path: string): Context {
  const ctx: Context = {};

  // Our own pages are not referrers; only record where the visitor came from.
  try {
    const ref = document.referrer;
    if (ref && new URL(ref).hostname !== window.location.hostname) {
      ctx.ref = ref.slice(0, 2000);
    }
  } catch {
    /* malformed referrer; leave it unset */
  }

  ctx.land = path;

  try {
    const params = new URLSearchParams(window.location.search);
    const source = params.get("utm_source");
    const medium = params.get("utm_medium");
    const campaign = params.get("utm_campaign");
    if (source) ctx.utm_source = source.slice(0, 200);
    if (medium) ctx.utm_medium = medium.slice(0, 200);
    if (campaign) ctx.utm_campaign = campaign.slice(0, 200);
  } catch {
    /* no URLSearchParams, or a malformed query; skip attribution */
  }

  try {
    ctx.lang = navigator.language;
    ctx.sw = window.screen?.width;
    ctx.sh = window.screen?.height;
  } catch {
    /* screen or language unavailable */
  }

  return ctx;
}

function enqueue(event: QueuedEvent): void {
  if (disabled) return;

  queue.push(event);
  // Drop the oldest rather than the newest: recent events describe what the
  // visitor is doing now, which is the more useful half if we must lose some.
  if (queue.length > MAX_QUEUE) {
    queue = queue.slice(queue.length - MAX_QUEUE);
  }

  if (queue.length >= BATCH_SIZE) {
    flush();
    return;
  }

  if (flushTimer === null) {
    flushTimer = setTimeout(() => {
      flushTimer = null;
      safely("scheduled flush", flush);
    }, FLUSH_DELAY_MS);
  }
}

/**
 * Send whatever is queued.
 *
 * `beacon` is set when the page is going away, in which case sendBeacon is the
 * only transport the browser guarantees to finish. The queue is cleared before
 * sending, so a transport that throws cannot cause the same events to be
 * retried forever.
 */
function flush(beacon = false): void {
  if (disabled || queue.length === 0) return;

  if (flushTimer !== null) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  const events = queue;
  queue = [];

  const payload = JSON.stringify({ sid: getSessionId(), ctx: context, events });
  const url = `${API_BASE}/e`;

  // text/plain keeps this a CORS-simple request. An application/json beacon
  // would be preflighted, and a preflight fired during unload often does not
  // complete, losing the batch that matters most.
  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "text/plain;charset=UTF-8" });
      if (navigator.sendBeacon(url, blob)) {
        failures = 0;
        return;
      }
      // Returns false when the browser refuses it outright (queue full, or a
      // blocker intercepted it). Treat as a failure and try fetch, unless the
      // page is going away, where fetch will not finish either.
      noteFailure();
      if (beacon) return;
    }
  } catch (err) {
    debug("sendBeacon threw", err);
    noteFailure();
    if (beacon) return;
  }

  sendWithFetch(url, payload);
}

/** Fallback for browsers without sendBeacon, and for beacons the browser refused. */
function sendWithFetch(url: string, payload: string): void {
  if (disabled) return;
  try {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = controller
      ? setTimeout(() => {
          try {
            controller.abort();
          } catch {
            /* already settled */
          }
        }, FETCH_TIMEOUT_MS)
      : null;

    void fetch(url, {
      method: "POST",
      body: payload,
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      keepalive: true,
      mode: "cors",
      credentials: "omit",
      signal: controller ? controller.signal : undefined,
    })
      .then(() => {
        failures = 0;
      })
      .catch((err) => {
        debug("fetch failed", err);
        noteFailure();
      })
      .finally(() => {
        if (timer !== null) clearTimeout(timer);
      });
  } catch (err) {
    debug("fetch threw", err);
    noteFailure();
  }
}

/**
 * Trip the circuit breaker after repeated failures.
 *
 * An ad blocker or a dead endpoint should cost a handful of failed sends, not
 * one per click for the rest of the visit.
 */
function noteFailure(): void {
  failures += 1;
  if (failures >= MAX_FAILURES) {
    disabled = true;
    queue = [];
    debug("collection disabled after repeated failures");
  }
}

/** Resolve the tracking id for a clicked element, walking up to the document. */
function findTracked(start: Element | null): { target: string; kind: EventKind } | null {
  let node: Element | null = start;
  let depth = 0;

  // Bounded walk: deep DOM plus a click handler is not somewhere to spend time.
  while (node && depth < 12) {
    const tracked = node.getAttribute?.("data-track");
    if (tracked) return { target: tracked.slice(0, 200), kind: "click" };

    if (node.tagName === "A") {
      const href = (node as HTMLAnchorElement).href;
      // eslint-disable-next-line no-script-url -- matching the scheme in order to skip it
      if (href && !href.startsWith("javascript:")) {
        try {
          const url = new URL(href, window.location.href);
          if (url.hostname && url.hostname !== window.location.hostname) {
            return { target: href.slice(0, 500), kind: "outbound" };
          }
        } catch {
          /* unparseable href; not worth recording */
        }
      }
      return null;
    }

    node = node.parentElement;
    depth += 1;
  }
  return null;
}

function onClick(event: Event): void {
  safely("click", () => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const found = findTracked(target);
    if (!found) return;
    enqueue({ k: found.kind, p: lastPath, t: found.target, ts: Date.now() });
  });
}

function onVisibilityChange(): void {
  safely("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush(true);
  });
}

function onPageHide(): void {
  safely("pagehide", () => {
    enqueue({ k: "session_end", p: lastPath, ts: Date.now() });
    flush(true);
  });
}

/**
 * Record a page view. Safe to call on every route change; repeats of the
 * current path are ignored, since HashRouter re-renders more often than a
 * visitor actually navigates.
 */
export function trackPageview(path: string): void {
  safely("pageview", () => {
    if (disabled || !started || path === lastPath) return;
    lastPath = path;
    enqueue({ k: "pageview", p: path, ts: Date.now() });
  });
}

/** Record a custom event from application code. */
export function trackEvent(
  target: string,
  meta?: Record<string, string | number | boolean>,
): void {
  safely("event", () => {
    if (disabled || !started) return;
    enqueue({ k: "click", p: lastPath, t: target.slice(0, 200), ts: Date.now(), m: meta });
  });
}

/**
 * Start collecting. Idempotent, and a no-op when collection is switched off.
 *
 * Listeners are attached in the capture phase and passive, so nothing here can
 * interfere with the site's own handlers or delay a navigation.
 */
export function initAnalytics(initialPath: string): void {
  safely("init", () => {
    if (started || disabled) return;
    if (!shouldCollect()) {
      disabled = true;
      return;
    }

    started = true;
    context = buildContext(initialPath);

    document.addEventListener("click", onClick, { capture: true, passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    // pagehide rather than unload: unload is ignored on iOS Safari and blocks
    // the back/forward cache everywhere else.
    window.addEventListener("pagehide", onPageHide);

    trackPageview(initialPath);
  });
}

/** Detach listeners and drop anything queued. Exported for tests. */
export function stopAnalytics(): void {
  safely("stop", () => {
    document.removeEventListener("click", onClick, { capture: true } as EventListenerOptions);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("pagehide", onPageHide);
    if (flushTimer !== null) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    started = false;
    disabled = false;
    failures = 0;
    queue = [];
    lastPath = "";
    sessionId = "";
    context = {};
  });
}
