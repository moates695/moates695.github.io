import { Chip } from "@mui/material";
import { JSX } from "react";

interface ChipData {
  label: string
  color: string
  borderColor: string
  textColor: 'white' | 'white'
}

const chipData = {
  python: {
    label: 'Python',
    color: '#0088ddff',
    borderColor: '#15a5ffff',
    textColor: 'white',
  },
  react_ts: {
    label: 'React TS',
    color: '#00c3ddff',
    borderColor: '#28e6ffff',
    textColor: 'white',
  },
  express: {
    label: 'Express',
    color: '#00dd3fff',
    borderColor: '#1aff5bff',
    textColor: 'white',
  },
  postgres: {
    label: 'Postgres',
    color: '#002cddff',
    borderColor: '#1e4bffff',
    textColor: 'white',
  },
  client_side: {
    label: 'Client Side',
    color: '#00dd90ff',
    borderColor: '#20ffb1ff',
    textColor: 'white',
  },
  full_stack: {
    label: 'Full Stack',
    color: '#dda600ff',
    borderColor: '#ffc71eff',
    textColor: 'white',
  },
  ai_ml: {
    label: 'AI/ML',
    color: '#dd00cbff',
    borderColor: '#ff17ecff',
    textColor: 'white',
  },
  package: {
    label: 'Package',
    color: '#ddc000ff',
    borderColor: '#ffe11fff',
    textColor: 'white',
  },
  bug_fix: {
    label: 'Bug Fix',
    color: '#dd0000ff',
    borderColor: '#ff1f1fff',
    textColor: 'white',
  },
  feature: {
    label: 'Feature',
    color: '#12dd00ff',
    borderColor: '#3dff2cff',
    textColor: 'white',
  },
  improvement: {
    label: 'Improvement',
    color: '#6b00ddff',
    borderColor: '#8c20ffff',
    textColor: 'white',
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
        bgcolor: data.color,
        borderColor: data.borderColor,
        borderWidth: '2px',
        color: data.textColor,
        fontWeight: 500,
        fontSize: 12,
      }}
    />
  )
};