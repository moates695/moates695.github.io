/**
 * Gym Junkie public API reference and console.
 *
 * One page that documents the credentialed `/export` API and lets a signed-in
 * user call it without leaving the site. Sign-in happens once at the top and
 * the resulting export token is shared with every route card below, so trying a
 * route is a matter of filling the parameters and pressing send.
 *
 * The token is the same short-lived export token the Data Export and Delete
 * Account pages use, so signing in here signs you in there too.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SearchIcon from "@mui/icons-material/Search";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CopyButton from "../../components/CopyButton";
import {
  PageHeader,
  GradientText,
  Reveal,
  Panel,
  SectionHeading,
  CheckList,
  Callout,
  PageNav,
} from "../../components/design";
import { MONO } from "../../styles/tokens";
import {
  API_BASE,
  API_GROUPS,
  API_ROUTES,
  ApiParam,
  ApiRoute,
  ParamValues,
  buildInit,
  buildUrl,
  defaultValues,
  toCurl,
} from "../../middleware/gymJunkieApi";
import {
  GymJunkieSession,
  clearSession,
  loadSession,
  saveSession,
} from "../../middleware/gymJunkieSession";
import {
  RateLimit,
  formatWait,
  readRateLimit,
  useRateLimitCountdown,
} from "../../middleware/rateLimit";

const GJ_ACCENT = "#d8aa78";
const CYAN = "#8fd0d4";

/** Colour per verb, so the list scans by shape before it is read. */
const METHOD_COLOUR: Record<string, string> = { GET: CYAN, POST: GJ_ACCENT };

/** Response text past this is trimmed on screen; the download keeps all of it. */
const MAX_RENDERED_CHARS = 120000;

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

/** Seconds until `expiresAt`, ticking down and stopping at zero. */
function useCountdown(expiresAt?: number): number {
  const remaining = useCallback(
    () => (expiresAt ? Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)) : 0),
    [expiresAt]
  );
  const [left, setLeft] = useState(remaining);

  useEffect(() => {
    setLeft(remaining());
    if (!expiresAt) return;
    const id = window.setInterval(() => setLeft(remaining()), 1000);
    return () => window.clearInterval(id);
  }, [expiresAt, remaining]);

  return left;
}

/**
 * Clears a rate limit once its wait has genuinely elapsed.
 *
 * Timed off `until` rather than off the rendered countdown: on the render that
 * first receives a limit the countdown still reads zero, so a check against it
 * would drop the limit before its message was ever shown.
 */
