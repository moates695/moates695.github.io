import { Box } from "@mui/material";
import MarkdownBlock from "../../components/MarkdownBlock";
import { Reveal, PageHeader, GradientText, Panel } from "../../components/design";

const ACCENT = "#d8aa78";

export default function AuthenticatorPrivacyPolicy() {
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
        subtitle="Authenticator keeps every code on your device, encrypted at rest, and collects nothing. The full policy is below."
      />

      <Reveal delay={0.06}>
        <Panel accent={ACCENT}>
          <MarkdownBlock>
            {`**Last updated:** 18/08/26

This Privacy Policy explains how **Authenticator** ("we", "our", or "us") handles information when you use our mobile application (the "App").

By using the App, you agree to this Privacy Policy.

---

## 1. No Data Collection

Authenticator does **not** collect, store, transmit, or share any personal information or data from its users.

The App runs entirely on your device. Your accounts, secrets, folders and settings are stored locally, encrypted, and are not sent anywhere.

---

## 2. What We Don't Do

To be explicit, Authenticator does not:

* Collect personal information (name, email, account identifiers, etc.)
* Require sign-in or account creation
* Use cookies, analytics, crash reporting, or tracking technologies
* Share data with third parties
* Store user data on any servers
* Display advertising or use advertising identifiers
* Read your contacts, location, or microphone

---

## 3. How Your Codes Are Stored

Your vault (every folder and every account you add) is encrypted on your device before it is written to disk, using a key held in the platform keystore (Keychain on iOS, the Android Keystore on Android). Decrypted data exists only in memory, only while a screen needs it.

We have no copy of your vault and no way to recover it. If you uninstall the App, or lose the device, the codes stored on it are gone.

---

## 4. Camera Permission

The App asks for camera access for one purpose: scanning a QR code to add an account. The camera preview is processed on your device, images are not stored, and nothing from the camera is transmitted anywhere. You can decline the permission and add accounts manually instead.

---

## 5. Optional Sync

Sync is not available in the current version of the App, and no data leaves your device today.

If and when sync is offered, it will be opt-in and zero-knowledge: your vault is encrypted on your device before upload, the encryption key is derived on your device and never sent to the server, and the server stores only an opaque blob it cannot read. This policy will be updated before any such feature ships.

---

## 6. Children's Privacy

Because Authenticator does not collect any data, no information is collected from children or any other users.

---

## 7. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Changes will be posted on this page and the "Last updated" date will be revised.

Your continued use of the App after changes become effective constitutes acceptance of the updated Privacy Policy.

---

## 8. Contact Us

If you have questions about this Privacy Policy, contact us at:

**Email:** marcus@moates.com.au

**Entity name:** Authenticator`}
          </MarkdownBlock>
        </Panel>
      </Reveal>
    </Box>
  );
}
