import { Box, Paper, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import PageLinks from "../../components/PageLinks";

export default function PrivacyPolicy() {
  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        gap: '10px',
      }}
    >
      <PageLinks />
      <Typography variant="h5">
        Privacy Policy
      </Typography>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'auto',
        }}
      >
        <ReactMarkdown>
          {`**Last updated:** 10/05/26

This Privacy Policy explains how **Poppycock** ("we", "our", or "us") handles information when you use our mobile application (the "App").

By using the App, you agree to this Privacy Policy.

---

## 1. Information We Handle

Poppycock is a real-time multiplayer game. To run a game session, the App sends the following to our server:

* A randomly generated player identifier stored on your device
* Your chosen display name for the session
* Room codes you create or join
* The answers and votes you submit during a round
* Per-round and per-room scores

We do **not** require sign-in, do **not** ask for your real name, email address or contact information, and do **not** use third-party analytics, advertising or tracking SDKs.

---

## 2. How Long We Keep It

Round content (real answers, fake answers and votes) lives only in server memory for the duration of an active round and is discarded once the round is scored.

Room metadata, players, scores and score deltas are stored in our database for as long as the room exists, so that returning players can rejoin and view their history.

---

## 3. What We Don't Do

To be explicit, Poppycock does not:

* Collect personal information beyond a self-chosen display name
* Use cookies, advertising identifiers or third-party analytics
* Share data with third parties
* Access device features such as contacts, location, camera, or microphone

---

## 4. Children's Privacy

Poppycock is not directed at children under 13 and we do not knowingly collect data from them.

---

## 5. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Changes will be posted on this page and the "Last updated" date will be revised.

Your continued use of the App after changes become effective constitutes acceptance of the updated Privacy Policy.

---

## 6. Contact Us

If you have questions about this Privacy Policy, contact us at:

**Email:** marcusjoates@gmail.com

**Entity name:** Poppycock`}
        </ReactMarkdown>
      </Paper>
    </Box>
  )
}
