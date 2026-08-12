import { formatWait, readRateLimit } from "./rateLimit";

/** Minimal stand-in for a fetch Response carrying a 429. */
function response(body: unknown, headers: Record<string, string> = {}): Response {
  return {
    headers: { get: (name: string) => headers[name] ?? null },
    json: async () => {
      if (body === undefined) throw new Error("no body");
      return body;
    },
  } as unknown as Response;
}

describe("readRateLimit", () => {
  it("uses the API's own message", async () => {
    const limit = await readRateLimit(response({ detail: "Daily question limit reached." }));
    expect(limit.message).toBe("Daily question limit reached.");
  });

  it("turns Retry-After into an expiry", async () => {
    const before = Date.now();
    const limit = await readRateLimit(response({ detail: "slow down" }, { "Retry-After": "60" }));

    expect(limit.until).not.toBeNull();
    expect(limit.until as number).toBeGreaterThanOrEqual(before + 59_000);
    expect(limit.until as number).toBeLessThanOrEqual(Date.now() + 61_000);
  });

  it("leaves the expiry unknown without a Retry-After", async () => {
    const limit = await readRateLimit(response({ detail: "slow down" }));
    expect(limit.until).toBeNull();
  });

  it("falls back to a generic message for a body-less proxy 429", async () => {
    const limit = await readRateLimit(response(undefined));
    expect(limit.message).toBe("Too many requests. Please try again shortly.");
  });

  it("ignores a nonsense Retry-After", async () => {
    const limit = await readRateLimit(response({}, { "Retry-After": "Wed, 21 Oct 2026 07:28:00 GMT" }));
    expect(limit.until).toBeNull();
  });
});

describe("formatWait", () => {
  it("reads naturally at each scale", () => {
    expect(formatWait(1)).toBe("1 second");
    expect(formatWait(45)).toBe("45 seconds");
    expect(formatWait(60)).toBe("a minute");
    expect(formatWait(150)).toBe("3 minutes");
    expect(formatWait(3600)).toBe("an hour");
    expect(formatWait(7200)).toBe("2 hours");
  });
});
