/**
 * Tests for the public stats page.
 *
 * The service is mocked, so these are stateless and need no network. What they
 * pin down is the behaviour that is easy to break later: the range filter asks
 * the service for the window it claims to show, a rate limited or failed read
 * degrades to a message instead of a blank page, and nothing that identifies a
 * visitor is rendered even if the service somehow sends it.
 */
import { render, screen, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Stats from "./Stats";

const SUMMARY = {
  generated_at: "2026-08-16T02:00:00Z",
  range: { key: "7d", label: "7 days", since: "2026-08-09T02:00:00Z", days: 7 },
  collecting_since: "2026-08-13T00:28:40Z",
  last_event: "2026-08-15T13:24:16Z",
  bucket: "day",
  totals: {
    sessions: 8,
    visitors: 8,
    events: 36,
    pageviews: 24,
    clicks: 5,
    outbound: 1,
    avg_events: 4.5,
    median_seconds: 70,
    bounce_pct: 12.5,
    bot_sessions: 3,
  },
  series: [
    { t: "2026-08-14T00:00:00Z", sessions: 3, visitors: 3, pageviews: 18 },
    { t: "2026-08-15T00:00:00Z", sessions: 5, visitors: 5, pageviews: 6 },
  ],
  pages: [{ label: "/projects", views: 4, sessions: 2 }],
  clicks: [{ label: "nav:resume", clicks: 3, sessions: 3 }],
  outbound: [{ label: "https://github.com/moates/thing", clicks: 2, sessions: 2 }],
  referrers: [{ label: "(direct)", sessions: 8 }],
  countries: [{ label: "AU", sessions: 4, visitors: 4 }],
  cities: [{ label: "Sydney", country: "AU", sessions: 2 }],
  devices: [
    { label: "mobile", sessions: 6 },
    { label: "desktop", sessions: 2 },
  ],
  screens: [{ label: "under 480", sessions: 6 }],
  languages: [{ label: "en-AU", sessions: 3 }],
  landing: [{ label: "/", sessions: 8, bounced: 1, avg_events: 4.5 }],
  hours: [{ hour: 3, views: 12 }],
  crawlers: [{ name: "Googlebot", sessions: 2 }],
};

function mockFetch(impl: (url: string) => Partial<Response>) {
  const fn = jest.fn(async (url: string) => impl(url) as Response);
  global.fetch = fn as unknown as typeof fetch;
  return fn;
}

const ok = (body: unknown): Partial<Response> => ({
  ok: true,
  status: 200,
  json: async () => body,
});

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/stats"]}>
      <Stats />
    </MemoryRouter>,
  );
}

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders the headline figures and the date collection started", async () => {
  mockFetch(() => ok(SUMMARY));
  renderPage();

  expect(await screen.findByText("24")).toBeInTheDocument(); // page views
  // Named twice on purpose: the stat tile and the traffic chart's legend.
  expect(screen.getAllByText("Page views").length).toBeGreaterThan(0);
  expect(screen.getByText("1m 10s")).toBeInTheDocument(); // median time on site
  // Date wording follows the reader's locale, so assert on the parts that do not.
  expect(screen.getByText(/Collecting since .*2026, 3 days of data/)).toBeInTheDocument();
});

test("ranked lists render the service's rows", async () => {
  mockFetch(() => ok(SUMMARY));
  renderPage();

  expect(await screen.findByText("/projects")).toBeInTheDocument();
  expect(screen.getByText("nav:resume")).toBeInTheDocument();
  // Outbound links are shown by host, not as a raw URL.
  expect(screen.getByText("github.com")).toBeInTheDocument();
  // Country codes are resolved to names where the browser can.
  expect(screen.getAllByText(/^(Australia|AU)$/).length).toBeGreaterThan(0);
  expect(screen.getByText("Googlebot")).toBeInTheDocument();
});

test("choosing a range asks the service for that window", async () => {
  const fetched = mockFetch(() => ok(SUMMARY));
  renderPage();

  await screen.findByText("24");
  expect(fetched.mock.calls[0][0]).toContain("range=7d");

  await act(async () => {
    screen.getByText("Month").click();
  });

  await waitFor(() => expect(fetched.mock.calls.length).toBe(2));
  expect(fetched.mock.calls[1][0]).toContain("range=30d");
});

test("a rate limited read shows the wait and keeps the figures on screen", async () => {
  let first = true;
  mockFetch(() => {
    if (first) {
      first = false;
      return ok(SUMMARY);
    }
    return {
      ok: false,
      status: 429,
      headers: { get: (name: string) => (name === "Retry-After" ? "90" : null) } as Headers,
      json: async () => ({ detail: "Too many refreshes of the stats page." }),
    };
  });
  renderPage();
  await screen.findByText("24");

  await act(async () => {
    screen.getByText("Month").click();
  });

  expect(await screen.findByText(/Too many refreshes/)).toBeInTheDocument();
  // The previous window's numbers stay put rather than the page emptying.
  expect(screen.getByText("24")).toBeInTheDocument();
});

test("an unreachable service leaves a readable page rather than an error", async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error("offline")) as unknown as typeof fetch;
  renderPage();

  expect(await screen.findByText(/Could not reach the stats service/)).toBeInTheDocument();
  expect(screen.getByText("Measured, not tracked")).toBeInTheDocument();
});

test("nothing identifying a visitor is rendered", async () => {
  // The service does not send these, and the page must not grow a way to show
  // them: this fails loudly if a future payload field is rendered blindly.
  mockFetch(() =>
    ok({
      ...SUMMARY,
      cities: [{ label: "Sydney", country: "AU", sessions: 2, ip_hash: "deadbeef00", user_agent: "Mozilla/5.0 Secret" }],
    }),
  );
  const { container } = renderPage();
  await screen.findByText("24");

  expect(container.textContent).not.toContain("deadbeef00");
  expect(container.textContent).not.toContain("Mozilla/5.0");
});
