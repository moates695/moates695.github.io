/**
 * Catalogue of the Gym Junkie public API.
 *
 * This is the credentialed data API a Gym Junkie user can call themselves. It
 * is deliberately not the app's internal API: the phone app signs in for an
 * access token that reaches every route on the server, whereas everything here
 * hangs off `/export` and is reachable only with a short-lived export token
 * minted after a second factor. The two never share a token type.
 *
 * The catalogue is data rather than markup so the API page can render the
 * reference, drive the in-page console, and build a cURL line from one source.
 * Descriptions and limits mirror `app/api/routes/export/*` on the server; when
 * a route changes there, change it here.
 */

/**
 * Where the public API actually lives.
 *
 * Fixed on purpose, unlike the sibling Data Export and Delete Account pages,
 * which fall back to `http://localhost:8000` under `npm start` so the flow can
 * be driven against a local server. This page publishes the base URL as
 * documentation and bakes it into every cURL line, so it has to name the host a
 * reader can actually reach. A dev-only value here would put `localhost:8000`
 * on screen and into snippets people copy.
 */
export const API_BASE = "https://gymjunkie.moates.com.au";

/** Where a parameter rides: in the path, the query string, or a JSON body. */
export type ParamKind = "path" | "query" | "body";

export type ParamType = "string" | "password" | "enum" | "boolean" | "date";

export interface ApiParam {
  name: string;
  kind: ParamKind;
  type: ParamType;
  description: string;
  required?: boolean;
  /** Allowed values for an enum. */
  options?: string[];
  /** Value the server assumes when the parameter is omitted. */
  default?: string;
  placeholder?: string;
}

/** What comes back, which decides how the console renders a response. */
export type ResponseKind = "json" | "json-or-csv" | "file";

export interface ApiRoute {
  id: string;
  group: string;
  method: "GET" | "POST";
  path: string;
  summary: string;
  description: string;
  /** True when the route needs an export token in the Authorization header. */
  auth: boolean;
  params: ApiParam[];
  returns: string;
  responseKind: ResponseKind;
  /** Server-side caps, shown so a caller can pace themselves before a 429. */
  limits: string[];
  /** Routes that change account state, held behind a confirmation. */
  destructive?: boolean;
}

/** Section order for the reference; groups render in this sequence. */
export const API_GROUPS = [
  "Authentication",
  "Profile",
  "Workouts",
  "Everything",
  "Account",
] as const;

const FORMAT_PARAM: ApiParam = {
  name: "format",
  kind: "query",
  type: "enum",
  options: ["json", "csv"],
  default: "json",
  description: "Response format. CSV arrives as a file attachment.",
};

const DATE_PARAMS: ApiParam[] = [
  {
    name: "start_date",
    kind: "query",
    type: "date",
    description: "Only include workouts started on or after this date.",
  },
  {
    name: "end_date",
    kind: "query",
    type: "date",
    description: "Only include workouts started on or before this date.",
  },
];

