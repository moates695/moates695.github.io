import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { githubLink, pypiLink, stravaLink, expoLink } from "../middleware/links";
import imaxLogo from "../assets/imax_logo.jpeg";
import pokerChips from "../assets/poker-chips.png";
import mcpIcon from "../assets/mcp-icon.png";
import wattsLogo from "../assets/watts-logo.svg";
import tradingStrategiesLogo from "../assets/trading-strategies-logo.svg";
import smallProjectsLogo from "../assets/small-projects-logo.svg";
import {
  SAND,
  SPACE,
  PLEX,
  SAND_MONO,
  SandCard,
  SandProject,
  SandLabel,
  ProjectIcon,
  StatusPill,
  TechChip,
  TechTag,
  Typewriter,
} from "../components/sand";

const linkedInLink = "https://www.linkedin.com/in/marcus-oates-52814a233/";
const discordLink = "https://discord.gg/uUd8hJNvzM";

/* ── Content ─────────────────────────────────────────────────────────── */

const featuredTags = ["FastAPI", "React Native", "PostgreSQL", "Python", "AWS"];

const moreProjects: SandProject[] = [
  {
    title: "IMAX Watch Agent",
    status: "PROD",
    blurb: "Watches Event Cinemas IMAX Sydney and pings you on Telegram the moment films or tickets go live.",
    tags: ["Python", "Telegram", "Automation"],
    icon: imaxLogo,
    initials: "IX",
    link: "/other/imax-bot",
  },
  {
    title: "Woodchuck",
    status: "TEST",
    blurb: "On-device scorer for the lawn game Finska. No sign-in, no backend, gloriously no tracking.",
    tags: ["React Native", "Expo", "TypeScript"],
    icon: "/finska-icon.png",
    initials: "W",
    link: "/woodchuck",
  },
  {
    title: "Watts",
    status: "TEST",
    blurb: "Structured cycling workouts in the browser, straight over Web Bluetooth. My fork of Auuki adds a dark, data-first redesign and a drag-to-build workout designer.",
    tags: ["JavaScript", "Web Bluetooth", "PWA"],
    icon: wattsLogo,
    initials: "W",
    link: "/other/smart-trainer",
  },
  {
    title: "Arbitrage Engine",
    status: "TEST",
    blurb: "Scans racing and sport odds across seven bookmakers and flags guaranteed-profit arbitrage, with a live board that refreshes every 15 minutes. Read-only, it never places a bet.",
    tags: ["Python", "Automation", "REST APIs"],
    icon: pokerChips,
    initials: "AB",
    link: "/other/arbitrage",
  },
  {
    title: "Trading Strategies",
    status: "POC",
    blurb: "A harness for learning trading strategies honestly: tune on the test set, check it on validation data as often as you like, then one single pass over held-back data for the real number. Sitting on 633 million minute bars.",
    tags: ["Python", "Parquet", "Pandas"],
    icon: tradingStrategiesLogo,
    initials: "TS",
    link: "/other/trading-strategies",
  },
  {
    title: "Authenticator",
    status: "POC",
    blurb: "A phone authenticator that groups codes into folders, the one thing Google Authenticator still will not do. Vault encrypted on device, one countdown for the lot.",
    tags: ["React Native", "Expo", "Cryptography"],
    initials: "AT",
    link: "/other/authenticator",
  },
  {
    title: "Poppycock",
    status: "POC",
    blurb: "Real-time companion app for the Balderdash card game, someone had to keep the liars honest.",
    tags: ["FastAPI", "WebSocket", "PostgreSQL"],
    icon: "/poppycock-icon.png",
    initials: "P",
    link: "/poppycock",
  },
  {
    title: "Marcus MCP Server",
    status: "PROD",
    blurb: "A public MCP server that lets Claude and OpenAI models answer questions about Marcus from real, structured data.",
    tags: ["Python", "MCP", "LLM"],
    icon: mcpIcon,
    initials: "M",
    link: "/other/mcp-server",
  },
  {
    title: "Small Projects",
    status: "COLLECTION",
    blurb: "A running collection of smaller builds and self-hosted infrastructure, gathered on one page. First up: a self-hosted password vault for the family.",
    tags: ["Docker", "Self-Hosted", "Backups"],
    icon: smallProjectsLogo,
    initials: "SP",
    link: "/small-projects",
  },
  {
    title: "Cellular Tracking",
    status: "PROD",
    blurb: "Computer-vision pipeline that segments and tracks dividing cells so researchers don't have to squint.",
    tags: ["Python", "OpenCV", "YOLOv8"],
    icon: "/cells-logo.png",
    initials: "CT",
    link: "/other/cellular-tracking",
  },
  {
    title: "Downer Helper",
    status: "PROD",
    blurb: "A tidy Python package that wraps the Azure SDK and cuts the copy-paste out of every project.",
    tags: ["Python", "Azure", "PyPI"],
    icon: "/pypi-logo.png",
    initials: "DH",
    link: "/other/downer-helper",
  },
  {
    title: "Postgres Deploy",
    status: "PROD",
    blurb: "Deploys and updates Postgres schemas straight from config files, so nobody hand-runs migrations.",
    tags: ["Python", "PostgreSQL", "CLI"],
    icon: "/pypi-logo.png",
    initials: "PD",
    link: "/other/postgres-deploy",
  },
];

