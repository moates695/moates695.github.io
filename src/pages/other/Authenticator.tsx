import { Avatar, Box } from "@mui/material";
import { authenticatorGithubLink } from "../../middleware/links";
import githubLogo from "../../assets/github-logo.png";
import MarkdownBlock from "../../components/MarkdownBlock";
import {
  PageHeader,
  GradientText,
  Reveal,
  SectionHeading,
  Panel,
  Callout,
  CheckList,
  StatRow,
  ExternalButton,
  PageNav,
} from "../../components/design";
import { SectionNavLayout, Section } from "../../components/SectionNav";

const ACCENT = "#d8aa78";

const SECTIONS: Section[] = [
  { id: "folders", label: "Folders first" },
  { id: "clock", label: "One shared clock" },
  { id: "vault", label: "At-rest encryption" },
  { id: "sync", label: "Zero-knowledge sync" },
  { id: "next", label: "What's next" },
];

const folderPoints = [
  "TOTP and HOTP code generation, the two standards behind essentially every issuer that hands out a QR code.",
  "Folders are one level deep, on purpose: a folder holds entries, never other folders, which is enough to sort work, personal and one-off accounts without turning the list into a file tree.",
  "Add a code by scanning its QR, entering the fields manually, or pasting a full otpauth:// link straight in.",
  "Deleting a folder moves its entries to Ungrouped rather than deleting them, since a folder is organisation, not ownership.",
  "Light and dark theming, matched to the system setting.",
];

const clockIndicatorPoints = [
  "TickContext carries the raw time, refreshed every 200ms, and only the countdown ring subscribes to it. That is the only thing on screen that needs a smooth sweep.",
  "WindowContext carries the index of the current 30-second TOTP window. It only changes when a code actually changes, so every code row subscribes to that instead and re-renders twice a minute rather than five times a second.",
  "The ticker stops while the app is backgrounded and resyncs against the real clock the moment it returns, rather than drifting through however long it was suspended.",
  "An entry with a period other than 30 seconds, or an HOTP entry with no period at all, cannot be represented by the shared ring honestly. Those rows carry their own small indicator instead of quietly showing a countdown that is wrong for them.",
];

const vaultPoints = [
  "The 32-byte data key lives in the platform keystore, Keychain on iOS, Android Keystore via expo-secure-store, and never enters the vault file itself.",
  "A fresh nonce is generated on every single write, so no nonce is ever reused under the same key.",
  "Writes land in a sibling temp file first, then the temp file replaces the real one. An interrupted save can leave the temp file half-written, but it can never leave vault.bin itself half-written.",
  "Plaintext exists only in memory, for as long as a screen needs it decrypted.",
];

const keyDerivationPoints = [
  "Passphrase and email go through Argon2id to a master key, which an HKDF split turns into two independent keys: an auth key and an encryption key.",
  "The auth key is what the device sends the server. The encryption key never leaves the device; it only ever wraps the data key that actually encrypts the vault.",
  "Because the split is one-way, a full server breach yields the auth key's hash and two wrapped copies of a data key, none of which unwrap anything without the encryption key that stayed on the phone.",
  "Changing the passphrase re-derives and re-wraps 32 bytes. It does not re-encrypt or re-upload the vault itself.",
  "A recovery key, a second wrapping of the data key under 32 random bytes shown once at setup, is mandatory rather than optional. Either the passphrase or the recovery key unwraps the vault, and the server can read neither. Without it, a forgotten passphrase would permanently lock someone out of every account they own.",
];

const concurrencyPoints = [
  "Writes carry a base_version. A mismatch comes back as 409 with the current version, ciphertext and updated_at attached, so the client can merge and retry in one round trip instead of two.",
  "Merging does not need a CRDT: entries carry stable UUIDs and updated_at timestamps, deletes leave tombstones, and a TOTP seed never changes after creation. A real conflict is almost always \"phone added X while tablet added Y\", which unions cleanly.",
  "Login is the entire brute-force surface, so it is throttled both ways: nginx-level limit_req zones keyed on the real client IP, plus an application-level cap of 10 attempts per account per 15 minutes and 5 registrations per IP per hour.",
  "Access logging is off on purpose. A log of which accounts synced when would itself be a record worth protecting.",
];

