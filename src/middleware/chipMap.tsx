import { Chip } from "@mui/material";
import { JSX } from "react";

interface ChipData {
  label: string
  color: string
  borderColor: string
  textColor: string
}

// Muted "Tech Sand" hues: warm gold/clay accents with cool cyan/indigo support,
// tuned to read clearly on the near-black sand surface.
const chipData = {
  python: {
    label: 'Python',
    color: 'transparent',
    borderColor: '#d8aa78',
    textColor: '#d8aa78',
  },
  react_ts: {
    label: 'React TS',
    color: 'transparent',
    borderColor: '#7aa2e3',
    textColor: '#7aa2e3',
  },
  express: {
    label: 'Express',
    color: 'transparent',
    borderColor: '#63c7b0',
    textColor: '#63c7b0',
  },
  postgres: {
    label: 'Postgres',
    color: 'transparent',
    borderColor: '#8fa0e8',
    textColor: '#8fa0e8',
  },
  client_side: {
    label: 'Client Side',
    color: 'transparent',
    borderColor: '#9aa6b8',
    textColor: '#9aa6b8',
  },
  full_stack: {
    label: 'Full Stack',
    color: 'transparent',
    borderColor: '#d8aa78',
    textColor: '#d8aa78',
  },
  ai_ml: {
    label: 'AI/ML',
    color: 'transparent',
    borderColor: '#e0846a',
    textColor: '#e0846a',
  },
  package: {
    label: 'Package',
    color: 'transparent',
    borderColor: '#c7b191',
    textColor: '#c7b191',
  },
  bug_fix: {
    label: 'Bug Fix',
    color: 'transparent',
    borderColor: '#e0897a',
    textColor: '#e0897a',
  },
  feature: {
    label: 'Feature',
    color: 'transparent',
    borderColor: '#8bcf8f',
    textColor: '#8bcf8f',
  },
  improvement: {
    label: 'Improvement',
    color: 'transparent',
    borderColor: '#b18cf0',
    textColor: '#b18cf0',
  },
  fastapi: {
    label: 'FastAPI',
    color: 'transparent',
    borderColor: '#63c7b0',
    textColor: '#63c7b0',
  },
  websocket: {
    label: 'WebSocket',
    color: 'transparent',
    borderColor: '#b18cf0',
    textColor: '#b18cf0',
  },
  expo: {
    label: 'Expo',
    color: 'transparent',
    borderColor: '#9aa6b8',
    textColor: '#9aa6b8',
  },
  telegram: {
    label: 'Telegram',
    color: 'transparent',
    borderColor: '#63c7b0',
    textColor: '#63c7b0',
  },
  automation: {
    label: 'Automation',
    color: 'transparent',
    borderColor: '#c7b191',
    textColor: '#c7b191',
  },
  mcp: {
    label: 'MCP',
    color: 'transparent',
    borderColor: '#8fd0d4',
    textColor: '#8fd0d4',
  },
  llm: {
    label: 'LLM',
    color: 'transparent',
    borderColor: '#a88be0',
    textColor: '#a88be0',
  },
  docker: {
    label: 'Docker',
    color: 'transparent',
    borderColor: '#79b8e0',
    textColor: '#79b8e0',
  },
  self_hosted: {
    label: 'Self-Hosted',
    color: 'transparent',
    borderColor: '#c7b191',
    textColor: '#c7b191',
  },
  javascript: {
    label: 'JavaScript',
    color: 'transparent',
    borderColor: '#d9b45a',
    textColor: '#d9b45a',
  },
  bluetooth: {
    label: 'Web Bluetooth',
    color: 'transparent',
    borderColor: '#5a8fd9',
    textColor: '#5a8fd9',
  },
  pwa: {
    label: 'PWA',
    color: 'transparent',
    borderColor: '#9a86e0',
    textColor: '#9a86e0',
  },
} satisfies Record<string, ChipData>;

export type ChipKey = keyof typeof chipData;

export const getChip = (key: ChipKey): JSX.Element => {
  const data = chipData[key];
  return (
    <Chip
      label={data.label}
      variant="outlined"
      size="small"
      sx={{
        bgcolor: `${data.borderColor}18`,
        borderColor: data.borderColor,
        borderWidth: '2px',
        color: data.textColor,
        fontWeight: 600,
        fontSize: 12,
      }}
    />
  )
};