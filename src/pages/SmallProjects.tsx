import { useEffect, useState } from "react";
import { Avatar, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { mcpServerGithubLink, secretsVaultGithubLink } from "../middleware/links";
import githubLogo from "../assets/github-logo.png";
import MarkdownBlock from "../components/MarkdownBlock";
import { MONO } from "../styles/tokens";
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
} from "../components/design";

const ACCENT = "#d8aa78";

/**
 * "Small Projects" is a single hub page that collects the smaller builds that
 * do not warrant a full case study of their own. Each project is one section
 * down the page, and the sticky `OnThisPage` bar at the top links straight to
 * each of them. Adding a project is: append to `PROJECTS`, then render a matching
 * `<Box id=...>` section below.
 */
interface SmallProject {
  /** Element id of the section wrapper, also the scroll target. */
  id: string;
  /** Label shown in the top "on this page" bar. */
  label: string;
}

const PROJECTS: SmallProject[] = [
  { id: "secrets-vault", label: "Secrets Vault" },
  { id: "site-analytics", label: "Site Analytics" },
];

// Where a clicked link lands: below the sticky app bar plus the sticky nav bar.
const SCROLL_OFFSET = 128;

/**
 * Sticky bar of links to each project on the page. Mirrors the site's numbered
 * rail in spirit (scroll-spy + smooth scroll) but sits at the top as a wrapping
 * row of pills, so it reads well on mobile and scales as projects are added.
 */
function OnThisPage({ items }: { items: SmallProject[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.4;
      let cur = 0;
      items.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= mid) cur = i;
      });
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <Box
      component="nav"
      aria-label="On this page"
      sx={{
        position: "sticky",
        top: { xs: 56, sm: 64 },
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: { xs: 1, sm: 1.25 },
        py: 1.25,
        // Let the content scroll under the bar without bleeding through.
        bgcolor: "rgba(11,9,8,0.72)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        component="span"
        sx={{
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "text.disabled",
          mr: 0.5,
        }}
      >
        On this page
      </Box>
      {items.map((s, i) => {
        const on = i === active;
        return (
          <Box
            key={s.id}
            component="button"
            onClick={() => go(s.id)}
            sx={{
              all: "unset",
              cursor: "pointer",
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.02em",
              lineHeight: 1,
              px: 1.25,
              py: 0.75,
              borderRadius: 999,
              border: "1px solid",
              borderColor: on ? `${ACCENT}80` : "divider",
              color: on ? ACCENT : "text.secondary",
              bgcolor: on ? `${ACCENT}14` : "transparent",
              transition: "color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease",
              "&:hover": { color: ACCENT, borderColor: `${ACCENT}80` },
              "&:focus-visible": { outline: `1px solid ${ACCENT}` },
            }}
          >
            {s.label}
          </Box>
        );
      })}
    </Box>
  );
}

/* ── Project sections ─────────────────────────────────────────────────── */

const vaultArchitecture = `\`\`\`text
Internet -> Cloudflare (proxied) --443--> nginx (existing)
                                            |  TLS: Cloudflare Origin cert
                                            |  vhost: vault.<domain>
                                            v
                                       vaultwarden  (shared Docker network, no host ports)
                                            |
                                       ./vw-data  (db.sqlite3, attachments, keys)
\`\`\``;

const security = [
  "Per-user accounts with client-side encryption: the server only ever stores ciphertext, so no one, not even the admin, can read another person's personal vault.",
  "One owner account wears three hats: an ordinary user, holder of the admin token that gates /admin, and sole owner of the organisation that holds every shared collection.",
  "Cross-user recovery of personal items is only possible through Bitwarden Emergency Access, granted voluntarily per person.",
  "Secrets hygiene: the admin token is stored as an Argon2 hash, and backups are encrypted to an age public key whose private key never touches the server.",
];

const backups = [
  "Layer 1: DigitalOcean droplet images for fast, whole-machine recovery.",
  "Layer 2: a daily systemd timer takes a consistent SQLite snapshot, compresses it with zstd, encrypts it to an age public key and ships it off-site with rclone, keeping 14 days locally.",
  "A backup that has never been restored is only an assumption, so a test restore is part of the deploy checklist.",
];