const nextPoints = [
  "Import from Google Authenticator's otpauth-migration:// protobuf first, since that covers the largest share of accounts anyone is likely to be moving from.",
  "Then Aegis, 2FAS and Bitwarden JSON exports, in roughly that order.",
  "Encrypted export, passphrase-protected by default.",
  "A plaintext otpauth:// export will exist but sit behind an explicit confirmation, because the OS share sheet is one tap away from dropping raw seeds into iCloud or Drive.",
  "On the client: the key hierarchy, the sync engine that actually calls these endpoints, and the onboarding flow that creates or unlocks an account. None of that has been started yet.",
];

const endpointBlock = `\`\`\`
POST /v1/prelogin        {email} -> kdf params
                         (same shape for unknown emails, so this
                         endpoint cannot be used to enumerate accounts)
POST /v1/register        {email, auth_key, kdf, wrapped_passphrase,
                         wrapped_recovery} -> a usable session
POST /v1/login           {email, auth_key} -> session, kdf, both
                         wrapped copies of the data key
POST /v1/logout          ends the current session
GET  /v1/vault           {version, ciphertext, updated_at}
PUT  /v1/vault           {base_version, ciphertext} -> version,
                         or 409 with the current state attached
PUT  /v1/keys            passphrase change or recovery-key rotation;
                         revokes every existing session
POST /v1/account/delete  irreversible; needs the auth key and a session
\`\`\``;

const byteLayoutBlock = `\`\`\`
byte 0        format version
bytes 1..24   XChaCha20 nonce, fresh on every write
bytes 25..    XChaCha20-Poly1305 ciphertext with a 16-byte tag appended
\`\`\``;