function useExpiringLimit(limit: RateLimit | null, setLimit: (next: RateLimit | null) => void) {
  useEffect(() => {
    if (!limit?.until) return;
    const msLeft = limit.until - Date.now();
    if (msLeft <= 0) {
      setLimit(null);
      return;
    }
    const id = window.setTimeout(() => setLimit(null), msLeft);
    return () => window.clearTimeout(id);
    // setLimit is a useState setter, so it is stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);
}

function MethodChip({ method }: { method: string }) {
  const colour = METHOD_COLOUR[method] ?? CYAN;
  return (
    <Box
      component="span"
      sx={{
        fontFamily: MONO,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: colour,
        border: "1px solid",
        borderColor: `${colour}66`,
        bgcolor: `${colour}14`,
        borderRadius: 1,
        px: 0.85,
        py: 0.25,
        flexShrink: 0,
      }}
    >
      {method}
    </Box>
  );
}

/** Scrollable mono block with a copy button parked in the corner. */
function CodeBlock({ code, maxHeight = 340 }: { code: string; maxHeight?: number }) {
  return (
    <Box sx={{ position: "relative" }}>
      {/* Sits over a block that scrolls sideways, so it carries its own
          background rather than letting code run underneath it. */}
      <Box
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          zIndex: 1,
          borderRadius: 1,
          bgcolor: "background.paper",
          boxShadow: "0 0 0 4px rgba(16, 13, 8, 0.85)",
        }}
      >
        <CopyButton text={code} />
      </Box>
      <Box
        component="pre"
        sx={{
          fontFamily: MONO,
          fontSize: { xs: 11, sm: 12 },
          lineHeight: 1.65,
          m: 0,
          p: 1.5,
          pr: 5,
          maxHeight,
          overflow: "auto",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: "rgba(0, 0, 0, 0.35)",
          color: "text.primary",
          whiteSpace: "pre",
        }}
      >
        {code}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Sign-in                                                             */
/* ------------------------------------------------------------------ */

type AuthStep = "credentials" | "code";
type SignInMethod = "email" | "authenticator";

interface AuthPanelProps {
  session: GymJunkieSession | null;
  onSession: (session: GymJunkieSession) => void;
  onSignOut: () => void;
}

/**
 * The sign-in half of the page. Runs the same two-step flow the API documents:
 * credentials for a code, then the code for a 15-minute export token.
 */
function AuthPanel({ session, onSession, onSignOut }: AuthPanelProps) {
  const [step, setStep] = useState<AuthStep>("credentials");
  const [method, setMethod] = useState<SignInMethod>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState<RateLimit | null>(null);
  const [showToken, setShowToken] = useState(false);

  const secondsLeft = useRateLimitCountdown(limit);
  const limited = limit !== null && (limit.until === null || secondsLeft > 0);
  const tokenLeft = useCountdown(session?.expiresAt);

  useExpiringLimit(limit, setLimit);

  // A token that runs out while the page is open should not keep looking valid.
  // Timed off the expiry itself rather than off the rendered countdown, which
  // still reads zero on the render that first receives the session.
  useEffect(() => {
    if (!session?.expiresAt) return;
    const msLeft = session.expiresAt - Date.now();
    if (msLeft <= 0) {
      onSignOut();
      return;
    }
    const id = window.setTimeout(onSignOut, msLeft);
    return () => window.clearTimeout(id);
  }, [session, onSignOut]);

  const handleInitiate = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/export/auth/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, sign_in_method: method, send_email: true }),
      });
      if (res.status === 429) {
        setLimit(await readRateLimit(res));
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Sign-in failed.");
        return;
      }
      if (data.status === "invalid_credentials") {
        setError("That email and password did not match an account.");
      } else if (data.status === "authenticator_not_enabled") {
        setError("This account has no authenticator app set up. Use an emailed code instead.");
      } else if (data.status === "code_sent" || data.status === "authenticator_required") {
        setStep("code");
      } else {
        setError("Unexpected response. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/export/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, sign_in_method: method }),
      });
      // Too many wrong codes burns the code, so send them back for a new one
      // rather than leaving them typing into a code the server has dropped.
      if (res.status === 429) {
        setLimit(await readRateLimit(res));
        setStep("credentials");
        setCode("");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Verification failed.");
        return;
      }
      if (data.status === "verified" && data.export_token) {
        const seconds = typeof data.expires_in === "number" ? data.expires_in : 900;
        onSession({ token: data.export_token, email, expiresAt: Date.now() + seconds * 1000 });
        setPassword("");
        setCode("");
        setStep("credentials");
      } else if (data.status === "code_expired") {
        setError("That code has expired. Start again for a new one.");
      } else if (typeof data.attempts_remaining === "number") {
        setError(
          `Incorrect code. ${data.attempts_remaining} attempt` +
            `${data.attempts_remaining === 1 ? "" : "s"} left before you need a new one.`
        );
      } else {
        setError("Invalid or expired code.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    const masked = `${session.token.slice(0, 12)}${"•".repeat(14)}`;
    return (
      <Panel id="auth-panel" accent={CYAN} wash sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <LockOpenIcon sx={{ fontSize: 18, color: CYAN }} />
          <Typography sx={{ fontWeight: 700 }}>Signed in</Typography>
          <Chip
            size="small"
            label={session.email}
            sx={{ fontFamily: MONO, fontSize: 11, maxWidth: "100%" }}
          />
          {session.expiresAt && (
            <Chip
              size="small"
              variant="outlined"
              color={tokenLeft < 120 ? "warning" : "default"}
              label={`expires in ${formatWait(tokenLeft)}`}
              sx={{ fontFamily: MONO, fontSize: 11 }}
            />
          )}
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 0.75, display: "flex", alignItems: "center", gap: 0.5 }}
          >
            Export token
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                fontFamily: MONO,
                fontSize: { xs: 10, sm: 12 },
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "rgba(0, 0, 0, 0.35)",
                px: 1.25,
                py: 0.9,
                flex: 1,
                minWidth: 0,
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {showToken ? session.token : masked}
            </Box>
            <Tooltip title={showToken ? "Hide token" : "Show token"}>
              <IconButton size="small" onClick={() => setShowToken((v) => !v)}>
                {showToken ? (
                  <VisibilityOffIcon fontSize="inherit" />
                ) : (
                  <VisibilityIcon fontSize="inherit" />
                )}
              </IconButton>
            </Tooltip>
            <CopyButton text={session.token} />
          </Box>
          <Typography variant="caption" sx={{ color: "text.disabled", display: "block", mt: 0.75 }}>
            Send it as an Authorization: Bearer header. It is good for 15 minutes and only for your
            own account.
          </Typography>
        </Box>

        <Box>
          <Button
            variant="outlined"
            size="small"
            onClick={onSignOut}
            data-track="gym-junkie-api:sign-out"
          >
            Sign out
          </Button>
        </Box>
      </Panel>
    );
  }

  return (
    <Panel id="auth-panel" accent={GJ_ACCENT} wash sx={{ display: "flex", flexDirection: "column", gap: 2.5, maxWidth: 520 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LockIcon sx={{ fontSize: 18, color: GJ_ACCENT }} />
        <Typography sx={{ fontWeight: 700 }}>Sign in to try the routes</Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {limited && (
        <Alert severity="warning">
          {limit?.message}
          {secondsLeft > 0 && ` You can try again in ${formatWait(secondsLeft)}.`}
        </Alert>
      )}

      {step === "credentials" ? (
        <>
          <CheckList
            accent={GJ_ACCENT}
            items={[
              "Sign in with the email and password you use in the Gym Junkie app.",
              "Confirm with a code, emailed to you or from your authenticator app.",
              "You get a 15-minute token that every route below then uses.",
            ]}
          />
          <ToggleButtonGroup
            size="small"
            exclusive
            value={method}
            onChange={(_, next) => next && setMethod(next)}
            sx={{ alignSelf: "flex-start" }}
          >
            <ToggleButton value="email" data-track="gym-junkie-api:method-email">
              Email code
            </ToggleButton>
            <ToggleButton value="authenticator" data-track="gym-junkie-api:method-totp">
              Authenticator app
            </ToggleButton>
          </ToggleButtonGroup>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              size="small"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              size="small"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && !limited && email && password && handleInitiate()}
            />
            <Button
              variant="contained"
              onClick={handleInitiate}
              disabled={loading || limited || !email || !password}
              data-track="gym-junkie-api:sign-in"
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Continue"}
            </Button>
          </Stack>
        </>
      ) : (
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {method === "email"
              ? `A 6-digit code was sent to ${email}.`
              : "Enter the current 6-digit code from your authenticator app."}
          </Typography>
          <TextField
            label="Verification code"
            size="small"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputProps={{ inputMode: "numeric" }}
            onKeyDown={(e) => e.key === "Enter" && !loading && !limited && code.length === 6 && handleVerify()}
          />
          <Button
            variant="contained"
            onClick={handleVerify}
            disabled={loading || limited || code.length < 6}
            data-track="gym-junkie-api:verify"
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Verify"}
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => {
              setStep("credentials");
              setCode("");
              setError(null);
            }}
          >
            Back
          </Button>
        </Stack>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Console                                                             */
/* ------------------------------------------------------------------ */

interface RouteResult {
  status: number;
  ok: boolean;
  durationMs: number;
  /** Text to render, already pretty-printed for JSON. */
  text?: string;
  truncated?: boolean;
  /** Set for a response worth saving rather than reading. */
  download?: { url: string; name: string; bytes: number };
  note?: string;
}

function ParamField({
  param,
  value,
  onChange,
}: {
  param: ApiParam;
  value: string;
  onChange: (value: string) => void;
}) {
  const label = `${param.name}${param.required ? " *" : ""}`;

  if (param.type === "boolean") {
    return (
      <Box>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={value === "true"}
              onChange={(e) => onChange(e.target.checked ? "true" : "false")}
            />
          }
          label={<Typography sx={{ fontFamily: MONO, fontSize: 13 }}>{param.name}</Typography>}
        />
        <Typography variant="caption" sx={{ color: "text.disabled", display: "block" }}>
          {param.description}
        </Typography>
      </Box>
    );
  }

  const shared = {
    size: "small" as const,
    fullWidth: true,
    label,
    value,
    helperText: param.description,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
  };

  if (param.type === "enum") {
    return (
      <TextField {...shared} select>
        {(param.options ?? []).map((option) => (
          <MenuItem key={option} value={option} sx={{ fontFamily: MONO, fontSize: 13 }}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return (
    <TextField
      {...shared}
      type={param.type === "password" ? "password" : param.type === "date" ? "date" : "text"}
      placeholder={param.placeholder}
      InputLabelProps={param.type === "date" ? { shrink: true } : undefined}
    />
  );
}

interface RouteCardProps {
  route: ApiRoute;
  session: GymJunkieSession | null;
  onSession: (session: GymJunkieSession) => void;
  onExpired: () => void;
}

/** One route: its reference entry, a parameter form, and the response. */
function RouteCard({ route, session, onSession, onExpired }: RouteCardProps) {
  const [values, setValues] = useState<ParamValues>(() => defaultValues(route));
  const [result, setResult] = useState<RouteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [limit, setLimit] = useState<RateLimit | null>(null);

  const secondsLeft = useRateLimitCountdown(limit);
  const limited = limit !== null && (limit.until === null || secondsLeft > 0);

  // Object URLs outlive the response they came from, so the previous one is
  // released whenever a new result lands and when the card goes away.
  const objectUrl = useRef<string | null>(null);
  const releaseUrl = () => {
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
    }
  };
  useEffect(() => releaseUrl, []);

  useExpiringLimit(limit, setLimit);

  // Save re-typing an address that sign-in already knows.
  useEffect(() => {
    if (!session?.email) return;
    setValues((prev) =>
      route.params.some((p) => p.name === "email") && !prev.email
        ? { ...prev, email: session.email }
        : prev
    );
  }, [session, route.params]);

  const setValue = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const missing = route.params
    .filter((p) => p.required && !values[p.name]?.trim())
    .map((p) => p.name);

  const needsToken = route.auth && !session;
  const blocked = sending || limited || needsToken || missing.length > 0;

  const send = async () => {
    setError(null);
    setSending(true);
    const startedAt = Date.now();
    try {
      const res = await fetch(
        buildUrl(route, values),
        buildInit(route, values, session?.token ?? null)
      );
      const durationMs = Date.now() - startedAt;

      if (res.status === 429) {
        setLimit(await readRateLimit(res));
        setResult({ status: 429, ok: false, durationMs, note: "Rate limited." });
        return;
      }
      if (res.status === 401 && route.auth) {
        onExpired();
        setError("Your export token has expired. Sign in again to keep going.");
        setResult({ status: 401, ok: false, durationMs });
        return;
      }

      const contentType = res.headers.get("Content-Type") ?? "";
      releaseUrl();

      // A FIT file or a CSV attachment is worth saving, not reading on screen.
      if (
        res.ok &&
        (route.responseKind === "file" ||
          contentType.includes("csv") ||
          contentType.includes("octet-stream") ||
          contentType.includes("vnd.ant.fit"))
      ) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        objectUrl.current = url;
        setResult({
          status: res.status,
          ok: res.ok,
          durationMs,
          download: { url, name: fileNameFor(route, res, values), bytes: blob.size },
        });
        return;
      }

      const raw = await res.text();
      let text = raw;
      let note: string | undefined;

      if (contentType.includes("json")) {
        try {
          const parsed = JSON.parse(raw);
          text = JSON.stringify(parsed, null, 2);

          // Verifying through the console is a real sign-in, so adopt the token
          // it hands back instead of making them sign in again above.
          if (route.id === "auth-verify" && parsed?.export_token) {
            const seconds = typeof parsed.expires_in === "number" ? parsed.expires_in : 900;
            onSession({
              token: parsed.export_token,
              email: values.email ?? "",
              expiresAt: Date.now() + seconds * 1000,
            });
            note = "Token adopted: the routes below are now signed in.";
          }
        } catch {
          // Not valid JSON after all; show it as it arrived.
        }
      }

      const truncated = text.length > MAX_RENDERED_CHARS;
      const blob = new Blob([raw], { type: contentType || "text/plain" });
      const url = URL.createObjectURL(blob);
      objectUrl.current = url;

      setResult({
        status: res.status,
        ok: res.ok,
        durationMs,
        text: truncated ? `${text.slice(0, MAX_RENDERED_CHARS)}\n\n... truncated` : text,
        truncated,
        download: { url, name: fileNameFor(route, res, values), bytes: blob.size },
        note,
      });
    } catch {
      setError("Network error. The request did not reach the API.");
    } finally {
      setSending(false);
    }
  };

  const handleSend = () => {
    if (route.destructive) {
      setConfirming(true);
      return;
    }
    send();
  };

  const curl = toCurl(route, values, session?.token ?? null);

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "12px !important",
        bgcolor: "background.paper",
        "&:before": { display: "none" },
        overflow: "hidden",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        data-track={`gym-junkie-api:open-${route.id}`}
        sx={{ "& .MuiAccordionSummary-content": { alignItems: "center", gap: 1.25, minWidth: 0 } }}
      >
        <MethodChip method={route.method} />
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: { xs: 11.5, sm: 13 },
            fontWeight: 600,
            wordBreak: "break-all",
          }}
        >
          {route.path}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            ml: "auto",
            pl: 1,
            display: { xs: "none", md: "block" },
            whiteSpace: "nowrap",
          }}
        >
          {route.summary}
        </Typography>
        {route.destructive && (
          <WarningAmberIcon sx={{ fontSize: 17, color: "warning.main", flexShrink: 0 }} />
        )}
      </AccordionSummary>

      <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 2.25, pt: 0 }}>
        <Box>
          <Typography variant="body2" sx={{ display: { xs: "block", md: "none" }, fontWeight: 600, mb: 0.5 }}>
            {route.summary}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {route.description}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          <Chip
            size="small"
            variant="outlined"
            icon={route.auth ? <LockIcon sx={{ fontSize: 14 }} /> : <LockOpenIcon sx={{ fontSize: 14 }} />}
            label={route.auth ? "Export token required" : "No token needed"}
            sx={{ fontSize: 11 }}
          />
          {route.limits.map((text) => (
            <Chip key={text} size="small" variant="outlined" label={text} sx={{ fontSize: 11 }} />
          ))}
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: "text.disabled", fontFamily: MONO }}>
            RETURNS
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {route.returns}
          </Typography>
        </Box>

        {route.params.length > 0 && (
          <Box>
            <Typography variant="caption" sx={{ color: "text.disabled", fontFamily: MONO }}>
              PARAMETERS
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mt: 1,
              }}
            >
              {route.params.map((param) => (
                <ParamField
                  key={param.name}
                  param={param}
                  value={values[param.name] ?? ""}
                  onChange={(value) => setValue(param.name, value)}
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider />

        <Box>
          <Typography variant="caption" sx={{ color: "text.disabled", fontFamily: MONO }}>
            REQUEST
          </Typography>
          <Box sx={{ mt: 1 }}>
            <CodeBlock code={curl} maxHeight={180} />
          </Box>
        </Box>

        {needsToken && (
          <Alert severity="info" sx={{ py: 0.25 }}>
            Sign in at the top of the page to call this route.
          </Alert>
        )}
        {missing.length > 0 && !needsToken && (
          <Alert severity="info" sx={{ py: 0.25 }}>
            Fill in {missing.join(", ")} to send this request.
          </Alert>
        )}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {limited && (
          <Alert severity="warning">
            {limit?.message}
            {secondsLeft > 0 && ` You can try again in ${formatWait(secondsLeft)}.`}
          </Alert>
        )}

        <Box>
          <Button
            variant={route.destructive ? "outlined" : "contained"}
            color={route.destructive ? "warning" : "primary"}
            size="small"
            startIcon={sending ? undefined : <PlayArrowIcon />}
            onClick={handleSend}
            disabled={blocked}
            data-track={`gym-junkie-api:send-${route.id}`}
          >
            {sending ? <CircularProgress size={18} color="inherit" /> : "Send request"}
          </Button>
        </Box>

        {result && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 1 }}>
              <Typography variant="caption" sx={{ color: "text.disabled", fontFamily: MONO }}>
                RESPONSE
              </Typography>
              <Chip
                size="small"
                label={result.status}
                sx={{
                  fontFamily: MONO,
                  fontSize: 11,
                  fontWeight: 700,
                  color: result.ok ? CYAN : "#e8927c",
                  border: "1px solid",
                  borderColor: result.ok ? `${CYAN}66` : "#e8927c66",
                  bgcolor: result.ok ? `${CYAN}14` : "#e8927c14",
                }}
              />
              <Typography variant="caption" sx={{ color: "text.disabled", fontFamily: MONO }}>
                {result.durationMs} ms
              </Typography>
              {result.download && (
                <Button
                  component="a"
                  href={result.download.url}
                  download={result.download.name}
                  size="small"
                  variant="outlined"
                  startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                  sx={{ ml: "auto" }}
                  data-track={`gym-junkie-api:download-${route.id}`}
                >
                  {formatBytes(result.download.bytes)}
                </Button>
              )}
            </Box>
            {result.note && (
              <Alert severity="success" sx={{ mb: 1, py: 0.25 }}>
                {result.note}
              </Alert>
            )}
            {result.text ? (
              <CodeBlock code={result.text} />
            ) : (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {result.note ??
                  (result.download
                    ? "The response is a file. Use the download button above to save it."
                    : "No response body.")}
              </Typography>
            )}
          </Box>
        )}
      </AccordionDetails>

      <Dialog open={confirming} onClose={() => setConfirming(false)}>
        <DialogTitle>Queue your account for deletion?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This queues {session?.email ?? "your account"} for manual deletion, along with every
            workout, metric and note on it. It is not reversible from this page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirming(false)}>Cancel</Button>
          <Button
            color="warning"
            variant="contained"
            onClick={() => {
              setConfirming(false);
              send();
            }}
            data-track="gym-junkie-api:confirm-delete"
          >
            Queue deletion
          </Button>
        </DialogActions>
      </Dialog>
    </Accordion>
  );
}

