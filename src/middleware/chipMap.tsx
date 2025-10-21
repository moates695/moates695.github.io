import { Chip } from "@mui/material";
import { JSX } from "react";

type ChipKey = 'python';

interface ChipData {
  label: string
  color: string
  borderColor: string
}

const chipData: Record<ChipKey, ChipData> = {
  python: {
    label: 'Python',
    color: '#0088ddff',
    borderColor: '#15a5ffff',
  }
};

export const chipMap = Object.fromEntries(
  Object.entries(chipData).map(([key, data]) => [
    key as ChipKey,
    <Chip
      label={data.label}
      variant="outlined"
      sx={{
        bgcolor: "#8b0000",
        borderColor: "#ff1f1fff",
        borderWidth: '2px',
        color: "white",
        fontWeight: 600,
      }}
    />
  ])
) as Record<ChipKey, JSX.Element>;
