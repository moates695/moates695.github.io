import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PageLinks from "../../components/PageLinks";
import { clearSession, loadSession, saveSession } from "../../middleware/gymJunkieSession";

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
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Login failed.");
        return;
      }
      if (data.status === "user_not_found") {
        setError("No account found with that email.");
      } else if (data.status === "incorrect_password") {
        setError("Incorrect password.");
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
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Verification failed.");
        return;
      }
      if (data.status === "verified" && data.export_token) {
        setExportToken(data.export_token);
        saveSession({ token: data.export_token, email });
        setStep("confirm");
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
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        gap: "10px",
      }}
    >
      <PageLinks />
      <Typography variant="h5">Delete Account</Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {step === "login" && (
        <Paper
          elevation={0}
          sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2, maxWidth: 400 }}
        >
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Request deletion of your Gym Junkie account. A verification code
            will be sent to your email to confirm it's you.
          </Typography>
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
              onKeyDown={(e) => e.key === "Enter" && !loading && handleLogin()}
            />
            <Button
              variant="contained"
              onClick={handleLogin}
              disabled={loading || !email || !password}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Continue"}
            </Button>
          </Box>
        </Paper>
      )}

      {step === "verify" && (
        <Paper
          elevation={0}
          sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2, maxWidth: 400 }}
        >
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            A 6-digit code was sent to {email}. Enter it below.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              size="small"
              fullWidth
              inputProps={{ inputMode: "numeric" }}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleVerify()}
            />
            <Button
              variant="contained"
              onClick={handleVerify}
              disabled={loading || code.length < 6}
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
          </Box>
        </Paper>
      )}

      {step === "confirm" && (
        <Paper
          elevation={0}
          sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2, maxWidth: 500 }}
        >
          <Alert severity="warning" sx={{ mb: 2 }}>
            This queues your account for deletion. Once processed, your
            account and all workout data will be permanently removed and
            cannot be recovered.
          </Alert>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Deletion is handled manually and may take a few days. Re-submitting
            is safe — duplicate requests are ignored.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            To confirm, retype your email address:{" "}
            <Box component="span" sx={{ fontWeight: 600 }}>{email}</Box>
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              disabled={loading || !confirmMatches}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Request deletion"
              )}
            </Button>
          </Box>
        </Paper>
      )}

      {step === "done" && (
        <Alert severity="success" sx={{ maxWidth: 500 }}>
          Your deletion request has been queued. Your account and workout data
          will be removed once the request is processed. You can safely close
          this page.
        </Alert>
      )}
    </Box>
  );
}
