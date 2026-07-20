import { Box } from "@mui/material";
import MarkdownBlock from "../../components/MarkdownBlock";
import { Reveal, PageHeader, GradientText, Panel } from "../../components/design";

const ACCENT = "#82b1ff";

export default function WoodchuckPrivacyPolicy() {
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 3, sm: 4 },
        pb: 4,
      }}
    >
      <PageHeader
        eyebrow="legal"
        title={
          <>
            Privacy <GradientText>policy</GradientText>
          </>
        }
        subtitle="Woodchuck runs entirely on your device and collects nothing. The full policy is below."
      />

      <Reveal delay={0.06}>
        <Panel accent={ACCENT}>
          <MarkdownBlock>
            {`**Last updated:** 10/05/26

This Privacy Policy explains how **Woodchuck** ("we", "our", or "us") handles information when you use our mobile application (the "App").

By using the App, you agree to this Privacy Policy.

---

## 1. No Data Collection

Woodchuck does **not** collect, store, transmit, or share any personal information or data from its users.

The App runs entirely on your device. All game data (players, scores, settings) lives locally on your device for the duration of your session and is not sent anywhere.

---

## 2. What We Don't Do

To be explicit, Woodchuck does not:

* Collect personal information (name, email, account identifiers, etc.)
* Require sign-in or account creation
* Use cookies, analytics, or tracking technologies
* Share data with third parties
* Store user data on any servers
* Display advertising or use advertising identifiers
* Access device features such as contacts, location, camera, or microphone

---

## 3. Permissions

Woodchuck does not request any sensitive runtime permissions. The App only needs storage access necessary for installation and local app data.

---

## 4. Children's Privacy

Because Woodchuck does not collect any data, no information is collected from children or any other users.

---

## 5. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Changes will be posted on this page and the "Last updated" date will be revised.

Your continued use of the App after changes become effective constitutes acceptance of the updated Privacy Policy.

---

## 6. Contact Us

If you have questions about this Privacy Policy, contact us at:

**Email:** marcusjoates@gmail.com

**Entity name:** Woodchuck`}
          </MarkdownBlock>
        </Panel>
      </Reveal>
    </Box>
  );
}
