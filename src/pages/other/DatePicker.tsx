import { Avatar, Box } from "@mui/material";
import { datePickerGithubLink, datePickerDemoLink } from "../../middleware/links";
import githubLogo from "../../assets/github-logo.png";
import MarkdownBlock from "../../components/MarkdownBlock";
import TelegramChat, { ChatMessage } from "../../components/TelegramChat";
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
  { id: "why", label: "Why not a text" },
  { id: "alerts", label: "What lands on my phone" },
  { id: "flow", label: "Request flow" },
  { id: "data", label: "Source of truth" },
  { id: "opens", label: "Knowing it was opened" },
  { id: "ops", label: "Local loop and deploy" },
];

/**
 * The three messages the app can send, in the order they actually arrive: the
 * one-off open, the reply, and a revision of that reply. Taken from the
 * formatter in app/notifications.py, so the emoji, the wording and the sorted,
 * two-space JSON are what Telegram actually receives; the open is shown as its
 * headline alone, without the line the real message adds to say it will not
 * repeat. Plain text with no parse_mode, which is why a note full of
 * punctuation cannot reformat anything.
 */
const exampleMessages: ChatMessage[] = [
  {
    text: "👀 User opened the page",
    time: "19:02",
  },
  {
    text:
      "💌 User replied\n\n" +
      "Rooftop cocktails, Friday evening\n\n" +
      "{\n" +
      '  "main": "rooftop_cocktails",\n' +
      '  "note": "yes, though I might be ten minutes late",\n' +
      '  "when": [\n' +
      '    "fri_pm"\n' +
      "  ]\n" +
      "}",
    time: "19:07",
  },
  {
    text:
      "🔄 User changed their answer\n\n" +
      "Dinner, Italian, then a walk, Saturday\n\n" +
      "{\n" +
      '  "dinner_after": "walk",\n' +
      '  "dinner_food": "italian",\n' +
      '  "main": "dinner",\n' +
      '  "when": [\n' +
      '    "saturday"\n' +
      "  ]\n" +
      "}",
    time: "21:14",
  },
];

/**
 * Why a page beats a text thread: laying out options a message can't hold
 * cleanly, and the two structural choices (no login, a fresh token and
 * bundle per person) that make an opaque link workable as the only
 * credential.
 */
const whyPoints = [
  "A nested list, main option a, b or c, then a sub-choice of i, ii or iii, is fine on paper and awkward in a text thread: line breaks collapse, autocorrect mangles the labels, and a reply like 'b, then ii' only makes sense if both sides still remember the numbering.",
  "A page fixes the layout problem outright. The options are laid out once, in order, on one screen, and answering is a tap rather than a transcription.",
  "It is also just more fun to receive. A picker built for one person, with its own wording and its own little animation, lands differently to a wall of text, and it is a nicer thing to be asked with.",
  "There is no login. The URL is the credential: whoever holds the link can open the page and answer it, the same trust model as sharing a photo link.",
  "Each person gets an opaque token and a bundle copied from a shared starter page, so wording, options, even the animation, can be personalised per person without ever touching the server.",
  "Because the URL doubles as the credential, every response carries a no-referrer policy, so the link cannot leak to another site through a Referer header, and an X-Robots-Tag of noindex, nofollow, noarchive, so a page can never be indexed or cached by a search engine.",
];

/**
 * The architectural consequence of the server never interpreting an answer:
 * what stays true of a response after the page that produced it has moved
 * on, and how a bad publish gets undone.
 */
const dataPoints = [
  "Postgres is the source of truth. A response is committed before Telegram is even called, so a failed notification leaves notified_at null but never loses the reply.",
  "Every publish is a new, immutable version. Nothing already on disk or in the pages table is overwritten; rolling back is just pointing an earlier version's is_live flag back on.",
  "Responses reference the page version rather than the person, so an old response stays interpretable even after the questions on the live page change under it.",
  "Every asset request, including the page itself, resolves through the same path-traversal guard: absolute paths and stray null bytes are rejected outright, and anything a symlink resolves outside the bundle directory fails a containment check before a file is ever opened.",
];

/**
 * How "opened" is measured without either a link-preview bot or the owner's
 * own testing corrupting the signal, and the one detail (a salted hash, not
 * a raw address) that keeps the safeguard itself private.
 */