const decisions = [
  "No bundled reverse proxy: rather than run a second one, Vaultwarden joins the existing nginx network and publishes no host ports, so it is only reachable through the shared proxy.",
  "SQLite .backup instead of a raw copy, because a plain cp of a live database can be torn mid-write.",
  "Encrypt to a public key, so even a full host compromise cannot decrypt the off-site backup history.",
];

function SecretsVault() {
  return (
    <Box id="secrets-vault" sx={{ display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 } }}>
      <Reveal>
        <SectionHeading eyebrow="self-hosted">
          Secrets <GradientText>Vault</GradientText>
        </SectionHeading>
        <MarkdownBlock>
          {`A self-hosted password manager for the family: [Vaultwarden](https://github.com/dani-garcia/vaultwarden), the lightweight Rust reimplementation of the Bitwarden server, running on a single DigitalOcean droplet. Everyone gets their own login plus shared collections, reachable over HTTPS from the official Bitwarden desktop, mobile, browser and CLI clients. It is infrastructure-as-code, so the repository holds only templates and documentation, never real secrets.`}
        </MarkdownBlock>
        <Box sx={{ mt: 1 }}>
          <ExternalButton
            href={secretsVaultGithubLink}
            icon={<Avatar alt="github icon" src={githubLogo} sx={{ width: 24, height: 24 }} />}
          >
            Source
          </ExternalButton>
        </Box>
      </Reveal>

      <Reveal delay={0.06}>
        <Panel accent={ACCENT} wash>
          <StatRow
            items={[
              { value: "1", label: "droplet" },
              { value: "E2E", label: "encrypted vaults" },
              { value: "2", label: "backup layers" },
              { value: "0", label: "host ports exposed" },
            ]}
          />
        </Panel>
        <Callout accent={ACCENT} title="status">
          Running on a shared droplet behind the existing nginx and Cloudflare, with signups closed
          after setup.
        </Callout>
      </Reveal>

      <Reveal delay={0.12}>
        <SectionHeading eyebrow="architecture">How it is wired</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          TLS terminates at the existing nginx using a wildcard Cloudflare Origin certificate; the
          vault container joins that proxy's Docker network and is reached by name, with all
          persistent state on the droplet's main disk so it is covered by droplet backups.
        </Box>
        <Panel accent={ACCENT}>
          <MarkdownBlock>{vaultArchitecture}</MarkdownBlock>
        </Panel>
      </Reveal>

      <Reveal delay={0.18}>
        <SectionHeading eyebrow="security">Security model</SectionHeading>
        <CheckList items={security} accent={ACCENT} />
        <Box sx={{ mt: 2 }}>
          <Callout accent={ACCENT} title="templates only">
            No secrets, keys, tokens or domains are committed. Real values live in a git-ignored .env
            on the server, and the backup encryption private key never touches the server at all.
          </Callout>
        </Box>
      </Reveal>

      <Reveal delay={0.24}>
        <SectionHeading eyebrow="backups">Two independent backup layers</SectionHeading>
        <CheckList items={backups} accent={ACCENT} />
      </Reveal>

      <Reveal delay={0.3}>
        <SectionHeading eyebrow="decisions">Details worth calling out</SectionHeading>
        <CheckList items={decisions} accent={ACCENT} />
      </Reveal>
    </Box>
  );
}

const analyticsArchitecture = `\`\`\`text
Browser (moates.com.au, straight off GitHub Pages)
      |  sendBeacon, text/plain, fire and forget
      v
Cloudflare (proxied subdomain)      adds cf-ipcountry / cf-ipcity / cf-region
      |
      v
nginx --> moates-stats  (FastAPI container, POST /e answers 204)
                 |
                 v
          Postgres  (analytics database, host service on the droplet)
                 |
   /stats  <-- GET /summary (aggregates only, cached 60s) --'
\`\`\``;

