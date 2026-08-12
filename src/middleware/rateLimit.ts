import { useEffect, useState } from "react";

/**
 * Shared handling for the 429s the site's own backends return.
 *
 * Every one of them answers with a `detail` message and a `Retry-After` header
 * (exposed via CORS), so the page can say what happened and how long the wait
 * is instead of showing a generic failure.
 */

export interface RateLimit {
  message: string;
  /** Unix ms at which the caller may try again, or null if the wait is unknown. */
  until: number | null;
}

const FALLBACK_MESSAGE = "Too many requests. Please try again shortly.";

/** Read a 429 response into a message and an expiry. Safe on any response body. */
export async function readRateLimit(resp: Response): Promise<RateLimit> {
  let message = FALLBACK_MESSAGE;
  try {
    const body = await resp.json();
    if (typeof body?.detail === "string" && body.detail.trim()) message = body.detail;
    else if (typeof body?.message === "string" && body.message.trim()) message = body.message;
  } catch {
    // A proxy-generated 429 has no JSON body; the fallback message covers it.
  }

  const header = Number(resp.headers.get("Retry-After"));
  const seconds = Number.isFinite(header) && header > 0 ? header : null;
  return { message, until: seconds === null ? null : Date.now() + seconds * 1000 };
}

/**
 * Seconds left on a rate limit, ticking down to zero.
 *
 * Returns 0 when nothing is pending or the wait is unknown, so callers can use
 * `secondsLeft > 0` to decide whether to show a countdown while still keeping
 * their controls disabled for the whole limit.
 */
export function useRateLimitCountdown(limit: RateLimit | null): number {
  const remaining = () =>
    limit?.until ? Math.max(0, Math.ceil((limit.until - Date.now()) / 1000)) : 0;
  const [secondsLeft, setSecondsLeft] = useState(remaining);

  useEffect(() => {
    setSecondsLeft(remaining);
    if (!limit?.until) return;
    const id = window.setInterval(() => setSecondsLeft(remaining), 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit?.until]);

  return secondsLeft;
}

/** "2 minutes 5 seconds" style wait, kept short enough for one line. */
export function formatWait(seconds: number): string {
  if (seconds >= 3600) {
    const hours = Math.ceil(seconds / 3600);
    return hours === 1 ? "an hour" : `${hours} hours`;
  }
  if (seconds >= 60) {
    const minutes = Math.ceil(seconds / 60);
    return minutes === 1 ? "a minute" : `${minutes} minutes`;
  }
  return seconds === 1 ? "1 second" : `${seconds} seconds`;
}