const openPoints = [
  "Messaging apps fetch the page's HTML to build a link preview the instant a URL is sent, which would otherwise notify off the sender's own message. Those requests are recorded as kind = 'fetch' and never trigger a notification.",
  "The page's own JavaScript makes a second call, for context, once it is actually running in a browser. That call is recorded as kind = 'load', and it is the only kind that counts as a real open.",
  "Only the first real load notifies. Coming back to the page later is still recorded, just silently, so the signal stays a single opened / not opened bit rather than a running view count.",
  "Visiting a page yourself means adding -test to the token in the URL, which stores that visit flagged and silent. A suffix rather than a query parameter, so it survives being retyped from memory and so everything the page then asks for is marked by sitting under the same prefix. Nothing is written to the browser itself: forget the marker and the cost is a notification you can recognise as your own, not a browser permanently marked as yours.",
  "Addresses are stored as a salted hash of the token and the IP, never raw, which is enough to tell two visitors apart or spot a forwarded link without ever keeping anyone's actual address.",
];

/**
 * The loop for making and shipping a page (throwaway local Postgres, no
 * publish step while iterating) versus the one-off setup for the app itself
 * (shared nginx and Cloudflare, an SSH tunnel to a pinned home IP).
 */
const opsPoints = [
  "Local development runs against a throwaway Postgres 16 container on port 5433, since 5432 is already taken on this machine once Docker Desktop forwards it through Windows, migrated with a small numbered-SQL runner.",
  "Adding a person copies the shared starter bundle into a new folder named after their token, and the local server serves that folder directly, so editing the page shows up on refresh with no publish step while iterating.",
  "Publishing rsyncs that folder to the droplet as an immutable versioned copy and flips the live pointer for that person, over an SSH tunnel, because the production database only accepts connections from a pinned home IP that rotates.",
  "The app itself sits behind the same shared nginx-proxy-prod container and Cloudflare setup used by the other droplet-hosted projects on this site, so adding the subdomain needed no certificate work of its own.",
  "The request-path tests are stateless: a fake stands in for the database, so the suite needs neither a network connection nor a running Postgres.",
];

