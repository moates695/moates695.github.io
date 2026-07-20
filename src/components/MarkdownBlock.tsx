/**
 * Styled Markdown renderer that matches the site's design language:
 * mono eyebrow-style headings, accent-tinted inline code, and framed,
 * horizontally-scrollable code blocks. Use for API-doc / package pages.
 */
import { Box, Divider, Link, Typography } from "@mui/material";
import ReactMarkdown, { Components } from "react-markdown";
import { MONO } from "../styles/tokens";

const components: Components = {
  h1: ({ children }) => (
    <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.02em", mt: 4, mb: 1.5 }}>
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Box sx={{ mt: 4, mb: 1.5 }}>
      <Typography sx={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "primary.main" }}>
        {children}
      </Typography>
      <Divider sx={{ mt: 1, borderColor: "divider" }} />
    </Box>
  ),
  h3: ({ children }) => (
    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>
      {children}
    </Typography>
  ),
  h4: ({ children }) => (
    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.secondary", mt: 2, mb: 0.5 }}>
      {children}
    </Typography>
  ),
  p: ({ children }) => (
    <Typography variant="body1" sx={{ color: "text.secondary", my: 1.25 }}>
      {children}
    </Typography>
  ),
  a: ({ href, children }) => (
    <Link href={href} target="_blank" rel="noopener" underline="hover" sx={{ color: "primary.main" }}>
      {children}
    </Link>
  ),
  ul: ({ children }) => (
    <Box component="ul" sx={{ pl: 3, my: 1, color: "text.secondary", "& li": { mb: 0.5 } }}>
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box component="ol" sx={{ pl: 3, my: 1, color: "text.secondary", "& li": { mb: 0.5 } }}>
      {children}
    </Box>
  ),
  li: ({ children }) => <Box component="li">{children}</Box>,
  code: ({ children }) => (
    <Box
      component="code"
      sx={{
        fontFamily: MONO,
        fontSize: "0.85em",
        px: 0.6,
        py: 0.15,
        borderRadius: 1,
        bgcolor: "rgba(77, 208, 225, 0.12)",
        color: "primary.main",
        wordBreak: "break-word",
      }}
    >
      {children}
    </Box>
  ),
  pre: ({ children }) => (
    <Box
      component="pre"
      sx={{
        my: 2,
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: (theme) => (theme.palette.mode === "dark" ? "#12121a" : "#f4f6f8"),
        overflowX: "auto",
        fontFamily: MONO,
        fontSize: 13,
        lineHeight: 1.6,
        // reset the inline-code styling for code inside a block
        "& code": {
          bgcolor: "transparent",
          color: "text.primary",
          p: 0,
          fontSize: "inherit",
        },
      }}
    >
      {children}
    </Box>
  ),
};

export default function MarkdownBlock({ children }: { children: string }) {
  return (
    <Box sx={{ maxWidth: "100%" }}>
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </Box>
  );
}
