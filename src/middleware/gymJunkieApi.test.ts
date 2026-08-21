/**
 * Tests for the public API catalogue.
 *
 * The catalogue is the single source the reference, the console and the cURL
 * snippet all read from, so a mistake here shows up three ways at once. These
 * pin the request building that is easy to get subtly wrong: an empty optional
 * filter must be left out rather than sent blank (the server treats an absent
 * date and an empty one differently), a token must never be attached to a route
 * that does not take one, and the cURL line must describe the same call the
 * console sends.
 */
import {
  API_BASE,
  API_GROUPS,
  API_ROUTES,
  buildBody,
  buildInit,
  buildUrl,
  defaultValues,
  toCurl,
} from "./gymJunkieApi";

const BASE = "https://api.test";

function routeById(id: string) {
  const route = API_ROUTES.find((r) => r.id === id);
  if (!route) throw new Error(`no route ${id}`);
  return route;
}

test("the documented base URL is the public host, never a dev fallback", () => {
  // The page prints this on screen and bakes it into every cURL line, so a
  // localhost value would ship snippets nobody else can run.
  expect(API_BASE).toBe("https://gymjunkie.moates.com.au");
  expect(API_BASE).not.toMatch(/localhost|127\.0\.0\.1/);
});

test("a call built with no explicit base targets the public host", () => {
  const route = API_ROUTES.find((r) => r.id === "profile")!;
  expect(buildUrl(route, { format: "json" })).toBe(
    "https://gymjunkie.moates.com.au/export/profile?format=json"
  );
  expect(toCurl(route, { format: "json" }, "tok")).toContain(
    "https://gymjunkie.moates.com.au/export/profile"
  );
});

test("every route belongs to a known group and has a unique id", () => {
  const ids = API_ROUTES.map((r) => r.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const route of API_ROUTES) {
    expect(API_GROUPS).toContain(route.group as (typeof API_GROUPS)[number]);
    expect(route.path.startsWith("/export")).toBe(true);
  }
});

test("only the account deletion route is marked destructive", () => {
  const destructive = API_ROUTES.filter((r) => r.destructive).map((r) => r.id);
  expect(destructive).toEqual(["account-delete"]);
});

test("the two sign-in routes are the only ones that need no token", () => {
  const open = API_ROUTES.filter((r) => !r.auth).map((r) => r.id);
  expect(open.sort()).toEqual(["auth-initiate", "auth-verify"]);
});

test("empty optional query parameters are dropped from the URL", () => {
  const route = routeById("workouts");
  const url = buildUrl(route, { format: "json", start_date: "", end_date: "" }, BASE);

  expect(url).toBe(`${BASE}/export/workouts?format=json`);
  expect(url).not.toContain("start_date");
});

test("filled query parameters are carried through", () => {
  const route = routeById("workouts");
  const url = buildUrl(
    route,
    { format: "csv", start_date: "2026-01-01", end_date: "2026-02-01" },
    BASE
  );

  expect(url).toBe(`${BASE}/export/workouts?format=csv&start_date=2026-01-01&end_date=2026-02-01`);
});

test("path placeholders are substituted and encoded", () => {
  const route = routeById("workout-fit");
  expect(buildUrl(route, { workout_id: "abc/123" }, BASE)).toBe(
    `${BASE}/export/workouts/abc%2F123/fit`
  );
});

test("an unfilled path placeholder is left as the route's shape", () => {
  const route = routeById("workout-fit");
  expect(buildUrl(route, { workout_id: "" }, BASE)).toBe(`${BASE}/export/workouts/{workout_id}/fit`);
});

test("a token is attached only to routes that take one", () => {
  const headers = (id: string) =>
    buildInit(routeById(id), defaultValues(routeById(id)), "tok_123").headers as Record<string, string>;

  expect(headers("profile").Authorization).toBe("Bearer tok_123");
  expect(headers("auth-initiate").Authorization).toBeUndefined();
});

test("body parameters are typed, with booleans sent as booleans", () => {
  const route = routeById("auth-initiate");
  const body = buildBody(route, {
    email: "a@b.com",
    password: "secret",
    sign_in_method: "email",
    send_email: "false",
  });

  expect(body).toEqual({
    email: "a@b.com",
    password: "secret",
    sign_in_method: "email",
    send_email: false,
  });
});

test("routes without a body send none", () => {
  expect(buildBody(routeById("profile"), { format: "json" })).toBeNull();
  expect(buildInit(routeById("profile"), { format: "json" }, "t").body).toBeUndefined();
});

test("cURL describes the same call the console would send", () => {
  const route = routeById("metrics");
  const values = { format: "json", metric_type: "weight" };
  const curl = toCurl(route, values, "tok_123", BASE);

  expect(curl).toContain(buildUrl(route, values, BASE));
  expect(curl).toContain("-H 'Authorization: Bearer tok_123'");
  expect(curl).toContain("-X GET");
});

test("cURL shows a placeholder rather than a blank header when signed out", () => {
  const curl = toCurl(routeById("profile"), { format: "json" }, null, BASE);
  expect(curl).toContain("Bearer <export_token>");
});

test("defaults match what the server assumes when a parameter is omitted", () => {
  expect(defaultValues(routeById("metrics"))).toEqual({ format: "json", metric_type: "all" });
});
