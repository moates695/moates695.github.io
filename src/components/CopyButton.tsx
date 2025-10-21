import { useState } from "react";
import { Button, IconButton, Snackbar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export interface CopyButtonProps {
  text: string
}

export default function CopyButton(props: CopyButtonProps) {
  const { text } = props;

  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setOpen(true);
  };

  return (
    <>
      <IconButton
        onClick={handleCopy}
        size="small"
      >
        <ContentCopyIcon fontSize="inherit"/>
      </IconButton>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        message="Copied to clipboard!"
      />
    </>
  );
}
