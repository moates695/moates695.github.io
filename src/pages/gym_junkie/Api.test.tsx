/**
 * Tests for the public API page.
 *
 * The page hands a visitor a live console pointed at their own account, so the
 * things worth pinning are the guards rather than the layout. A route that
 * needs a token must refuse to fire without one, queueing an account deletion
 * must take a deliberate confirmation rather than a single click, and a token
 * the server has expired must not linger in storage looking valid.
 */
import { render, screen, waitFor, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Api from "./Api";
import { API_ROUTES } from "../../middleware/gymJunkieApi";
import { loadSession } from "../../middleware/gymJunkieSession";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/gym-junkie/api"]}>
      <Api />
    </MemoryRouter>
  );
}

/** Put a live export session in storage, as a completed sign-in would. */
function signIn(minutesLeft = 15) {
  localStorage.setItem("gym_junkie_export_token", "tok_live");
  localStorage.setItem("gym_junkie_export_email", "lifter@example.com");
  localStorage.setItem(
    "gym_junkie_export_expires",
    String(Date.now() + minutesLeft * 60 * 1000)
  );
}

/** The sign-in panel, so its fields are not confused with the console's. */
function authPanel(container: HTMLElement) {
  const panel = container.querySelector<HTMLElement>("#auth-panel");
  if (!panel) throw new Error("no auth panel");
  return within(panel);
}

function sendButton(container: HTMLElement, routeId: string): HTMLButtonElement {
  const button = container.querySelector<HTMLButtonElement>(
    `[data-track="gym-junkie-api:send-${routeId}"]`
  );
  if (!button) throw new Error(`no send button for ${routeId}`);
  return button;
}

/** Interactions kick off fetches, so settle their state updates before asserting. */
async function interact(run: () => void) {
  await act(async () => {
    run();
  });
}

const fetchMock = jest.fn();

beforeEach(() => {
  localStorage.clear();
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
  // jsdom has no blob URL support, and the console mints one for every response
  // so it can offer the body as a download.
  global.URL.createObjectURL = jest.fn(() => "blob:stub");
  global.URL.revokeObjectURL = jest.fn();
});

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ "Content-Type": "application/json" }),
    json: async () => body,
    text: async () => JSON.stringify(body),
    blob: async () => new Blob([JSON.stringify(body)]),
  } as unknown as Response;
}

test("documents every route in the catalogue", () => {
  renderPage();

  for (const route of API_ROUTES) {
    expect(screen.getAllByText(route.path).length).toBeGreaterThan(0);
  }
});

test("a route needing a token cannot be sent while signed out", () => {
  const { container } = renderPage();

  expect(sendButton(container, "profile")).toBeDisabled();
  expect(screen.getAllByText(/sign in at the top of the page/i).length).toBeGreaterThan(0);
  expect(fetchMock).not.toHaveBeenCalled();
});

test("a route with an unfilled required parameter cannot be sent", async () => {
  signIn();
  const { container } = renderPage();

  await waitFor(() => expect(authPanel(container).getByText(/^signed in$/i)).toBeInTheDocument());
  // workout_id has no default, so the FIT download stays shut until one is given.
  expect(sendButton(container, "workout-fit")).toBeDisabled();
});

test("queueing an account deletion needs a confirmation, not one click", async () => {
  signIn();
  fetchMock.mockResolvedValue(jsonResponse({ status: "queued" }));
  const { container } = renderPage();

  await waitFor(() => expect(authPanel(container).getByText(/^signed in$/i)).toBeInTheDocument());

  await interact(() => userEvent.click(sendButton(container, "account-delete")));
  expect(fetchMock).not.toHaveBeenCalled();
  expect(screen.getByText(/queue your account for deletion\?/i)).toBeInTheDocument();

  await interact(() => userEvent.click(screen.getByRole("button", { name: /queue deletion/i })));

  await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toContain("/export/account/delete-request");
  expect(init.method).toBe("POST");
});

test("cancelling the deletion dialog sends nothing", async () => {
  signIn();
  const { container } = renderPage();

  await waitFor(() => expect(authPanel(container).getByText(/^signed in$/i)).toBeInTheDocument());

  await interact(() => userEvent.click(sendButton(container, "account-delete")));
  await interact(() => userEvent.click(screen.getByRole("button", { name: /cancel/i })));

  expect(fetchMock).not.toHaveBeenCalled();
});

