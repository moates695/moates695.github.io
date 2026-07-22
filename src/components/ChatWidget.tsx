import { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import {
  Box,
  Fab,
  IconButton,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { MONO } from "../styles/tokens";

/**
 * Floating "Ask about Marcus" chat widget. Posts a single question to the chat
 * proxy (moates_chat) and renders the answer. The proxy is grounded in the same
 * knowledge base as the site, and is scoped to only answer about Marcus.
 */

const API_BASE =
  process.env.REACT_APP_CHAT_API_BASE ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://chat.moates.com.au");

const ACCENT = "#d8aa78";
const LINK_COLOR = "#8fd0d4";
const MAX_MESSAGE_CHARS = 500;

const SUGGESTIONS = [
  "What does Marcus do?",
  "Tell me about Gym Junkie",
  "What is his tech stack?",
];

interface Msg {
  role: "user" | "bot";
  text: string;
}

const WELCOME: Msg = {
  role: "bot",
  text: "Hi, I'm Marcus's assistant. Ask me anything about his work, projects, skills or background.",
};

const URL_RE = /(https?:\/\/[^\s]+)/g;

/** Split a message body into text + link nodes, preserving newlines. */
function linkify(text: string): ReactNode[] {
  return text.split(URL_RE).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <Box
        key={i}
        component="a"
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color: LINK_COLOR, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
      >
        {part}
      </Box>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

/**
 * Robot face for the chat button. The pupils track the mouse pointer anywhere on
 * screen: each eye's real (post-layout) centre is read via getBoundingClientRect,
 * so the pupils point along the true direction to the cursor regardless of where
 * the Fab sits. Falls back to centred pupils on touch devices (no pointer moves).
 */
function RobotFace({ size = 38, smiling = false }: { size?: number; smiling?: boolean }) {
  const leftEyeRef = useRef<SVGCircleElement>(null);
  const rightEyeRef = useRef<SVGCircleElement>(null);
  const [pupils, setPupils] = useState({ lx: 0, ly: 0, rx: 0, ry: 0 });

  useEffect(() => {
    // Max pupil travel in viewBox units (eye radius 4.2 - pupil radius 1.9).
    const MAX = 2.3;
    let frame = 0;

    // Offset of one pupil, aimed at the cursor. Screen-space direction equals
    // viewBox direction because the SVG keeps its aspect ratio unscaled/unrotated.
    const offsetFor = (eye: SVGCircleElement | null, mx: number, my: number) => {
      if (!eye) return { x: 0, y: 0 };
      const r = eye.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = mx - cx;
      const dy = my - cy;
      const len = Math.hypot(dx, dy) || 1;
      return { x: (dx / len) * MAX, y: (dy / len) * MAX };
    };

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const l = offsetFor(leftEyeRef.current, e.clientX, e.clientY);
        const rt = offsetFor(rightEyeRef.current, e.clientX, e.clientY);
        setPupils({ lx: l.x, ly: l.y, rx: rt.x, ry: rt.y });
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
      {/* Antenna */}
      <line x1="22" y1="8" x2="22" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="2.5" r="1.8" fill="currentColor" />
      {/* Head */}
      <rect x="8" y="8" width="28" height="26" rx="7" fill="none" stroke="currentColor" strokeWidth="2.4" />
      {/* Eyes (white) with cursor-tracking pupils */}
      <circle ref={leftEyeRef} cx="17" cy="19" r="4.2" fill="#fff" />
      <circle ref={rightEyeRef} cx="27" cy="19" r="4.2" fill="#fff" />
      <circle cx={17 + pupils.lx} cy={19 + pupils.ly} r="1.9" fill="#1a1a1a" />
      <circle cx={27 + pupils.rx} cy={19 + pupils.ry} r="1.9" fill="#1a1a1a" />
      {/* Mouth: flat line + smile curve cross-fade on press */}
      <path
        d="M16 28 h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        style={{ opacity: smiling ? 0 : 1, transition: "opacity 0.18s ease" }}
      />
      <path
        d="M15 27 Q22 33 29 27"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        style={{ opacity: smiling ? 1 : 0, transition: "opacity 0.18s ease" }}
      />
    </svg>
  );
}

export default function ChatWidget() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [smiling, setSmiling] = useState(false);
  const grinTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Clean up the grin timer on unmount.
  useEffect(() => () => clearTimeout(grinTimer.current), []);

  // Pop a quick smile that resets itself, so a single tap shows the whole grin.
  function grin() {
    setSmiling(true);
    clearTimeout(grinTimer.current);
    grinTimer.current = setTimeout(() => setSmiling(false), 900);
  }

  // Grin whenever a button or link elsewhere on the page is pressed. The robot's
  // own controls (Fab + panel, tagged data-chat-widget) are excluded.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(
        'button, a, [role="button"], [role="link"]'
      );
      if (el && !el.closest("[data-chat-widget]")) grin();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  async function send(question: string) {
    const text = question.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!text || loading) return;

    setError(null);
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (resp.status === 429) {
        const body = await resp.json().catch(() => ({}));
        setError(body.detail ?? "You're sending messages too quickly. Please slow down.");
        return;
      }
      if (!resp.ok) throw new Error(`status ${resp.status}`);

      const data = await resp.json();
      setMessages((m) => [...m, { role: "bot", text: data.reply }]);
    } catch {
      setError("Sorry, I could not respond right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  const panel = (
    <Paper
      elevation={0}
      data-chat-widget
      sx={{
        position: "fixed",
        zIndex: (t) => t.zIndex.modal,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: "0 20px 60px -20px rgba(0,0,0,0.85)",
        ...(fullScreen
          ? { inset: 0, borderRadius: 0 }
          : {
              bottom: 96,
              right: 24,
              width: 380,
              maxWidth: "calc(100vw - 32px)",
              height: 560,
              maxHeight: "calc(100vh - 128px)",
              borderRadius: 1.5,
            }),
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 2,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: `${ACCENT}12`,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
            Ask about Marcus
          </Typography>
          <Typography sx={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em", color: LINK_COLOR }}>
            assistant
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => setOpen(false)} aria-label="Close chat">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          // Keep wheel/touch scrolling inside the panel; don't chain to the page.
          overscrollBehavior: "contain",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 2,
        }}
      >
        {messages.map((m, i) => (
          <Box
            key={i}
            sx={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "88%",
              bgcolor: m.role === "user" ? `${ACCENT}22` : "rgba(255,255,255,0.06)",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
              px: 1.5,
              py: 1,
            }}
          >
            <Typography
              component="div"
              sx={{
                fontSize: 13.5,
                lineHeight: 1.5,
                color: "text.primary",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {linkify(m.text)}
            </Typography>
          </Box>
        ))}

        {/* Suggested prompts (only before the first question) */}
        {messages.length === 1 && !loading && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 0.5 }}>
            {SUGGESTIONS.map((s) => (
              <Box
                key={s}
                component="button"
                onClick={() => send(s)}
                sx={{
                  cursor: "pointer",
                  font: "inherit",
                  fontSize: 12,
                  color: "text.secondary",
                  bgcolor: "transparent",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 999,
                  px: 1.25,
                  py: 0.5,
                  "&:hover": { borderColor: ACCENT, color: "text.primary" },
                }}
              >
                {s}
              </Box>
            ))}
          </Box>
        )}

        {loading && (
          <Box sx={{ alignSelf: "flex-start", px: 1.5, py: 1 }}>
            <CircularProgress size={16} sx={{ color: ACCENT }} />
          </Box>
        )}

        {error && (
          <Typography sx={{ alignSelf: "center", fontSize: 12, color: "error.light", textAlign: "center" }}>
            {error}
          </Typography>
        )}
      </Box>

      {/* Composer */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 1.25,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <TextField
          inputRef={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          size="small"
          fullWidth
          inputProps={{ maxLength: MAX_MESSAGE_CHARS, "aria-label": "Your question" }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 999 } }}
        />
        <IconButton
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send"
          sx={{ color: ACCENT }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );

  return (
    <>
      {open && panel}
      {/* On mobile the panel is full-screen with its own close button, so hide
          the Fab while open to avoid it floating over the chat. */}
      {!(open && fullScreen) && (
        <Fab
          color="primary"
          size={fullScreen ? "small" : "medium"}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close chat" : "Ask about Marcus"}
          data-chat-widget
          sx={{ position: "fixed", bottom: 24, right: 24, zIndex: (t) => t.zIndex.modal }}
        >
          {open ? <CloseIcon /> : <RobotFace size={fullScreen ? 26 : 32} smiling={smiling} />}
        </Fab>
      )}
    </>
  );
}