const analyticsStored = [
  "No address is ever written down: the beacon's IP is turned into a salted hash the moment it arrives, and the salt rotates the hash daily so it cannot follow anyone from one day to the next.",
  "No cookie either. A session id lives in sessionStorage and disappears with the tab.",
  "Country and city come from Cloudflare's edge headers, so the location is known without me holding the address it came from.",
  "The read endpoint returns counts only: identifying columns appear solely inside a count of distinct values, and a test parses the module's own SQL to make sure that stays true.",
];

const analyticsDecisions = [
  "Beacons are sent as text/plain on purpose. A JSON beacon is preflighted, and a preflight fired while the page is unloading often never finishes.",
  "The collector must never affect the page, so the client side has a circuit breaker, a bounded queue and passive listeners, and nothing on the site ever waits on it.",
  "Elements opt in with a data-track attribute, and links to other hosts are recorded automatically. Nothing is measured by accident.",
  "The dashboard's charts are hand-rolled SVG rather than a charting library, which costs about seven kilobytes gzipped instead of a dependency.",
];

function SiteAnalytics() {
  return (
    <Box id="site-analytics" sx={{ display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 } }}>
      <Reveal>
        <SectionHeading eyebrow="self-hosted">
          Site <GradientText>Analytics</GradientText>
        </SectionHeading>
        <MarkdownBlock>
          {`GitHub Pages keeps no access logs, so this site measures itself. Every page beacons its own views and clicks to a small FastAPI service I run on the same droplet as everything else, which writes them to Postgres and reads them back as aggregates. It replaces a third party tracker with something I own end to end, and the numbers it produces are published rather than kept to myself.`}
        </MarkdownBlock>
        <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          <Button
            component={Link}
            to="/stats"
            variant="outlined"
            color="inherit"
            data-track="small-projects:stats"
            sx={{ borderColor: "divider", color: "text.secondary" }}
          >
            See the numbers
          </Button>
          <Button
            component="a"
            href={mcpServerGithubLink}
            target="_blank"
            rel="noopener"
            variant="outlined"
            color="inherit"
            startIcon={<Avatar alt="github icon" src={githubLogo} sx={{ width: 24, height: 24 }} />}
            endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
            sx={{ borderColor: "divider", color: "text.secondary" }}
          >
            Source
          </Button>
        </Box>
      </Reveal>

      <Reveal delay={0.06}>
        <Panel accent={ACCENT} wash>
          <StatRow
            items={[
              { value: "0", label: "third party trackers" },
              { value: "0", label: "cookies" },
              { value: "204", label: "answered before writing" },
              { value: "5", label: "range windows" },
            ]}
          />
        </Panel>
        <Callout accent={ACCENT} title="status">
          Collecting live since August 2026, with the public dashboard reading the same service.
        </Callout>
      </Reveal>

      <Reveal delay={0.12}>
        <SectionHeading eyebrow="architecture">How it is wired</SectionHeading>
        <Box sx={{ color: "text.secondary", mb: 2 }}>
          The site itself is served straight from GitHub Pages, which is why the collector sits on a
          proxied subdomain: Cloudflare is what supplies the visitor's country and city for free. The
          write path answers immediately and does the database work in the background, and the read
          path aggregates in Postgres, caches each window for a minute and rate limits per address.
        </Box>
        <Panel accent={ACCENT}>
          <MarkdownBlock>{analyticsArchitecture}</MarkdownBlock>
        </Panel>
      </Reveal>

      <Reveal delay={0.18}>
        <SectionHeading eyebrow="privacy">Measured, not tracked</SectionHeading>
        <CheckList items={analyticsStored} accent={ACCENT} />
      </Reveal>

      <Reveal delay={0.24}>
        <SectionHeading eyebrow="decisions">Details worth calling out</SectionHeading>
        <CheckList items={analyticsDecisions} accent={ACCENT} />
      </Reveal>
    </Box>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function SmallProjects() {
  return (
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
        eyebrow="collection"
        title={<>Small <GradientText>Projects</GradientText></>}
        subtitle="A running collection of smaller builds and self-hosted infrastructure, each too compact for a full case study, gathered here on one page. Use the links up top to jump to any of them."
      />

      <OnThisPage items={PROJECTS} />

      <SecretsVault />

      <SiteAnalytics />

      <PageNav left={{ text: "Projects", link: "/projects" }} />
    </Box>
  );
}
