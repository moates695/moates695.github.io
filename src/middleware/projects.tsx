import { ChipKey } from "./chipMap";
import imaxLogo from "../assets/imax_logo.jpeg";
import pokerChips from "../assets/poker-chips.png";
import mcpIcon from "../assets/mcp-icon.png";
import wattsLogo from "../assets/watts-logo.svg";
import tradingStrategiesLogo from "../assets/trading-strategies-logo.svg";
import datePickerLogo from "../assets/date-picker-logo.svg";
import smallProjectsLogo from "../assets/small-projects-logo.svg";
import {
  gymJunkiePlayStoreLink,
  gymJunkieAppStoreLink,
  woodchuckPlayStoreLink,
  downerhelperLink,
  postgresDeployLink,
  cellularTrackingGithubLink,
  imaxBotGithubLink,
  mcpServerGithubLink,
  smartTrainerGithubLink,
  authenticatorGithubLink,
  datePickerGithubLink,
  datePickerDemoLink,
} from "./links";

export type Project =
  | 'finska'
  | 'gym_junkie'
  | 'balderdash'
  | 'downer_helper'
  | 'cellular_tracking'
  | 'postgres_deploy'
  | 'imax_bot'
  | 'mcp_server'
  | 'smart_trainer'
  | 'arbitrage'
  | 'trading_strategies'
  | 'authenticator'
  | 'date_picker'
  | 'small_projects';

export const iconMap: Record<Project, string> = {
  finska: '/finska-icon.png',
  gym_junkie: '/gym-junkie-icon.png',
  balderdash: '/poppycock-icon.png',
  downer_helper: '/pypi-logo.png',
  cellular_tracking: '/cells-logo.png',
  postgres_deploy: '/pypi-logo.png',
  imax_bot: imaxLogo,
  mcp_server: mcpIcon,
  smart_trainer: wattsLogo,
  arbitrage: pokerChips,
  trading_strategies: tradingStrategiesLogo,
  date_picker: datePickerLogo,
  small_projects: smallProjectsLogo,
  // No logo asset yet: this card/avatar falls back to its initials.
  authenticator: '',
};

export type ProjectStatus = 'prod' | 'test' | 'poc' | 'collection';

interface StatusMeta {
  label: string
  full: string
  /** Base colour used for the badge dot/text/border (works on light + dark). */
  color: string
}

export const statusMeta: Record<ProjectStatus, StatusMeta> = {
  prod: { label: 'prod', full: 'In production', color: '#6fcf97' },
  test: { label: 'test', full: 'In testing', color: '#e0b24d' },
  poc: { label: 'poc', full: 'Proof of concept', color: '#b18cf0' },
  collection: { label: 'collection', full: 'A collection of smaller projects', color: '#8fd0d4' },
};

export interface ProjectLink {
  label: string
  href: string
  external?: boolean
}

export interface ProjectInfo {
  key: Project
  icon: string
  /** Fallback shown when the icon image is missing. */
  initials: string
  name: string
  /** Short one-liner for cards. */
  blurb: string
  /** Longer description for the projects page. */
  description: string
  /** Internal route to the project's page. */
  link: string
  chipKeys: ChipKey[]
  status: ProjectStatus
  highlight?: string
  /** Accent colour used for the card glow / hover. */
  accent: string
  /** Whether the name is rendered in the secondary (Gym Junkie) colour. */
  featureName?: boolean
  /** External links (stores, package registries, source). */
  external?: ProjectLink[]
}

export const gymJunkie: ProjectInfo = {
  key: 'gym_junkie',
  icon: iconMap.gym_junkie,
  initials: 'GJ',
  name: 'Gym Junkie',
  blurb: 'A free gym workout tracker with deep analytics, graphing and leaderboards.',
  description:
    'A free fitness app built by a backend engineer around data. Log sets fast, then dig into ' +
    'analytics, progressive-overload graphs, muscle heatmaps and leaderboards, with no subscription, ' +
    'no fluff. React Native front end, Express + Python services, Postgres and an ML layer behind it.',
  link: '/gym-junkie',
  chipKeys: ['full_stack', 'react_ts', 'express', 'python', 'postgres', 'ai_ml'],
  status: 'prod',
  highlight: '/gym-junkie-highlight.png',
  accent: '#d8aa78',
  featureName: true,
  external: [
    { label: 'Play Store', href: gymJunkiePlayStoreLink, external: true },
    { label: 'App Store', href: gymJunkieAppStoreLink, external: true },
  ],
};

