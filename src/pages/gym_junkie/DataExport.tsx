import { useState } from "react";
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
import PageLinks from "../../components/PageLinks";

const API_BASE = process.env.REACT_APP_GYM_JUNKIE_API_BASE ?? "https://gymjunkie.moates.com.au";

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
      setStep("login");
      setError("Session expired. Please log in again.");
      return false;
    }
    setWorkouts(await res.json());
    return true;
  };

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
      const res = await fetch(`${API_BASE}/export/workouts/${workout.id}/tcx`, {
        headers: { Authorization: `Bearer ${exportToken}` },
      });
      if (res.status === 401) {
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
      a.download = `workout_${workout.started_at.slice(0, 10)}.tcx`;
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
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        gap: "10px",
      }}
    >
      <PageLinks />
      <Typography variant="h5">Data Export</Typography>

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
            Download your Gym Junkie workout data as Garmin TCX files. A
            verification code will be sent to your email.
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

      {step === "list" && (
        <>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {workouts.length} workout{workouts.length !== 1 ? "s" : ""} found.
            Downloads are in Garmin TCX format.
          </Typography>
          {workouts.length === 0 ? (
            <Typography variant="body2">No workouts recorded yet.</Typography>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ bgcolor: "background.paper", borderRadius: 2 }}
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
                    <TableRow key={w.id}>
                      <TableCell>{w.title || "Untitled"}</TableCell>
                      <TableCell>{formatDate(w.started_at)}</TableCell>
                      <TableCell>{formatDuration(w.duration_secs)}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDownload(w)}
                          disabled={downloading.has(w.id)}
                          sx={{ minWidth: 56 }}
                        >
                          {downloading.has(w.id) ? (
                            <CircularProgress size={16} />
                          ) : (
                            "TCX"
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {workouts.length > 0 && (
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
            />
          )}
        </>
      )}
    </Box>
  );
}
