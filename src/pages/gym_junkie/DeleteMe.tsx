import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { clearSession, loadSession, saveSession } from "../../middleware/gymJunkieSession";
import {
  RateLimit,
  formatWait,
  readRateLimit,
  useRateLimitCountdown,
} from "../../middleware/rateLimit";
import {
  PageHeader,
  GradientText,
  Reveal,
  Panel,
  Callout,
  CheckList,
} from "../../components/design";

const GJ_ACCENT = "#d8aa78";

const API_BASE =
  process.env.REACT_APP_GYM_JUNKIE_API_BASE ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://gymjunkie.moates.com.au");

type Step = "login" | "verify" | "confirm" | "done";

export default function DeleteMe() {
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [exportToken, setExportToken] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Set when the API answers 429, holding the flow shut for the stated wait.
  const [limit, setLimit] = useState<RateLimit | null>(null);

  const secondsLeft = useRateLimitCountdown(limit);
  const limited = limit !== null && (limit.until === null || secondsLeft > 0);

  useEffect(() => {
    if (limit?.until && secondsLeft === 0) setLimit(null);
  }, [limit, secondsLeft]);

  useEffect(() => {
    const saved = loadSession();
    if (!saved) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/export/workouts/list`, {
          headers: { Authorization: `Bearer ${saved.token}` },
        });
        if (res.status === 401) {
          clearSession();
          return;
        }
        if (!res.ok) return;
        setExportToken(saved.token);
        setEmail(saved.email);
        setStep("confirm");
      } catch {
        // stay on login
      }
    })();
  }, []);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/export/auth/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, send_email: true }),
      });
      if (res.status === 429) {
        setLimit(await readRateLimit(res));
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Login failed.");
        return;
      }
      // One answer covers both an unknown email and a wrong password, so the
      // page cannot be used to find out who has an account.
      if (data.status === "invalid_credentials") {
        setError("That email and password did not match an account.");
      } else if (data.status === "code_sent") {
        setStep("verify");
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
        body: JSON.stringify({ email, code }),
      });
      // Too many wrong guesses burns the code, so go back for a fresh one.
      if (res.status === 429) {
        setLimit(await readRateLimit(res));
        setStep("login");
        setCode("");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Verification failed.");
        return;
      }
      if (data.status === "verified" && data.export_token) {
        setExportToken(data.export_token);
        saveSession({ token: data.export_token, email });
        setStep("confirm");
      } else if (data.status === "code_expired") {
        setError("That code has expired. Please sign in again for a new one.");
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

  const handleRequestDelete = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/export/account/delete-request`, {
        method: "POST",
        headers: { Authorization: `Bearer ${exportToken}` },
      });
      if (res.status === 401) {
        clearSession();
        setExportToken("");
        setStep("login");
        setError("Session expired. Please log in again.");
        return;
      }
      // The request is capped at one an hour per session; a repeat almost
      // always means the first one already went through.
      if (res.status === 429) {
        setLimit(await readRateLimit(res));
        return;
      }
      if (!res.ok) {
        setError("Request failed. Please try again.");
        return;
      }
      setStep("done");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmMatches =
    confirmEmail.trim().toLowerCase() === email.trim().toLowerCase() &&
    confirmEmail.length > 0;

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 3, sm: 4 },
        pb: 4,
      }}
    >
      <PageHeader
        eyebrow="gym junkie"
        title={<>Delete <GradientText>account</GradientText></>}
        subtitle="Request permanent deletion of your Gym Junkie account and all of its data. We verify it's you by email before anything is queued."
      />

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

      {step === "login" && (
        <Reveal delay={0.06}>
          <Panel accent={GJ_ACCENT} wash sx={{ maxWidth: 460, display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>How it works</Typography>
              <CheckList
                accent={GJ_ACCENT}
                items={[
                  "Sign in with your Gym Junkie email and password.",
                  "We email you a 6-digit verification code.",
                  "Confirm and your account is queued for deletion.",
                ]}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="small"
                fullWidth
                onKeyDown={(e) => e.key === "Enter" && !loading && !limited && handleLogin()}
              />
              <Button
                variant="contained"
                onClick={handleLogin}
                disabled={loading || limited || !email || !password}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Continue"}
              </Button>
            </Box>
          </Panel>
        </Reveal>
      )}

      {step === "verify" && (
        <Reveal delay={0.06}>
          <Panel accent={GJ_ACCENT} wash sx={{ maxWidth: 460, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              A 6-digit code was sent to {email}. Enter it below.
            </Typography>
            <TextField
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              size="small"
              fullWidth
              inputProps={{ inputMode: "numeric" }}
              onKeyDown={(e) => e.key === "Enter" && !loading && !limited && handleVerify()}
            />
            <Button
              variant="contained"
              onClick={handleVerify}
              disabled={loading || limited || code.length < 6}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Verify"}
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setStep("login");
                setCode("");
                setError(null);
              }}
            >
              Back
            </Button>
          </Panel>
        </Reveal>
      )}

      {step === "confirm" && (
        <Reveal delay={0.06}>
          <Panel accent={GJ_ACCENT} wash sx={{ maxWidth: 540, display: "flex", flexDirection: "column", gap: 2 }}>
            <Callout accent="#e0897a" title="permanent">
              This queues your account for deletion. Once processed, your account
              and all workout data will be permanently removed and cannot be
              recovered.
            </Callout>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Deletion is handled manually and may take a few days. Re-submitting
              is safe: duplicate requests are ignored.
            </Typography>
            <Typography variant="body2">
              To confirm, retype your email address:{" "}
              <Box component="span" sx={{ fontWeight: 600 }}>{email}</Box>
            </Typography>
            <TextField
              label="Confirm email"
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              size="small"
              fullWidth
              onKeyDown={(e) =>
                e.key === "Enter" && !loading && confirmMatches && handleRequestDelete()
              }
            />
            <Button
              variant="contained"
              color="error"
              onClick={handleRequestDelete}
              disabled={loading || limited || !confirmMatches}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Request deletion"
              )}
            </Button>
          </Panel>
        </Reveal>
      )}

      {step === "done" && (
        <Reveal delay={0.06}>
          <Alert severity="success" sx={{ maxWidth: 540 }}>
            Your deletion request has been queued. Your account and workout data
            will be removed once the request is processed. You can safely close
            this page.
          </Alert>
        </Reveal>
      )}
    </Box>
  );
}
