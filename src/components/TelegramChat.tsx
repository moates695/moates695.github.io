import { Fragment, ReactNode } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { MONO } from "../styles/tokens";

export interface ChatMessage {
  /** Message body. Newlines are preserved; URLs are auto-linked. */
  text: string;
  /** Small time stamp shown in the bubble's corner, e.g. "19:32". */
  time: string;
  /**
   * A message you sent the bot (e.g. a `/seats` command), rendered right-aligned
   * in an accent bubble. Omitted/false = an incoming bot message (left-aligned).
   */
  outgoing?: boolean;
}

interface TelegramChatProps {
  messages: ChatMessage[];
  /** Bot avatar image (imported asset or public path). */
  avatar: string;
  /** Display name shown in the chat header. */
  name: string;
  accent?: string;
}

const LINK_COLOR = "#63c7b0";
const URL_RE = /(https?:\/\/[^\s]+)/g;

/** Split a message body into text + gold-teal link nodes, preserving newlines. */
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
 * A compact Telegram-style chat transcript: a header with the bot's avatar and
 * name, then a column of incoming (left-aligned) message bubbles. Used to show
 * example alerts as they actually arrive on the phone.
 */
export default function TelegramChat({ messages, avatar, name, accent = "#d8aa78" }: TelegramChatProps) {
  return (
    <Box
      sx={{
        maxWidth: 420,
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: "0 10px 30px -18px rgba(0,0,0,0.8)",
      }}
    >
      {/* Header bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 2,
          py: 1.25,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: `${accent}10`,
        }}
      >
        <Avatar src={avatar} alt="" variant="rounded" sx={{ width: 34, height: 34 }}>
          IX
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{name}</Typography>
          <Typography
            sx={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em", color: LINK_COLOR }}
          >
            bot
          </Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: { xs: 1.5, sm: 2 },
        }}
      >
        {messages.map((m, i) => (
          <Box
            key={i}
            sx={{
              alignSelf: m.outgoing ? "flex-end" : "flex-start",
              maxWidth: "92%",
              bgcolor: m.outgoing ? `${accent}22` : "rgba(255,255,255,0.06)",
              border: "1px solid",
              borderColor: m.outgoing ? `${accent}55` : "divider",
              borderRadius: m.outgoing ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
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
                fontFamily: m.outgoing ? MONO : undefined,
              }}
            >
              {linkify(m.text)}
            </Typography>
            <Typography
              sx={{
                fontSize: 10.5,
                color: "text.disabled",
                textAlign: "right",
                mt: 0.25,
              }}
            >
              {m.time}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
