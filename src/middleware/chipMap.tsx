import { Chip } from "@mui/material";
import { JSX } from "react";

interface ChipData {
  label: string
  color: string
  borderColor: string
  textColor: string
}

const chipData = {
  python: {
    label: 'Python',
    color: 'transparent',
    borderColor: '#64b5f6',
    textColor: '#42a5f5',
  },
  react_ts: {
    label: 'React TS',
    color: 'transparent',
    borderColor: '#4dd0e1',
    textColor: '#26c6da',
  },
  express: {
    label: 'Express',
    color: 'transparent',
    borderColor: '#66bb6a',
    textColor: '#4caf50',
  },
  postgres: {
    label: 'Postgres',
    color: 'transparent',
    borderColor: '#7986cb',
    textColor: '#5c6bc0',
  },
  client_side: {
    label: 'Client Side',
    color: 'transparent',
    borderColor: '#4db6ac',
    textColor: '#26a69a',
  },
  full_stack: {
    label: 'Full Stack',
    color: 'transparent',
    borderColor: '#ffb74d',
    textColor: '#ffa726',
  },
  ai_ml: {
    label: 'AI/ML',
    color: 'transparent',
    borderColor: '#f06292',
    textColor: '#ec407a',
  },
  package: {
    label: 'Package',
    color: 'transparent',
    borderColor: '#ffd54f',
    textColor: '#ffca28',
  },
  bug_fix: {
    label: 'Bug Fix',
    color: 'transparent',
    borderColor: '#ef9a9a',
    textColor: '#ef5350',
  },
  feature: {
    label: 'Feature',
    color: 'transparent',
    borderColor: '#81c784',
    textColor: '#66bb6a',
  },
  improvement: {
    label: 'Improvement',
    color: 'transparent',
    borderColor: '#b39ddb',
    textColor: '#9575cd',
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