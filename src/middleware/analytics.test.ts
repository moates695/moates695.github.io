/**
 * Tests for the analytics collector.
 *
 * The point of most of these is not that collection works, but that its failure
 * modes are invisible: a blocked endpoint, an unavailable API, or a throwing
 * storage layer must all degrade to "no analytics" and nothing else.
 */

import { initAnalytics, stopAnalytics, trackEvent, trackPageview } from "./analytics";

const ORIGINAL = {
  sendBeacon: navigator.sendBeacon,
  fetch: global.fetch,
};

type Beacon = { url: string; body: string };

/** Install a sendBeacon that records what it was given. */
function captureBeacons(accepted = true): Beacon[] {
  const sent: Beacon[] = [];
  Object.defineProperty(navigator, "sendBeacon", {
    configurable: true,
    writable: true,
    value: (url: string, blob: Blob) => {
      // jsdom Blobs do not expose text() synchronously, so read the payload we
      // were constructed with instead of the blob body.
      sent.push({ url, body: (blob as unknown as { _text?: string })._text ?? "" });
      return accepted;
    },
  });
  return sent;
}

/** Blob in jsdom loses its contents; keep them for assertions. */
class RecordingBlob {
  _text: string;
  type: string;
  constructor(parts: string[], opts?: { type?: string }) {
    this._text = parts.join("");
    this.type = opts?.type ?? "";
  }
}

beforeEach(() => {
  jest.useFakeTimers();
  (global as unknown as { Blob: unknown }).Blob = RecordingBlob;
  Object.defineProperty(navigator, "doNotTrack", { configurable: true, value: null });
  // The collector skips localhost unless explicitly enabled, and jsdom serves
  // from localhost.
  process.env.REACT_APP_STATS_DEV = "1";
});

afterEach(() => {
  stopAnalytics();
  jest.useRealTimers();
  Object.defineProperty(navigator, "sendBeacon", {
    configurable: true,
    writable: true,
    value: ORIGINAL.sendBeacon,
  });
  global.fetch = ORIGINAL.fetch;
  delete process.env.REACT_APP_STATS_DEV;
});

function parse(beacon: Beacon) {
  return JSON.parse(beacon.body);
}

// --- It works ---------------------------------------------------------------

test("sends a pageview for the landing route", () => {
  const sent = captureBeacons();
  initAnalytics("/projects");
  jest.runOnlyPendingTimers();

  const body = parse(sent[0]);
  expect(body.events[0]).toMatchObject({ k: "pageview", p: "/projects" });
  expect(body.sid).toMatch(/^[0-9a-f-]{36}$/i);
});

test("records clicks on elements marked with data-track", () => {
  const sent = captureBeacons();
  initAnalytics("/");

  const button = document.createElement("button");
  button.setAttribute("data-track", "featured-cta:/gym-junkie");
  document.body.appendChild(button);
  button.click();
  jest.runOnlyPendingTimers();

  const events = parse(sent[0]).events;
  expect(events).toContainEqual(
    expect.objectContaining({ k: "click", t: "featured-cta:/gym-junkie" }),
  );
  button.remove();
});

test("treats links to other hosts as outbound without needing an attribute", () => {
  const sent = captureBeacons();
  initAnalytics("/");

  const link = document.createElement("a");
  link.href = "https://github.com/moates695";
  document.body.appendChild(link);
  link.click();
  jest.runOnlyPendingTimers();

  expect(parse(sent[0]).events).toContainEqual(
    expect.objectContaining({ k: "outbound", t: "https://github.com/moates695" }),
  );
  link.remove();
});

test("ignores clicks on untracked elements", () => {
  const sent = captureBeacons();
  initAnalytics("/");

  const div = document.createElement("div");
  document.body.appendChild(div);
  div.click();
  jest.runOnlyPendingTimers();

  const events = sent.flatMap((b) => parse(b).events);
  expect(events.filter((e: { k: string }) => e.k === "click")).toHaveLength(0);
  div.remove();
});

test("does not record the same route twice in a row", () => {
  const sent = captureBeacons();
  initAnalytics("/about");
  trackPageview("/about");
  trackPageview("/about");
  jest.runOnlyPendingTimers();

  const views = sent.flatMap((b) => parse(b).events).filter((e: { k: string }) => e.k === "pageview");
  expect(views).toHaveLength(1);
});