export const API_ROUTES: ApiRoute[] = [
  /* --------------------------- Authentication --------------------------- */
  {
    id: "auth-initiate",
    group: "Authentication",
    method: "POST",
    path: "/export/auth/initiate",
    summary: "Check credentials and start a sign-in",
    description:
      "First half of the sign-in. Verifies your Gym Junkie email and password, then emails you a 6-digit code. " +
      "An unknown email and a wrong password get the same answer, so this cannot be used to find out who has an account. " +
      "Set sign_in_method to authenticator to skip the email and use a TOTP code from your authenticator app instead.",
    auth: false,
    params: [
      { name: "email", kind: "body", type: "string", required: true, description: "The email on your Gym Junkie account.", placeholder: "you@example.com" },
      { name: "password", kind: "body", type: "password", required: true, description: "Your Gym Junkie password. Never stored by this page." },
      {
        name: "sign_in_method",
        kind: "body",
        type: "enum",
        options: ["email", "authenticator"],
        default: "email",
        description: "Where the second factor comes from: a code emailed to you, or your authenticator app.",
      },
      {
        name: "send_email",
        kind: "body",
        type: "boolean",
        default: "true",
        description: "Set false to check the password without sending an email.",
      },
    ],
    returns:
      'status is one of code_sent, invalid_credentials, authenticator_required or authenticator_not_enabled.',
    responseKind: "json",
    limits: ["5 per minute and 20 per hour per caller", "3 per 15 minutes per account"],
  },
  {
    id: "auth-verify",
    group: "Authentication",
    method: "POST",
    path: "/export/auth/verify",
    summary: "Exchange the code for an export token",
    description:
      "Second half of the sign-in. Send back the 6-digit code and you get an export token good for 15 minutes. " +
      "The code expires after 15 minutes, and five wrong guesses burn it, so a failed run has to start again at initiate.",
    auth: false,
    params: [
      { name: "email", kind: "body", type: "string", required: true, description: "The same email you sent to initiate.", placeholder: "you@example.com" },
      { name: "code", kind: "body", type: "string", required: true, description: "The 6-digit code, with or without the hyphen.", placeholder: "123456" },
      {
        name: "sign_in_method",
        kind: "body",
        type: "enum",
        options: ["email", "authenticator"],
        default: "email",
        description: "Must match the method you used at initiate.",
      },
    ],
    returns:
      "On success, status verified with an export_token and expires_in of 900 seconds. Otherwise invalid_code, code_expired, and an attempts_remaining count.",
    responseKind: "json",
    limits: ["10 per minute and 20 per hour per caller", "20 per hour per account", "5 wrong codes burns the code"],
  },

  /* ------------------------------- Profile ------------------------------ */
  {
    id: "profile",
    group: "Profile",
    method: "GET",
    path: "/export/profile",
    summary: "Your account details",
    description:
      "Email, username, name, gender, date of birth and the date you joined.",
    auth: true,
    params: [FORMAT_PARAM],
    returns: "An exported_at stamp, your user_id, and a profile object.",
    responseKind: "json-or-csv",
    limits: ["30 per minute and 200 per hour"],
  },
  {
    id: "metrics",
    group: "Profile",
    method: "GET",
    path: "/export/metrics",
    summary: "Body metric history",
    description:
      "Every weight, height, bodyfat, goal and PED status entry you have logged, newest first. " +
      "Narrow it to one series with metric_type, or take the lot with all.",
    auth: true,
    params: [
      FORMAT_PARAM,
      {
        name: "metric_type",
        kind: "query",
        type: "enum",
        options: ["all", "weight", "height", "bodyfat", "goals", "ped_status"],
        default: "all",
        description: "Which series to return.",
      },
    ],
    returns: "One array per requested series, each entry carrying a value and a recorded_at.",
    responseKind: "json-or-csv",
    limits: ["30 per minute and 200 per hour"],
  },
  {
    id: "exercise-notes",
    group: "Profile",
    method: "GET",
    path: "/export/exercise-notes",
    summary: "Notes you have written on exercises",
    description: "Your per-exercise notes with the exercise name and when each note was written and last changed.",
    auth: true,
    params: [FORMAT_PARAM],
    returns: "A notes array, newest edit first.",
    responseKind: "json-or-csv",
    limits: ["30 per minute and 200 per hour"],
  },

  /* ------------------------------ Workouts ------------------------------ */
  {
    id: "workouts-list",
    group: "Workouts",
    method: "GET",
    path: "/export/workouts/list",
    summary: "Index of your workouts",
    description:
      "A light index: id, title, start time and duration for each workout, newest first. " +
      "Use it to find the workout id you need for a FIT download.",
    auth: true,
    params: DATE_PARAMS,
    returns: "An array of workouts with id, title, started_at and duration_secs.",
    responseKind: "json",
    limits: ["30 per minute and 200 per hour"],
  },
  {
    id: "workouts",
    group: "Workouts",
    method: "GET",
    path: "/export/workouts",
    summary: "Full workouts with exercises and sets",
    description:
      "Every workout in full: each exercise, each set group, the reps, weight and set count. " +
      "In CSV the nesting is flattened to one row per set group.",
    auth: true,
    params: [FORMAT_PARAM, ...DATE_PARAMS],
    returns: "A workouts array, each with a nested exercises and set_groups tree.",
    responseKind: "json-or-csv",
    limits: ["30 per minute and 200 per hour"],
  },
  {
    id: "workouts-summary",
    group: "Workouts",
    method: "GET",
    path: "/export/workouts/summary",
    summary: "Aggregated training totals",
    description: "Totals rolled up across your training history rather than the workout-by-workout detail.",
    auth: true,
    params: [FORMAT_PARAM],
    returns: "Aggregate workout statistics.",
    responseKind: "json-or-csv",
    limits: ["30 per minute and 200 per hour"],
  },
  {
    id: "exercise-records",
    group: "Workouts",
    method: "GET",
    path: "/export/exercise-records",
    summary: "Personal records per exercise",
    description: "Your best recorded effort for every exercise you have trained.",
    auth: true,
    params: [FORMAT_PARAM],
    returns: "A records array, one entry per exercise.",
    responseKind: "json-or-csv",
    limits: ["30 per minute and 200 per hour"],
  },
  {
    id: "workout-fit",
    group: "Workouts",
    method: "GET",
    path: "/export/workouts/{workout_id}/fit",
    summary: "Download one workout as a Garmin FIT file",
    description:
      "Builds a Garmin-compatible FIT file for a single workout, heart rate included where it was recorded. " +
      "Each file is encoded on request, which is why this route is capped harder than the rest.",
    auth: true,
    params: [
      {
        name: "workout_id",
        kind: "path",
        type: "string",
        required: true,
        description: "A workout id from /export/workouts/list.",
        placeholder: "workout id",
      },
    ],
    returns: "A binary FIT file (application/vnd.ant.fit).",
    responseKind: "file",
    limits: ["30 per minute and 60 per hour per token"],
  },

  /* ----------------------------- Everything ----------------------------- */
  {
    id: "all",
    group: "Everything",
    method: "GET",
    path: "/export/all",
    summary: "Every record in one response",
    description:
      "Profile, metrics, workouts, records and notes in a single JSON document. This is the whole-account export; there is no CSV form.",
    auth: true,
    params: [],
    returns: "One JSON object holding every section.",
    responseKind: "json",
    limits: ["30 per minute and 200 per hour"],
  },

  /* ------------------------------- Account ------------------------------ */
  {
    id: "account-delete",
    group: "Account",
    method: "POST",
    path: "/export/account/delete-request",
    summary: "Queue your account for deletion",
    description:
      "Queues the signed-in account for manual deletion. Calling it twice does nothing extra. " +
      "This is the same request the Delete Account page makes, and it cannot be undone from here.",
    auth: true,
    params: [],
    returns: 'status: "queued".',
    responseKind: "json",
    limits: ["1 per hour per token"],
    destructive: true,
  },
];