/** Everything except the featured Gym Junkie, in homepage/projects order. */
export const otherProjects: ProjectInfo[] = [
  {
    key: 'imax_bot',
    icon: iconMap.imax_bot,
    initials: 'IX',
    name: 'IMAX Watch Agent',
    blurb: 'Watches Event Cinemas IMAX Sydney and pings you on Telegram the moment films or tickets appear.',
    description:
      'A Python agent that scans Event Cinemas IMAX Sydney on a schedule and alerts you on Telegram when ' +
      'films appear, tickets open, or a watchlisted title becomes bookable, with a per-session seat ' +
      'breakdown and a daily digest. State lives in a local file so each alert fires once and never ' +
      'repeats; deployed as a plain cron job.',
    link: '/other/imax-bot',
    chipKeys: ['python', 'telegram', 'automation'],
    status: 'prod',
    accent: '#d8aa78',
    external: [{ label: 'Source', href: imaxBotGithubLink, external: true }],
  },
  {
    key: 'finska',
    icon: iconMap.finska,
    initials: 'W',
    name: 'Woodchuck',
    blurb: 'On-device scorer for the lawn game Finska (Mölkky). No sign in, no backend, no tracking.',
    description:
      'A fully client-side mobile scorer for the lawn game Finska (Mölkky). Download and go, with no sign ' +
      'in, no backend, no tracking. Handles teams, rotating throws, mid-game swaps and rule ' +
      'customisation, with save-and-continue snapshots.',
    link: '/woodchuck',
    chipKeys: ['client_side', 'expo', 'react_ts'],
    status: 'test',
    highlight: '/finska-highlight.png',
    accent: '#d8aa78',
    external: [{ label: 'Play Store', href: woodchuckPlayStoreLink, external: true }],
  },
  {
    key: 'smart_trainer',
    icon: iconMap.smart_trainer,
    initials: 'W',
    name: 'Watts',
    blurb: 'A browser-based app for structured cycling workouts on a smart trainer. My fork adds a drag-to-build workout designer.',
    description:
      'A browser-based app for running structured cycling workouts on a smart trainer, talking to the ' +
      'hardware directly over Web Bluetooth and recording standard .FIT activities. Built on the ' +
      'open-source Auuki project; my fork adds a graphical workout designer so you can build a session ' +
      'by dragging blocks instead of hand-writing ZWO XML. Vanilla JavaScript Web Components, no framework.',
    link: '/other/smart-trainer',
    chipKeys: ['javascript', 'bluetooth', 'pwa', 'client_side'],
    status: 'test',
    accent: '#d8aa78',
    external: [{ label: 'Source', href: smartTrainerGithubLink, external: true }],
  },
  {
    key: 'arbitrage',
    icon: iconMap.arbitrage,
    initials: 'AB',
    name: 'Arbitrage Engine',
    blurb: 'Scans racing and sport odds across bookmakers and flags guaranteed-profit arbitrage. Read-only, never places a bet.',
    description:
      'A read-only engine that scans racing and sport odds across seven Australian bookmakers and flags ' +
      'arbitrage: cases where backing every outcome at the best available price locks in a profit whatever ' +
      'the result. It reads each bookmaker\'s own JSON feed directly, reconciles runners across books, then ' +
      'runs the arbitrage maths. A hosted copy sweeps every 15 minutes and publishes the live board on its ' +
      'project page. It finds the opportunity and outputs what to bet where; it never places a bet.',
    link: '/other/arbitrage',
    chipKeys: ['python', 'automation', 'fastapi', 'docker'],
    status: 'test',
    accent: '#d8aa78',
  },
  {
    key: 'trading_strategies',
    icon: iconMap.trading_strategies,
    initials: 'TS',
    name: 'Trading Strategies',
    blurb: 'A harness for learning and testing trading strategies across a three phase test, validate and run split.',
    description:
      'A proof of concept for learning and testing trading strategies without fooling myself. Every idea ' +
      'moves through three phases over three separate datasets: tuned freely on the test set, then checked ' +
      'as many times as needed against validation data the tuning never saw, and finally given a single ' +
      'pass over a held-back run set, which is the only honest measure of how effective it would have ' +
      'been. The data foundation is built: a point-in-time S&P 500 universe and 633 million ' +
      '1-minute bars off the SIP consolidated tape, stored as compressed Parquet. The strategy engine is next.',
    link: '/other/trading-strategies',
    chipKeys: ['python', 'data_pipeline', 'automation'],
    status: 'poc',
    accent: '#d8aa78',
  },
  {
    key: 'authenticator',
    icon: iconMap.authenticator,
    initials: 'AT',
    name: 'Authenticator',
    blurb: 'A TOTP and HOTP authenticator that groups codes into folders, which the mainstream apps still will not do.',
    description:
      'A mobile authenticator built because Google Authenticator will not let you group codes into folders. ' +
      'Codes are generated on device from a locally encrypted vault, with one shared countdown at the top of ' +
      'the screen and nothing leaving the phone. Expo and React Native, with a zero-knowledge encrypted ' +
      'backup and sync service built server side and the client half still to come.',
    link: '/other/authenticator',
    chipKeys: ['expo', 'react_ts', 'client_side'],
    status: 'poc',
    accent: '#d8aa78',
    external: [{ label: 'Source', href: authenticatorGithubLink, external: true }],
  },
  {
    key: 'date_picker',
    icon: iconMap.date_picker,
    initials: 'DP',
    name: 'Date Picker',
    blurb: 'A fun little alternative to plain texting: a personalised one-page picker for asking someone to choose between options.',
    description:
      'A more fun way to ask someone out than a wall of text. Rather than sending a nested list of options ' +
      'and waiting for a reply of "b, then ii", you send a link to a one-page picker built for them, with ' +
      'its own wording and animation. Replies land in Postgres and ping Telegram. Each person ' +
      'gets their own page bundle behind an opaque token, and because the server stores answers verbatim as ' +
      'JSONB and never interprets them, a new page with its own layout and interactions needs no server ' +
      'change. There is a public demo page you can answer yourself. FastAPI and Postgres in a container ' +
      'on a DigitalOcean droplet.',
    link: '/other/date-picker',
    chipKeys: ['python', 'fastapi', 'postgres', 'telegram', 'docker'],
    status: 'poc',
    accent: '#d8aa78',
    external: [
      { label: 'Try it', href: datePickerDemoLink, external: true },
      { label: 'Source', href: datePickerGithubLink, external: true },
    ],
  },
  {
    key: 'balderdash',
    icon: iconMap.balderdash,
    initials: 'P',
    name: 'Poppycock',
    blurb: 'Real-time companion app for the physical Balderdash card game.',
    description:
      'A real-time companion for the physical Balderdash card game. Host a room to run bluffs, voting ' +
      'and scoring while you play with the cards. Full-stack with FastAPI, WebSockets and Postgres.',
    link: '/poppycock',
    chipKeys: ['full_stack', 'expo', 'react_ts', 'python', 'fastapi', 'websocket', 'postgres'],
    status: 'poc',
    accent: '#d8aa78',
  },
  {
    key: 'mcp_server',
    icon: iconMap.mcp_server,
    initials: 'M',
    name: 'Marcus MCP Server',
    blurb: 'A public MCP server that lets Claude and OpenAI models answer questions about Marcus from structured, accurate data.',
    description:
      'A Model Context Protocol server that exposes my resume, projects and experience as structured ' +
      'tools. Any MCP client, such as Claude Code, Claude Desktop or an OpenAI agent, connects over ' +
      'Streamable HTTP and answers from real data instead of guessing. Built with Python and the MCP ' +
      'SDK, deployed as a Docker container behind nginx on a DigitalOcean droplet.',
    link: '/other/mcp-server',
    chipKeys: ['python', 'mcp', 'llm'],
    status: 'prod',
    accent: '#d8aa78',
    external: [{ label: 'Source', href: mcpServerGithubLink, external: true }],
  },
  {
    key: 'small_projects',
    icon: iconMap.small_projects,
    initials: 'SP',
    name: 'Small Projects',
    blurb: 'A collection of smaller builds and self-hosted infrastructure, gathered on one page.',
    description:
      'A running collection of the smaller builds that are too compact for a case study of their own, ' +
      'gathered on a single page with quick links to each. First up is Secrets Vault: a self-hosted ' +
      'Vaultwarden password manager for the family, running on a DigitalOcean droplet with shared ' +
      'collections and encrypted off-site backups.',
    link: '/small-projects',
    chipKeys: ['docker', 'self_hosted'],
    status: 'collection',
    accent: '#d8aa78',
  },
  {
    key: 'cellular_tracking',
    icon: iconMap.cellular_tracking,
    initials: 'CT',
    name: 'Cellular Tracking',
    blurb: 'Computer-vision pipeline for segmenting, tracking and analysing cell division.',
    description:
      'A computer-vision project for segmenting cells, tracking their paths across frames and ' +
      'identifying divisions. Combines classical image analysis with deep learning.',
    link: '/other/cellular-tracking',
    chipKeys: ['ai_ml', 'python'],
    status: 'prod',
    accent: '#d8aa78',
    external: [{ label: 'Source', href: cellularTrackingGithubLink, external: true }],
  },
  {
    key: 'downer_helper',
    icon: iconMap.downer_helper,
    initials: 'DH',
    name: 'Downer Helper',
    blurb: 'A PyPI package that wraps the Azure SDK to cut code repetition across projects.',
    description:
      'A published PyPI package wrapping common Azure SDK commands to reduce code replication and ' +
      'technical debt across projects. Deployed straight from GitHub and available for anyone to use.',
    link: '/other/downer-helper',
    chipKeys: ['python', 'package'],
    status: 'prod',
    accent: '#d8aa78',
    external: [{ label: 'PyPI', href: downerhelperLink, external: true }],
  },
  {
    key: 'postgres_deploy',
    icon: iconMap.postgres_deploy,
    initials: 'PD',
    name: 'Postgres Deploy',
    blurb: 'A PyPI package that deploys and updates Postgres schemas from config files.',
    description:
      'A published PyPI package that deploys and updates Postgres schemas from a set of configuration ' +
      'files, making it easy to keep different database environments consistent.',
    link: '/other/postgres-deploy',
    chipKeys: ['python', 'package'],
    status: 'prod',
    accent: '#d8aa78',
    external: [{ label: 'PyPI', href: postgresDeployLink, external: true }],
  },
];

/** All projects, Gym Junkie first. */
export const allProjects: ProjectInfo[] = [gymJunkie, ...otherProjects];