test("a 401 clears the stored session so an expired token cannot be reused", async () => {
  signIn();
  fetchMock.mockResolvedValue(jsonResponse({ detail: "Export session expired" }, 401));
  const { container } = renderPage();

  await waitFor(() => expect(authPanel(container).getByText(/^signed in$/i)).toBeInTheDocument());

  await interact(() => userEvent.click(sendButton(container, "profile")));

  await waitFor(() => expect(screen.getByText(/token has expired/i)).toBeInTheDocument());
  expect(loadSession()).toBeNull();
});

test("a session stored past its expiry is not treated as signed in", async () => {
  signIn(-1);
  renderPage();

  await waitFor(() =>
    expect(screen.getByText(/sign in to try the routes/i)).toBeInTheDocument()
  );
  expect(loadSession()).toBeNull();
});

test("signing in records the expiry the server reported", async () => {
  fetchMock
    .mockResolvedValueOnce(jsonResponse({ status: "code_sent" }))
    .mockResolvedValueOnce(
      jsonResponse({ status: "verified", export_token: "tok_new", expires_in: 900 })
    );

  const { container } = renderPage();
  const panel = () => authPanel(container);

  await interact(() => {
    userEvent.type(panel().getByLabelText(/^email$/i), "lifter@example.com");
    userEvent.type(panel().getByLabelText(/^password$/i), "hunter2");
  });
  await interact(() => userEvent.click(panel().getByRole("button", { name: /continue/i })));

  await waitFor(() => expect(panel().getByLabelText(/verification code/i)).toBeInTheDocument());

  await interact(() => userEvent.type(panel().getByLabelText(/verification code/i), "123456"));
  await interact(() => userEvent.click(panel().getByRole("button", { name: /verify/i })));

  await waitFor(() => expect(authPanel(container).getByText(/^signed in$/i)).toBeInTheDocument());

  const session = loadSession();
  expect(session?.token).toBe("tok_new");
  expect(session?.expiresAt).toBeGreaterThan(Date.now());
  // 15 minutes, as the server said, not a guess made in the browser.
  expect(session!.expiresAt! - Date.now()).toBeLessThanOrEqual(900 * 1000);
});

test("filtering narrows the reference to matching routes", async () => {
  renderPage();

  await interact(() => userEvent.type(screen.getByPlaceholderText(/filter routes/i), "fit"));

  expect(screen.getAllByText("/export/workouts/{workout_id}/fit").length).toBeGreaterThan(0);
  expect(screen.queryByText("/export/profile")).not.toBeInTheDocument();
});

test("wrong credentials say so without revealing whether the account exists", async () => {
  fetchMock.mockResolvedValue(jsonResponse({ status: "invalid_credentials" }));

  const { container } = renderPage();
  const panel = () => authPanel(container);

  await interact(() => {
    userEvent.type(panel().getByLabelText(/^email$/i), "nobody@example.com");
    userEvent.type(panel().getByLabelText(/^password$/i), "wrong");
  });
  await interact(() => userEvent.click(panel().getByRole("button", { name: /continue/i })));

  await waitFor(() =>
    expect(screen.getByText(/did not match an account/i)).toBeInTheDocument()
  );
  expect(screen.queryByText(/no such account/i)).not.toBeInTheDocument();
});

test("a rate limited call reports the wait instead of failing silently", async () => {
  signIn();
  fetchMock.mockResolvedValue({
    ok: false,
    status: 429,
    headers: new Headers({ "Retry-After": "120", "Content-Type": "application/json" }),
    json: async () => ({ detail: "Too many requests for this account." }),
    text: async () => "",
    blob: async () => new Blob(),
  } as unknown as Response);

  const { container } = renderPage();
  await waitFor(() => expect(authPanel(container).getByText(/^signed in$/i)).toBeInTheDocument());

  await interact(() => userEvent.click(sendButton(container, "profile")));

  await waitFor(() =>
    expect(screen.getByText(/too many requests for this account/i)).toBeInTheDocument()
  );
  expect(screen.getByText(/2 minutes/i)).toBeInTheDocument();
});