const techStack = [
  "Python",
  "TypeScript",
  "FastAPI",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Azure",
  "AWS",
  "React Native",
  "MCP",
  "OpenAI API",
];

const socials = [
  { label: "GitHub", href: githubLink },
  { label: "LinkedIn", href: linkedInLink },
  { label: "PyPI", href: pypiLink },
  { label: "Strava", href: stravaLink },
  { label: "Expo", href: expoLink },
  { label: "Discord", href: discordLink },
];

/* Common horizontal section padding (48px on desktop, tighter on mobile). */
const SECTION_PX = { xs: "20px", sm: "32px", md: "48px" };

/* Fixed side-rail (desktop only). Content is inset to clear it. */
const RAIL_W = 60;

/* Sections tracked by the side rail, top to bottom. */
const SECTIONS = [
  { id: "s-hero", n: "01", label: "Intro" },
  { id: "projects", n: "02", label: "Featured" },
  { id: "s-work", n: "03", label: "Projects" },
  { id: "tech", n: "04", label: "Stack" },
];

/* ── Small building blocks ───────────────────────────────────────────── */

/** Gold text link with a trailing arrow, used for "VIEW ALL", "Get in touch". */
function GoldLink({
  children,
  onClick,
  href,
  size = 14,
  spaced = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  size?: number;
  spaced?: boolean;
}) {
  return (
    <Box
      component={href ? "a" : "button"}
      href={href}
      onClick={onClick}
      sx={{
        all: "unset",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        font: `500 ${size}px ${spaced ? SAND_MONO : PLEX}`,
        letterSpacing: spaced ? ".14em" : undefined,
        color: SAND.goldLight,
        transition: "color .2s ease",
        "&:hover": { color: SAND.goldHover },
      }}
    >
      {children}
      <Box component="span" aria-hidden>&#8594;</Box>
    </Box>
  );
}

/**
 * Persistent left rail (desktop only) that runs the full height of the page.
 * Tracks scroll: highlights the current section and lets the numbered nodes
 * jump to each section.
 */
function SideRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.4;
      let cur = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= mid) cur = i;
      });
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Snap to the last section once scrolled to the bottom (the final
      // section + footer can be shorter than the probe offset).
      if (max > 0 && window.scrollY >= max - 4) cur = SECTIONS.length - 1;
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box
      aria-hidden
      sx={{
        display: { xs: "none", md: "flex" },
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: `${RAIL_W}px`,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "88px 0 40px",
        zIndex: 4,
        pointerEvents: "none",
      }}
    >
      {/* Active section number */}
      <Box sx={{ font: `500 11px ${SAND_MONO}`, letterSpacing: ".1em", color: SAND.gold }}>
        {SECTIONS[active].n}
      </Box>

      {/* Numbered nodes */}
      <Box
        sx={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "34px",
          pointerEvents: "auto",
        }}
      >
        {SECTIONS.map((s, i) => {
          const on = i === active;
          const passed = i <= active;
          return (
            <Box
              component="button"
              key={s.id}
              onClick={() => go(s.id)}
              title={s.label}
              sx={{
                all: "unset",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Box
                sx={{
                  width: on ? "9px" : "6px",
                  height: on ? "9px" : "6px",
                  borderRadius: "50%",
                  background: passed ? SAND.gold : "transparent",
                  border: `1px solid ${passed ? SAND.gold : SAND.faint}`,
                  boxShadow: on ? `0 0 10px ${SAND.gold}` : "none",
                  transition: "all .2s",
                }}
              />
              <Box
                sx={{
                  font: `500 9px ${SAND_MONO}`,
                  letterSpacing: ".1em",
                  color: on ? SAND.gold : SAND.faint,
                  transition: "color .2s",
                }}
              >
                {s.n}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        flexShrink: 0,
        // Transparent so the fixed dune backdrop (SandBackground) shows through
        // and stays visible as the content scrolls over it.
        background: "transparent",
        color: SAND.primary,
        fontFamily: PLEX,
      }}
    >
      <SideRail />

      {/* ============ HERO ============ */}
      <Box
        component="header"
        id="s-hero"
        sx={{
          position: "relative",
          minHeight: { xs: "70vh", md: "82vh" },
          display: "flex",
          alignItems: "center",
          // The dune image itself lives in the fixed SandBackground layer so it
          // stays visible past the hero; here we only darken the left side for
          // heading legibility.
        }}
      >
        {/* Content block */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            padding: { xs: "0 24px", md: `0 48px 0 ${RAIL_W + 40}px` },
            maxWidth: 620,
          }}
        >
          <Box
            sx={{
              font: `500 12.5px ${SAND_MONO}`,
              letterSpacing: ".16em",
              color: SAND.gold,
              textTransform: "uppercase",
              mb: "14px",
            }}
          >
            <Box component="span" sx={{ opacity: 0.5 }}>{'// your '}</Box>
            <Typewriter />
          </Box>

          <Typography
            component="h1"
            sx={{
              m: 0,
              fontFamily: SPACE,
              fontWeight: 600,
              fontSize: { xs: "3rem", sm: "4rem", md: "76px" },
              lineHeight: 0.98,
              letterSpacing: "-.03em",
              color: SAND.primary,
            }}
          >
            Marcus
            <br />
            <Box component="span" sx={{ color: SAND.gold }}>Oates.</Box>
          </Typography>

          <Typography
            component="p"
            sx={{
              m: "20px 0 0",
              maxWidth: 440,
              font: `400 16.5px/1.65 ${PLEX}`,
              color: SAND.heroBody,
              textWrap: "pretty",
            }}
          >
            Full stack engineer specialising in automation using AI & ML processes. 
            I deliver scalable solutions for stakeholders, using agentic workflows
            to accelerate development.
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "22px", mt: "38px" }}>
            <Box
              component="button"
              onClick={() => navigate("/projects")}
              sx={{
                all: "unset",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                font: `500 14px ${PLEX}`,
                color: SAND.bg,
                background: SAND.gold,
                borderRadius: "9px",
                padding: "13px 24px",
                transition: "background .2s ease",
                "&:hover": { background: SAND.goldHover },
              }}
            >
              View all projects <Box component="span" aria-hidden>&#8594;</Box>
            </Box>
            <Box
              component="button"
              onClick={() => navigate("/about")}
              sx={{
                all: "unset",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                font: `500 14px ${PLEX}`,
                color: SAND.primary,
                "&:hover": { color: SAND.goldLight },
              }}
            >
              About me <Box component="span" aria-hidden sx={{ color: SAND.gold }}>&#9673;</Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ============ FEATURED ============ */}
      <Box component="section" id="projects" sx={{ padding: SECTION_PX, pt: "20px", pl: { md: `${RAIL_W + 40}px` } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "18px" }}>
          <SandLabel>{'// FEATURED PROJECT'}</SandLabel>
          <GoldLink spaced size={12} onClick={() => navigate("/projects")}>
            VIEW ALL
          </GoldLink>
        </Box>

        <Box
          onClick={() => navigate("/gym-junkie")}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/gym-junkie");
            }
          }}
          sx={{
            border: `1px solid ${SAND.goldBorder}`,
            borderRadius: "16px",
            background: `linear-gradient(160deg, ${SAND.featuredFrom}, ${SAND.featuredTo})`,
            padding: { xs: "24px", md: "40px" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: "28px", md: "48px" },
            alignItems: "center",
            cursor: "pointer",
            outline: "none",
            transition: "border-color .2s ease, transform .2s ease",
            "&:hover, &:focus-visible": {
              borderColor: "rgba(216,170,120,.5)",
              transform: "translateY(-3px)",
            },
          }}
        >
          {/* Left column */}
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Box
                component="span"
                sx={{ font: `500 10.5px ${SAND_MONO}`, letterSpacing: ".2em", color: SAND.cool }}
              >
                FEATURED PROJECT
              </Box>
              <StatusPill status="PROD" />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <ProjectIcon icon="/gym-junkie-icon.png" initials="GJ" size={48} />
              <Typography
                component="h2"
                sx={{
                  m: 0,
                  fontFamily: SPACE,
                  fontWeight: 600,
                  fontSize: { xs: "2.25rem", md: "44px" },
                  color: SAND.primary,
                  letterSpacing: "-.02em",
                }}
              >
                Gym Junkie
              </Typography>
            </Box>

            <Typography
              component="p"
              sx={{ m: 0, maxWidth: 470, font: `400 15px/1.6 ${PLEX}`, color: SAND.body, textWrap: "pretty" }}
            >
              A fitness app built the backend-engineer way: fast set logging over a FastAPI + Postgres
              core, analytics, progressive-overload graphs, and an ML layer doing the quiet heavy
              lifting. React Native up front, no subscription in sight.
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px", mt: "2px" }}>
              {featuredTags.map((t) => (
                <TechTag key={t} name={t} />
              ))}
            </Box>

            <Box sx={{ mt: "8px" }}>
              <GoldLink onClick={() => navigate("/gym-junkie")}>View case study</GoldLink>
            </Box>
          </Box>

          {/* Right column: two real product shots side by side (full, uncropped) */}
          <Box sx={{ flex: "none", maxWidth: "100%", display: "flex", gap: { xs: "12px", md: "16px" } }}>
            {[
              { src: "/gym_junkie_ios/home_screen.png", alt: "Gym Junkie home screen" },
              {
                src: "/gym_junkie_ios/workout_exercise_history_graph.png",
                alt: "Gym Junkie exercise history graph",
              },
            ].map((shot) => (
              <Box
                key={shot.src}
                sx={{
                  flex: "none",
                  width: { xs: 140, sm: 155, md: 168 },
                  maxWidth: "100%",
                  borderRadius: "26px",
                  border: "1px solid rgba(216,170,120,.25)",
                  overflow: "hidden",
                  background: SAND.surface,
                }}
              >
                <Box
                  component="img"
                  src={shot.src}
                  alt={shot.alt}
                  loading="lazy"
                  sx={{ width: "100%", height: "auto", display: "block" }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ============ MORE PROJECTS ============ */}
      <Box component="section" id="s-work" sx={{ padding: SECTION_PX, pt: "40px", pl: { md: `${RAIL_W + 40}px` } }}>
        <SandLabel sx={{ display: "block", mb: "18px" }}>{'// MORE PROJECTS'}</SandLabel>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {moreProjects.map((p) => (
            <SandCard key={p.title} project={p} />
          ))}
        </Box>
      </Box>

      {/* ============ TECH STACK ============ */}
      <Box component="section" id="tech" sx={{ padding: SECTION_PX, pt: "52px", pl: { md: `${RAIL_W + 40}px` } }}>
        <SandLabel sx={{ display: "block", mb: "18px" }}>{'// TECH STACK'}</SandLabel>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {techStack.map((t) => (
            <TechChip key={t} name={t} />
          ))}
        </Box>
      </Box>

      {/* ============ FOOTER ============ */}
      <Box
        component="footer"
        id="contact"
        sx={{
          mt: "64px",
          borderTop: `1px solid ${SAND.hairlineSoft}`,
          padding: { xs: "32px 20px 28px", sm: "40px 32px 32px", md: "48px 48px 40px" },
          pl: { md: `${RAIL_W + 40}px` },
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "48px", justifyContent: "space-between" }}>
          <Box sx={{ maxWidth: 300 }}>
            <FooterLabel>PHILOSOPHY</FooterLabel>
            <Typography component="p" sx={{ m: 0, font: `400 14px/1.6 ${PLEX}`, color: SAND.body, textWrap: "pretty" }}>
              Build systems that are reliable, observable and easy to evolve. Solve real problems
              through clean abstractions and a focus on long-term maintainability.
            </Typography>
          </Box>
          <Box>
            <FooterLabel>BASED IN</FooterLabel>
            <Typography component="p" sx={{ m: 0, font: `500 15px ${SPACE}`, color: SAND.primary }}>
              Sydney, Australia
            </Typography>
          </Box>
          <Box sx={{ maxWidth: 280 }}>
            <FooterLabel>LET'S BUILD SOMETHING</FooterLabel>
            <Typography component="p" sx={{ m: "0 0 14px", font: `400 14px/1.6 ${PLEX}`, color: SAND.body }}>
              Open to interesting projects and ambitious ideas.
            </Typography>
            <GoldLink onClick={() => navigate("/contact")}>Get in touch</GoldLink>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            mt: "44px",
            pt: "22px",
            borderTop: `1px solid ${SAND.hairline}`,
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {socials.map((s) => (
              <Box
                key={s.label}
                component="a"
                href={s.href}
                target="_blank"
                rel="noopener"
                sx={{
                  font: `500 11px ${SAND_MONO}`,
                  color: SAND.body,
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: "7px",
                  padding: "8px 12px",
                  textDecoration: "none",
                  transition: "color .2s ease, border-color .2s ease",
                  "&:hover": { color: SAND.primary, borderColor: "rgba(255,255,255,.25)" },
                }}
              >
                {s.label}
              </Box>
            ))}
          </Box>
          <Box sx={{ font: `500 10px ${SAND_MONO}`, letterSpacing: ".16em", color: SAND.faintest }}>
            &copy; 2026 MARCUS OATES
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function FooterLabel({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{ font: `500 11px ${SAND_MONO}`, letterSpacing: ".2em", color: SAND.faint, mb: "12px" }}
    >
      {children}
    </Box>
  );
}