test("beacons as text/plain so the request is never preflighted", () => {
  const sent: string[] = [];
  Object.defineProperty(navigator, "sendBeacon", {
    configurable: true,
    writable: true,
    value: (_url: string, blob: Blob) => {
      sent.push(blob.type);
      return true;
    },
  });
  initAnalytics("/");
  jest.runOnlyPendingTimers();

  expect(sent[0]).toMatch(/^text\/plain/);
});

// --- It fails silently ------------------------------------------------------

test("survives a browser with no sendBeacon and no fetch", () => {
  Object.defineProperty(navigator, "sendBeacon", {
    configurable: true,
    writable: true,
    value: undefined,
  });
  global.fetch = undefined as unknown as typeof fetch;

  expect(() => {
    initAnalytics("/");
    trackPageview("/about");
    trackEvent("cta");
    jest.runOnlyPendingTimers();
  }).not.toThrow();
});

test("survives sendBeacon throwing", () => {
  Object.defineProperty(navigator, "sendBeacon", {
    configurable: true,
    writable: true,
    value: () => {
      throw new Error("blocked by extension");
    },
  });
  global.fetch = jest.fn().mockRejectedValue(new Error("blocked")) as unknown as typeof fetch;

  expect(() => {
    initAnalytics("/");
    jest.runOnlyPendingTimers();
  }).not.toThrow();
});

test("survives sessionStorage throwing on access", () => {
  const storage = Object.getOwnPropertyDescriptor(window, "sessionStorage");
  Object.defineProperty(window, "sessionStorage", {
    configurable: true,
    get() {
      throw new Error("SecurityError: storage disabled");
    },
  });
  const sent = captureBeacons();

  expect(() => {
    initAnalytics("/");
    jest.runOnlyPendingTimers();
  }).not.toThrow();
  // Still usable: the session id just lives in memory for this page load.
  expect(parse(sent[0]).sid).toMatch(/^[0-9a-f-]{36}$/i);

  if (storage) Object.defineProperty(window, "sessionStorage", storage);
});

test("gives up after repeated failures instead of retrying every click", () => {
  const sent = captureBeacons(false); // browser refuses every beacon
  global.fetch = jest.fn().mockRejectedValue(new Error("blocked")) as unknown as typeof fetch;

  initAnalytics("/");
  for (let i = 0; i < 20; i += 1) {
    trackEvent(`cta-${i}`);
    jest.runOnlyPendingTimers();
  }

  // Circuit breaker trips after MAX_FAILURES; well short of one send per event.
  expect(sent.length).toBeLessThanOrEqual(3);
});

test("does not collect when Do Not Track is set", () => {
  Object.defineProperty(navigator, "doNotTrack", { configurable: true, value: "1" });
  const sent = captureBeacons();

  initAnalytics("/");
  trackEvent("cta");
  jest.runOnlyPendingTimers();

  expect(sent).toHaveLength(0);
});

test("click handling never calls preventDefault, so navigation is unaffected", () => {
  captureBeacons();
  initAnalytics("/");

  const link = document.createElement("a");
  link.href = "https://example.com/";
  link.setAttribute("data-track", "outbound-test");
  document.body.appendChild(link);

  const event = new MouseEvent("click", { bubbles: true, cancelable: true });
  link.dispatchEvent(event);

  expect(event.defaultPrevented).toBe(false);
  link.remove();
});

test("splits a burst of events into batches the server will accept", () => {
  const sent = captureBeacons();
  initAnalytics("/");

  for (let i = 0; i < 500; i += 1) trackEvent(`cta-${i}`);
  jest.runOnlyPendingTimers();

  // The collector must never post more than the server's per-batch cap (50) or
  // more than its body limit (32 KB), whatever the visitor does.
  const sizes = sent.map((b) => parse(b).events.length);
  expect(sent.length).toBeGreaterThan(1);
  expect(Math.max(...sizes)).toBeLessThanOrEqual(50);
  expect(sent.every((b) => b.body.length < 32_768)).toBe(true);
});