export default function OtherDatePicker() {
  // The path every request walks: resolve the token, serve whatever the
  // bundle contains, and forward a copy of any answer to Telegram. Adapted
  // from the project README's own diagram.
  const flowDiagram = `\`\`\`
date.moates.com.au/d/<token>/
        │
        ▼
  nginx-proxy-prod ──► dates-prod (FastAPI) ──► Postgres 16 (host)
                              │
                              └──► Telegram (notification only)
\`\`\``;

  // The entire server-side contract. Everything under "answers" is the
  // page's business, not the server's.
  const submitJson = `\`\`\`json
{ "summary": "Rooftop cocktails, Friday evening",
  "answers": { "main": "rooftop_cocktails", "when": ["fri_pm"] } }
\`\`\``;

  // Simplified: primary keys and timestamps left out to keep the shape
  // readable. The full columns are in db_schema/migrations.
  const schemaBlock = `\`\`\`
pages      (person_id, version, bundle_dir, is_live)
responses  (page_id, summary, answers jsonb, notified_at)
page_views (page_id, kind, is_self, ip_hash, notified_at)
\`\`\``;

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
        eyebrow="poc"
        title={<>Date <GradientText>Picker</GradientText></>}
        subtitle="A fun little alternative to plain texting. Rather than sending someone a nested list of options and waiting on a reply that reads like outline notation, you send them their own one-page picker: they tap what they like, and the answer lands in Postgres and pings my phone on Telegram."
        actions={
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            <ExternalButton href={datePickerDemoLink}>Try it</ExternalButton>
            <ExternalButton
              href={datePickerGithubLink}
              icon={<Avatar alt="github icon" src={githubLogo} sx={{ width: 24, height: 24 }} />}
            >
              Source
            </ExternalButton>
          </Box>
        }
      />

      <Reveal delay={0.06}>
        <Panel accent={ACCENT} wash>
          <StatRow
            items={[
              { value: "No login", label: "required" },
              { value: "2", label: "view kinds" },
              { value: "JSONB", label: "answers storage" },
              { value: "Telegram", label: "notifications" },
            ]}
          />
        </Panel>
      </Reveal>

      <Reveal delay={0.12}>
        <MarkdownBlock>
          {`What exists today is a small FastAPI app, a Postgres schema keyed on people and page versions, and a shared HTML/CSS/JS starter bundle that gets copied and personalised for each new page. That is the whole system: the rest of this page walks through why it works the way it does.`}
        </MarkdownBlock>
        {/* Two separate claims, so they get their own boxes and their own air:
            what state the project is in, and where to go and press the buttons
            yourself. */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Callout accent={ACCENT} title="status">
            A working proof of concept, deployed on the droplet behind the shared nginx and
            Cloudflare setup described below, not a polished product.
          </Callout>
          {/* The demo is a real page on the live app, not a mock: same endpoints,
              same table. One flag on its row stops it notifying, meters
              submissions per visitor rather than per page, and stops one
              stranger's answer being shown back to the next. */}
          <Callout accent={ACCENT} title="try it">
            <Box
              component="a"
              href={datePickerDemoLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: ACCENT }}
            >
              date.moates.com.au/d/trydate
            </Box>{" "}
            is a public demo of the real thing, running on the same app and storing into the same
            table. It is flagged as a demo, so it never notifies anyone and never shows your answer
            to the next person who opens it.
          </Callout>
        </Box>
      </Reveal>

      <Reveal delay={0.18} id="why">
        <SectionHeading eyebrow="motivation">Why not a text</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          Texting someone a list of options works right up until the list has a list inside it. At
          that point you are asking a person who only wants to know what is happening on Friday to
          reply in outline notation. A picker built for them is clearer, and a nicer thing to be
          sent.
        </Box>
        <CheckList items={whyPoints} accent={ACCENT} />
      </Reveal>

      {/* Sits second, ahead of the architecture: this is the whole thing
          working, in the form it is actually experienced, and it costs three
          bubbles to show. Everything after it explains how those three
          messages come to be the only three. */}
      <Reveal delay={0.24} id="alerts">
        <SectionHeading eyebrow="on my phone">What lands on my phone</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          Three messages, and no others. The open fires once and never again, so the silence
          afterwards is the design rather than something broken. A reply
          carries the page's own summary line above the raw answers object, which is stored
          verbatim and pasted in untouched, because the server has no idea what any of those keys
          mean. Revising an answer gets its own headline, so a second buzz is never mistaken for a
          second person:
        </Box>
        <Box sx={{ display: "flex", justifyContent: { xs: "stretch", sm: "flex-start" } }}>
          <TelegramChat
            messages={exampleMessages}
            name="Date Picker"
            initials="DP"
            accent={ACCENT}
          />
        </Box>
        <Box sx={{ color: "text.secondary", mt: 2.5 }}>
          Everything is sent as plain text with no parse mode, so a note full of underscores or
          asterisks cannot break or reformat the message, and nothing needs escaping on the way
          out. The public demo above is the exception to all of this: it is flagged so that
          neither opening it nor answering it sends anything at all.
        </Box>
      </Reveal>

      <Reveal delay={0.3} id="flow">
        <SectionHeading eyebrow="request path">Request flow</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          Every request for a page walks the same short path, and the server does not know or care
          what is inside the bundle it happens to be serving:
        </Box>
        <Panel accent={ACCENT}>
          <MarkdownBlock>{flowDiagram}</MarkdownBlock>
        </Panel>
        <Box sx={{ color: "text.secondary", mt: 2.5, mb: 2 }}>
          Resolving a token happens once per request, and a malformed one is rejected before it
          reaches the database. Answering the form is a single POST, and the server does not parse
          the individual answers: it checks that the body is well formed, bounded JSON (capped at
          32 KB, with limits on nesting depth, key count and string length) and stores whatever is
          inside answers untouched. Repeated submissions from the same token are throttled, so
          hammering the endpoint gets a 429 rather than a flood of notifications:
        </Box>
        <Panel accent={ACCENT}>
          <MarkdownBlock>{submitJson}</MarkdownBlock>
        </Panel>
      </Reveal>

      <Reveal delay={0.36} id="data">
        <SectionHeading eyebrow="design decision">Source of truth</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          The server is deliberately ignorant of what any page means. The answers object is stored
          verbatim as JSONB and never inspected on the way in or out, and the summary line is written
          by the page's own JavaScript, because the page is the only thing that knows what its own
          answers mean. The consequence is structural: a new page, with its own layout, animation and
          interactions, never needs a change to the server.
        </Box>
        <CheckList items={dataPoints} accent={ACCENT} />
        <Panel accent={ACCENT} sx={{ mt: 2 }}>
          <MarkdownBlock>{schemaBlock}</MarkdownBlock>
        </Panel>
      </Reveal>

      <Reveal delay={0.42} id="opens">
        <SectionHeading eyebrow="signal, not noise">Knowing it was opened</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          A quieter signal sits alongside the response itself: whether the page was even opened.
          The target is a single bit, opened or not opened, and getting that bit right means
          filtering out two sources of false positives before it can be trusted.
        </Box>
        <CheckList items={openPoints} accent={ACCENT} />
      </Reveal>

      <Reveal delay={0.48} id="ops">
        <SectionHeading eyebrow="running it">Local loop and deploy</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          Making and shipping a page is a different loop to changing the app itself, and only one
          of them touches the droplet at all.
        </Box>
        <CheckList items={opsPoints} accent={ACCENT} />
      </Reveal>

      <PageNav
        left={{ text: "Authenticator", link: "/other/authenticator" }}
        right={{ text: "Trading Strategies", link: "/other/trading-strategies" }}
      />
    </Box>
    </SectionNavLayout>
  );
}