/** Name for a saved response, preferring the one the server attached. */
function fileNameFor(route: ApiRoute, res: Response, values: ParamValues): string {
  const disposition = res.headers.get("Content-Disposition") ?? "";
  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  if (match) return decodeURIComponent(match[1].trim());
  if (route.responseKind === "file") return `${values.workout_id || "workout"}.fit`;
  const extension = values.format === "csv" ? "csv" : "json";
  return `${route.id}.${extension}`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Api() {
  const [session, setSession] = useState<GymJunkieSession | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setSession(loadSession());
  }, []);

  const handleSession = useCallback((next: GymJunkieSession) => {
    saveSession(next);
    setSession(next);
  }, []);

  const handleSignOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return API_ROUTES;
    return API_ROUTES.filter((route) =>
      `${route.path} ${route.summary} ${route.description}`.toLowerCase().includes(needle)
    );
  }, [query]);

  return (
    <Box
      component="section"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 }, pb: 4 }}
    >
      <PageHeader
        eyebrow="gym junkie"
        title={<>Public <GradientText>API</GradientText></>}
        subtitle="A read-only API over your own Gym Junkie data. Sign in with your app credentials, then call any route from this page or from your own code."
      />

      <Reveal delay={0.04}>
        <Callout accent={CYAN} title="Not the app's API">
          The Gym Junkie app talks to an internal API that is versioned against the app build and
          reaches every part of the server. This is a separate, narrower surface: it only reads your
          own records, it only answers to a token minted after a second factor, and that token lasts
          15 minutes. Nothing here can touch another person's data.
        </Callout>
      </Reveal>

      <Reveal delay={0.06}>
        <Panel sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="caption" sx={{ color: "text.disabled", fontFamily: MONO }}>
            BASE URL
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{ fontFamily: MONO, fontSize: { xs: 12.5, sm: 15 }, fontWeight: 600, wordBreak: "break-all" }}
            >
              {API_BASE}
            </Typography>
            <CopyButton text={API_BASE} />
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Every route is prefixed with /export. Authenticated routes take an
            Authorization: Bearer header carrying the export token.
          </Typography>
        </Panel>
      </Reveal>

      <Reveal delay={0.08}>
        <SectionHeading eyebrow="step 1">Authenticate</SectionHeading>
        <AuthPanel session={session} onSession={handleSession} onSignOut={handleSignOut} />
      </Reveal>

      <Reveal delay={0.1}>
        <SectionHeading eyebrow="step 2">Routes</SectionHeading>
        <TextField
          size="small"
          fullWidth
          placeholder="Filter routes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ maxWidth: 420, mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />

        {matches.length === 0 ? (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            No routes match "{query}".
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
            {API_GROUPS.map((group) => {
              const routes = matches.filter((route) => route.group === group);
              if (routes.length === 0) return null;
              return (
                <Box key={group}>
                  <Typography
                    sx={{
                      fontFamily: MONO,
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: GJ_ACCENT,
                      mb: 1.25,
                    }}
                  >
                    {group}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                    {routes.map((route) => (
                      <RouteCard
                        key={route.id}
                        route={route}
                        session={session}
                        onSession={handleSession}
                        onExpired={handleSignOut}
                      />
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Reveal>

      <Reveal delay={0.12}>
        <Panel sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography sx={{ fontWeight: 700 }}>Notes</Typography>
          <CheckList
            accent={GJ_ACCENT}
            items={[
              "Tokens last 15 minutes. When one runs out, sign in again for a new one.",
              "Every route is scoped to the account that signed in, so there is no user id to pass.",
              "Rate limits answer with 429 and a Retry-After header saying how long to wait.",
              "Nothing you type here is stored on the site beyond your own browser.",
            ]}
          />
        </Panel>
      </Reveal>

      <PageNav
        left={{ text: "Data Export", link: "/gym-junkie/data-export" }}
        right={{ text: "Privacy Policy", link: "/gym-junkie/privacy" }}
      />
    </Box>
  );
}
