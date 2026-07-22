import { ChipKey } from "./chipMap";
import imaxLogo from "../assets/imax_logo.jpeg";
import {
  gymJunkiePlayStoreLink,
  gymJunkieAppStoreLink,
  woodchuckPlayStoreLink,
  downerhelperLink,
  postgresDeployLink,
  cellularTrackingGithubLink,
  imaxBotGithubLink,
  mcpServerGithubLink,
} from "./links";

export type Project =
  | 'finska'
  | 'gym_junkie'
  | 'balderdash'
  | 'downer_helper'
  | 'cellular_tracking'
  | 'postgres_deploy'
  | 'imax_bot'
  | 'mcp_server';

export const iconMap: Record<Project, string> = {
  finska: '/finska-icon.png',
  gym_junkie: '/gym-junkie-icon.png',
  balderdash: '/poppycock-icon.png',
  downer_helper: '/pypi-logo.png',
  cellular_tracking: '/cells-logo.png',
  postgres_deploy: '/pypi-logo.png',
  imax_bot: imaxLogo,
  // No logo asset: the card/avatar falls back to the "M" initial.
  mcp_server: '',
};

export type ProjectStatus = 'prod' | 'test' | 'poc';

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
    status: 'poc',
    accent: '#d8aa78',
    external: [{ label: 'Source', href: mcpServerGithubLink, external: true }],
  },
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
    status: 'test',
    accent: '#d8aa78',
    external: [{ label: 'Source', href: imaxBotGithubLink, external: true }],
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
