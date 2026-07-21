import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { clearSession, loadSession, saveSession } from "../../middleware/gymJunkieSession";
import {
  PageHeader,
  GradientText,
  Reveal,
  Panel,
  CheckList,
} from "../../components/design";

const GJ_ACCENT = "#d8aa78";

const API_BASE =
  process.env.REACT_APP_GYM_JUNKIE_API_BASE ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://gymjunkie.moates.com.au");

type Step = "login" | "verify" | "list";

interface Workout {
  id: string;
  title: string | null;
  started_at: string;
  duration_secs: number;
}

function formatDuration(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DataExport() {
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [exportToken, setExportToken] = useState("");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<Set<string>>(new Set());

  const fetchWorkouts = async (token: string): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/export/workouts/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      clearSession();
      setExportToken("");
      setStep("login");
      setError("Session expired. Please log in again.");
      return false;
    }
    setWorkouts(await res.json());
    return true;
  };

  useEffect(() => {
    const saved = loadSession();
    if (!saved) return;
    setExportToken(saved.token);
    setEmail(saved.email);
    (async () => {
      const ok = await fetchWorkouts(saved.token);
      if (ok) setStep("list");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const ok = await fetchWorkouts(data.export_token);
        if (ok) setStep("list");
      } else {
        setError("Invalid or expired code.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (workout: Workout) => {
    setDownloading((prev) => new Set(prev).add(workout.id));
    try {
      const res = await fetch(`${API_BASE}/export/workouts/${workout.id}/fit`, {
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
        setError("Download failed. Please try again.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `workout_${workout.started_at.slice(0, 10)}.fit`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError("Download failed. Please try again.");
    } finally {
      setDownloading((prev) => {
        const next = new Set(prev);
        next.delete(workout.id);
        return next;
      });
    }
  };

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
        title={<>Data <GradientText>export</GradientText></>}
        subtitle="Download your Gym Junkie workouts as Garmin FIT files. We verify it's you by email before showing your data."
      />

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
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
                  "Browse your workouts and download any as a FIT file.",
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
          </Panel>
        </Reveal>
      )}

      {step === "list" && (
        <Reveal delay={0.06}>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            {workouts.length} workout{workouts.length !== 1 ? "s" : ""} found.
            Downloads are in Garmin FIT format.
          </Typography>
          {workouts.length === 0 ? (
            <Typography variant="body2">No workouts recorded yet.</Typography>
          ) : (
            <>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  overflowX: "auto",
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Workout</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell align="right">Download</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workouts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((w) => (
                      <TableRow key={w.id} hover>
                        <TableCell>{w.title || "Untitled"}</TableCell>
                        <TableCell>{formatDate(w.started_at)}</TableCell>
                        <TableCell>{formatDuration(w.duration_secs)}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={
                              downloading.has(w.id) ? undefined : <DownloadIcon sx={{ fontSize: 16 }} />
                            }
                            onClick={() => handleDownload(w)}
                            disabled={downloading.has(w.id)}
                            sx={{ minWidth: 72 }}
                          >
                            {downloading.has(w.id) ? (
                              <CircularProgress size={16} />
                            ) : (
                              ".FIT"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={workouts.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[10, 20, 50]}
                sx={{ flexShrink: 0 }}
              />
            </>
          )}
        </Reveal>
      )}
    </Box>
  );
}