/** Values typed into the console, keyed by parameter name. */
export type ParamValues = Record<string, string>;

/** The value a parameter carries when the caller has not typed one. */
export function defaultValues(route: ApiRoute): ParamValues {
  const values: ParamValues = {};
  for (const param of route.params) values[param.name] = param.default ?? "";
  return values;
}

/**
 * Path with `{placeholders}` filled in. An untouched placeholder is left as it
 * is so the reference and the cURL line still read as the route's shape.
 */
function resolvePath(route: ApiRoute, values: ParamValues): string {
  return route.path.replace(/\{(\w+)\}/g, (match, name) => {
    const value = values[name]?.trim();
    return value ? encodeURIComponent(value) : match;
  });
}

/**
 * Full URL for a call. Query parameters left empty are dropped rather than sent
 * blank, since the server treats an absent parameter and an empty one
 * differently for the optional date filters.
 */
export function buildUrl(route: ApiRoute, values: ParamValues, base: string = API_BASE): string {
  const query = new URLSearchParams();
  for (const param of route.params) {
    if (param.kind !== "query") continue;
    const value = values[param.name]?.trim();
    if (value) query.set(param.name, value);
  }
  const search = query.toString();
  return `${base}${resolvePath(route, values)}${search ? `?${search}` : ""}`;
}

/** JSON body for a route that takes one, or null when it takes none. */
export function buildBody(route: ApiRoute, values: ParamValues): Record<string, unknown> | null {
  const body: Record<string, unknown> = {};
  let any = false;
  for (const param of route.params) {
    if (param.kind !== "body") continue;
    any = true;
    const raw = values[param.name] ?? "";
    body[param.name] = param.type === "boolean" ? raw === "true" : raw;
  }
  return any ? body : null;
}

/** Request init matching what the console sends, so cURL and console agree. */
export function buildInit(route: ApiRoute, values: ParamValues, token: string | null): RequestInit {
  const headers: Record<string, string> = {};
  if (route.auth && token) headers.Authorization = `Bearer ${token}`;
  const body = buildBody(route, values);
  if (body) headers["Content-Type"] = "application/json";
  return {
    method: route.method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
}

/** A copy-pasteable cURL line for the call as it is currently configured. */
export function toCurl(
  route: ApiRoute,
  values: ParamValues,
  token: string | null,
  base: string = API_BASE
): string {
  const parts = [`curl -X ${route.method} '${buildUrl(route, values, base)}'`];
  if (route.auth) {
    parts.push(`  -H 'Authorization: Bearer ${token || "<export_token>"}'`);
  }
  const body = buildBody(route, values);
  if (body) {
    parts.push("  -H 'Content-Type: application/json'");
    parts.push(`  -d '${JSON.stringify(body)}'`);
  }
  if (route.responseKind === "file") {
    parts.push("  -OJ");
  }
  return parts.join(" \\\n");
}

/** Routes in a group, in catalogue order. */
export function routesInGroup(group: string): ApiRoute[] {
  return API_ROUTES.filter((route) => route.group === group);
}