export default function OtherAuthenticator() {
  return (
    <SectionNavLayout sections={SECTIONS}>
      <Box
        component="section"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: { xs: 3, sm: 4 },
          pb: 4,
        }}
      >
        <PageHeader
          eyebrow="test"
          title={<>An authenticator with <GradientText>folders</GradientText></>}
          subtitle="A TOTP and HOTP authenticator for Android and iOS, built to fix one specific annoyance: Google Authenticator still will not let you group codes. This one does, in folders one level deep, on top of a vault that is encrypted locally on the phone."
          actions={
            <ExternalButton
              href={authenticatorGithubLink}
              icon={<Avatar alt="github icon" src={githubLogo} sx={{ width: 24, height: 24 }} />}
            >
              Source
            </ExternalButton>
          }
        />

        <Reveal delay={0.06}>
          <Panel accent={ACCENT} wash>
            <StatRow
              items={[
                { value: "1", label: "folder depth" },
                { value: "30s", label: "TOTP window" },
                { value: "54.0.23", label: "Expo SDK" },
                { value: "29", label: "server tests" },
              ]}
            />
          </Panel>
        </Reveal>

        <Reveal delay={0.12}>
          <Box sx={{ color: "text.secondary" }}>
            The idea started as a personal itch: an authenticator that lets its owner group codes
            into folders, which is a feature the mainstream apps have simply never shipped. Building
            it properly turned into three separate pieces of work at three very different stages of
            finish, and this page is honest about which is which.
          </Box>
          <Callout accent={ACCENT} title="status">
            Phase 1 is done and running on device: local encrypted vault, TOTP and HOTP generation,
            QR scanning, manual and pasted otpauth:// entry, folders, light and dark theming. Phase
            2's sync server is built with a passing test suite, but it has not been deployed, there
            is no live DNS record for it yet, and the client side of sync (key hierarchy, sync
            engine, onboarding) has not been started. Nothing syncs end to end today: this phone is
            still the only copy of every code. Phase 3, importing from other authenticators and
            encrypted export, is planned only.
          </Callout>
        </Reveal>

        <Reveal delay={0.18} id="folders">
          <SectionHeading eyebrow="motivation">Folders, one level deep</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            Work logins, personal accounts and services you signed up for once all end up in the
            same flat list in Google Authenticator, Authy and most of the rest. This app adds
            exactly one level of structure on top of an otherwise ordinary local authenticator,
            rather than trying to be a password manager as well.
          </Box>
          <CheckList items={folderPoints} accent={ACCENT} />
        </Reveal>

        <Reveal delay={0.24} id="clock">
          <SectionHeading eyebrow="rendering">One clock, driving every row</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            A list of codes only needs to look alive; it does not need to actually recompute
            anything more than twice a minute. The app is built around that distinction rather than
            re-rendering every row on every tick.
          </Box>
          <CheckList items={clockIndicatorPoints} accent={ACCENT} />
        </Reveal>

        <Reveal delay={0.3} id="vault">
          <SectionHeading eyebrow="storage">Encrypted at rest, always</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            The vault is one JSON document, holding every folder and entry, encrypted as a single
            opaque blob before it ever touches disk:
          </Box>
          <Panel accent={ACCENT}>
            <MarkdownBlock>{byteLayoutBlock}</MarkdownBlock>
          </Panel>
          <Box sx={{ mt: 2 }}>
            <CheckList items={vaultPoints} accent={ACCENT} />
          </Box>
        </Reveal>

        <Reveal delay={0.36} id="sync">
          <SectionHeading eyebrow="sync design">Zero-knowledge sync, half built</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            The threat this is designed against is losing or destroying the phone, which is the
            most likely way to lose access to every account at once. It is deliberately not device
            compromise: malware on an unlocked phone already has the vault, and a server-side copy
            neither helps nor hurts that case. A TOTP seed is a bearer credential, anyone holding
            one can mint valid codes indefinitely, with no rotation prompt and no breach
            notification, so the server must never be in a position to see one in the clear.
          </Box>
          <CheckList items={keyDerivationPoints} accent={ACCENT} />
          <Box sx={{ color: "text.secondary", mt: 2.5, mb: 2 }}>
            The design brief called for a "four-endpoint" server with no crypto responsibilities.
            The implementation ended up at eight, once anti-enumeration on login, session logout,
            key rotation and account deletion were added, but the principle held: it stores and
            moves opaque blobs and can decrypt none of them.
          </Box>
          <Panel accent={ACCENT}>
            <MarkdownBlock>{endpointBlock}</MarkdownBlock>
          </Panel>
          <Box sx={{ mt: 2 }}>
            <CheckList items={concurrencyPoints} accent={ACCENT} />
          </Box>
          <Box sx={{ mt: 2.5 }}>
            <Callout accent={ACCENT} title="built vs deployed">
              The server (FastAPI, SQLite, an nginx vhost, a deploy script) is written and covered
              by 29 endpoint tests, plus six more for the vhost installer. It targets a container
              on the existing droplet behind Cloudflare, publishing no ports of its own. What is
              missing is entirely on the client: no key hierarchy, no sync engine, no onboarding
              screen, and the DNS record the deploy script depends on has not been created. Calling
              it "in progress" rather than "working" is the accurate description.
            </Callout>
          </Box>
        </Reveal>

        <Reveal delay={0.42} id="next">
          <SectionHeading eyebrow="roadmap">What's next</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            Sync is the priority once it starts moving. Import and export come after, since they
            only matter once there is something worth moving codes into:
          </Box>
          <CheckList items={nextPoints} accent={ACCENT} />
        </Reveal>

        <PageNav
          left={{ text: "Projects", link: "/projects" }}
          right={{ text: "Event Picker", link: "/other/event-picker" }}
        />
      </Box>
    </SectionNavLayout>
  );
}
