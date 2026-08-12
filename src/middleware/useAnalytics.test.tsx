/**
 * Integration tests for the analytics hook.
 *
 * These exist to prove the guarantee that matters: a component tree using the
 * hook renders and navigates identically whether the collector works, is
 * blocked, or throws on every call.
 */

import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import useAnalytics from "./useAnalytics";
import { stopAnalytics } from "./analytics";

type Beacon = { body: string };

class RecordingBlob {
  _text: string;
  type: string;
  constructor(parts: string[], opts?: { type?: string }) {
    this._text = parts.join("");
    this.type = opts?.type ?? "";
  }
}

function captureBeacons(): Beacon[] {
  const sent: Beacon[] = [];
  Object.defineProperty(navigator, "sendBeacon", {
    configurable: true,
    writable: true,
    value: (_url: string, blob: Blob) => {
      sent.push({ body: (blob as unknown as { _text?: string })._text ?? "" });
      return true;
    },
  });
  return sent;
}

function Page({ label }: { label: string }) {
  const navigate = useNavigate();
  return (
    <div>
      <h1>{label}</h1>
      <button onClick={() => navigate("/about")} data-track="go-about">
        Go to about
      </button>
    </div>
  );
}

function Harness() {
  useAnalytics();
  return (
    <Routes>
      <Route path="/" element={<Page label="Home page" />} />
      <Route path="/about" element={<Page label="About page" />} />
    </Routes>
  );
}

function renderHarness() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Harness />
    </MemoryRouter>,
  );
}

/** Let the deferred init and the batch timer run. */
function settle() {
  act(() => {
    jest.runOnlyPendingTimers();
  });
}

beforeEach(() => {
  jest.useFakeTimers();
  (global as unknown as { Blob: unknown }).Blob = RecordingBlob;
  Object.defineProperty(navigator, "doNotTrack", { configurable: true, value: null });
  process.env.REACT_APP_STATS_DEV = "1";
});

afterEach(() => {
  stopAnalytics();
  jest.useRealTimers();
  delete process.env.REACT_APP_STATS_DEV;
});

test("records a page view for each route the visitor reaches", () => {
  const sent = captureBeacons();
  renderHarness();
  settle();

  act(() => {
    screen.getByText("Go to about").click();
  });
  settle();

  const paths = sent
    .flatMap((b) => JSON.parse(b.body).events)
    .filter((e: { k: string }) => e.k === "pageview")
    .map((e: { p: string }) => e.p);

  expect(paths).toEqual(["/", "/about"]);
});

test("the page still renders and navigates when every beacon throws", () => {
  Object.defineProperty(navigator, "sendBeacon", {
    configurable: true,
    writable: true,
    value: () => {
      throw new Error("blocked by extension");
    },
  });
  global.fetch = jest.fn().mockRejectedValue(new Error("blocked")) as unknown as typeof fetch;

  renderHarness();
  settle();
  expect(screen.getByText("Home page")).toBeInTheDocument();

  act(() => {
    screen.getByText("Go to about").click();
  });
  settle();

  expect(screen.getByText("About page")).toBeInTheDocument();
});

test("the page still renders when the analytics APIs are missing entirely", () => {
  Object.defineProperty(navigator, "sendBeacon", {
    configurable: true,
    writable: true,
    value: undefined,
  });
  global.fetch = undefined as unknown as typeof fetch;

  renderHarness();
  settle();

  expect(screen.getByText("Home page")).toBeInTheDocument();
});

test("mounting the hook does not cause extra renders", () => {
  captureBeacons();
  let renders = 0;

  function Counted() {
    useAnalytics();
    renders += 1;
    return <div>counted</div>;
  }

  render(
    <MemoryRouter initialEntries={["/"]}>
      <Counted />
    </MemoryRouter>,
  );
  settle();

  // The collector holds its state outside React, so init and the flush timer
  // must not schedule a single re-render.
  expect(renders).toBe(1);
});
