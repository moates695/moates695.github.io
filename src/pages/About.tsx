import { useState, type ReactElement } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Link,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import TerrainIcon from '@mui/icons-material/Terrain';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsIcon from '@mui/icons-material/Sports';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import { useNavigate } from 'react-router-dom';
import PageLinks from "../components/PageLinks";
import { buildBulletPoints } from "../middleware/helpers";
import { MONO } from "../styles/tokens";
import { GradientText } from "../components/design";
import { SectionNavLayout, Section } from "../components/SectionNav";

const SECTIONS: Section[] = [
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills & tools" },
  { id: "beyond-work", label: "Beyond work" },
];

interface Experience {
  role: string
  company: string
  companyHref?: string
  dates: string
  current?: boolean
  summary: string
  highlights: string[]
}

const EXPERIENCE: Experience[] = [
  {
    role: 'Senior Software Engineer, AI & Backend',
    company: 'Voxworks',
    companyHref: 'https://voxworks.ai/',
    dates: 'Jan 2026 to present',
    current: true,
    summary:
      'First employee at a voice AI startup, leading a ground-up restructure of the core voice ' +
      'agent backend and scaling call concurrency by 400%.',
    highlights: [
      'As the startup’s first employee, took operational control of the voice agent’s backend architecture and led a ground-up restructure of the codebase, the company’s core product, owning its reliability and ongoing development in production',
      'Developed agentic AI development workflows and custom Model Context Protocol (MCP) tooling that dramatically accelerated development and enabled rapid prototyping, under heavy human oversight with disciplined review to keep code quality high',
      'Rebuilt the core conversation logic while maintaining interoperability with the existing live system, so clients continued to be served without interruption',
      'Extended reliable call handling from ~2-minute calls to consistently sustaining 10 to 20 minute conversations that stay on script and complete their objectives',
      'Increased call concurrency by 400% through system optimisations, managing concurrency and cost-effectiveness across the pipeline to balance throughput against infrastructure spend',
      'Architected the agent’s conversational dynamics for a ~10% improvement in average response latency, prioritising accuracy so the agent does not stray from its call objectives',
      'Built automated testing for the voice system, from unit and integration tests to concurrent automated call runs, using AI agents to analyse call dynamics and debug conversational issues across a large sample space',
      'Established automated CI/CD deployment pipelines with real-time observability and monitoring in Grafana, giving instant visibility into call performance and system health',
      'Converted the voice agent to a chat agent while maintaining the core integrations, primarily used for client testing',
    ],
  },
  {
    role: 'Automation Software Engineer',
    company: 'Downer Group',
    dates: 'May 2023 to Dec 2025',
    summary:
      'Designed and shipped automation across cloud and on-prem systems, turning manual workflows ' +
      'into monitored, cost-efficient services.',
    highlights: [
      'Automated data extraction from spreadsheets using Azure Function Apps, stored in a database with a Power BI connection, saving ~$175k a year per business-unit implementation and eliminating manual transcription errors',
      'Created a custom internal Azure dashboard for monitoring project resources across subscriptions, with resource actions and deployment monitoring',
      'Reduced operating costs of Azure resources by ~60% by scheduling startup and shutdown events through a centralised tagging policy enacted via the dashboard',
      'Automated Konect API queries for critical field work, notifying the requisite authorities to consistently meet SLAs and avoid total penalties of ~$450k',
      'Enhanced security through daily storage account key rotation and SAS generation via Azure Key Vault, reducing 80–100 points of failure to a single centralised point',
      'Extracted text with OCR from CAD drawing PDFs and generated project report spreadsheets, a time saving of ~95%',
      'Wrote project setup shell scripts that deploy environments and resources in Azure, linked to custom GitHub branch environments with rules and protections to enable consistent IaC deployments using Bicep',
      'Implemented bespoke deep learning and computer vision solutions for real-time artefact recognition with ~94% accuracy',
    ],
  },
  {
    role: 'Engineering Intern',
    company: 'Incat Crowther',
    dates: 'Feb 2023 to May 2023',
    summary:
      'Produced technical drawings for double-hull commercial vessels (30–120 ft) with AutoCAD LT.',
    highlights: [
      'Produced accurate technical drawings with AutoCAD LT, focusing on double-hull commercial vessels of 30–120 ft',
      'Created and modified technical frame and construction drawings for 3 vessels',
      'Complied with relevant classing authorities’ engineering standards so vessels were safe under varying oceanic conditions',
      'Produced precise cut-part, engine/rudder modification and machinery arrangement drawings within a dynamic environment',
    ],
  },
];

const SKILLS: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C', 'C++', 'SQL', 'PL/pgSQL', 'MATLAB'] },
  { group: 'Frontend', items: ['React', 'React Native', 'Expo', 'Jotai', 'MUI'] },
  { group: 'Backend', items: ['Node / Express', 'FastAPI', 'WebSockets', 'REST APIs'] },
  { group: 'Data', items: ['Postgres', 'Redis', 'PowerBI', 'Data analytics'] },
  { group: 'Azure', items: ['Function Apps', 'Container Registry', 'Container Instances', 'Managed Identity', 'Key Vault', 'Storage Accounts', 'Event Grid', 'Logic Apps'] },
  { group: 'AWS', items: ['ECS', 'Lambda', 'RDS Postgres', 'ElastiCache (Redis)', 'Secrets Manager', 'NLB', 'CloudFormation'] },
  { group: 'DevOps', items: ['Bicep (IaC)', 'GitHub Actions', 'Docker', 'Cloudflare', 'az / aws CLI'] },
  { group: 'AI / LLMs', items: ['Voice agents', 'LLM fine-tuning', 'Prompt engineering', 'MCP tooling', 'RAG', 'LLM evals'] },
  { group: 'AI coding agents', items: ['Claude Code', 'Codex', 'OpenCode'] },
  { group: 'AI / ML', items: ['Deep learning', 'Computer vision', 'OCR', 'Applied ML'] },
];

const INTERESTS: { label: string; icon: ReactElement }[] = [
  { label: 'Strength training', icon: <FitnessCenterIcon sx={{ fontSize: 18 }} /> },
  { label: 'Ironman training', icon: <DirectionsRunIcon sx={{ fontSize: 18 }} /> },
  { label: 'Bouldering', icon: <TerrainIcon sx={{ fontSize: 18 }} /> },
  { label: 'Mountain biking', icon: <DirectionsBikeIcon sx={{ fontSize: 18 }} /> },
  { label: 'Tennis', icon: <SportsTennisIcon sx={{ fontSize: 18 }} /> },
  { label: 'Ultimate frisbee', icon: <SportsIcon sx={{ fontSize: 18 }} /> },
  { label: 'Soccer', icon: <SportsSoccerIcon sx={{ fontSize: 18 }} /> },
  { label: 'Time outdoors', icon: <ParkOutlinedIcon sx={{ fontSize: 18 }} /> },
];

function ExperienceEntry({ exp, last }: { exp: Experience; last: boolean }) {
  const [open, setOpen] = useState(false);
  const PREVIEW = 4;
  const hasMore = exp.highlights.length > PREVIEW;
  const shown = open ? exp.highlights : exp.highlights.slice(0, PREVIEW);

  return (
    <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2.5 } }}>
      {/* rail */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.5 }}>
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            flexShrink: 0,
            border: '2px solid',
            borderColor: exp.current ? 'secondary.main' : 'primary.main',
            bgcolor: exp.current ? 'secondary.main' : 'transparent',
            boxShadow: exp.current ? (theme) => `0 0 10px ${theme.palette.secondary.main}` : 'none',
          }}
        />
        {!last && <Box sx={{ flexGrow: 1, width: 2, bgcolor: 'divider', mt: 0.5 }} />}
      </Box>

      {/* content */}
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          p: { xs: 2, sm: 2.5 },
          mb: last ? 0 : 3,
          borderRadius: 3,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {exp.role}
          </Typography>
          <Typography sx={{ fontFamily: MONO, fontSize: 12, color: 'text.disabled', whiteSpace: 'nowrap' }}>
            {exp.dates}
          </Typography>
        </Box>

        {exp.companyHref ? (
          <Link
            href={exp.companyHref}
            target="_blank"
            rel="noopener"
            underline="hover"
            sx={{ fontWeight: 600, color: 'primary.main' }}
          >
            {exp.company}
          </Link>
        ) : (
          <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>{exp.company}</Typography>
        )}

        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          {exp.summary}
        </Typography>

        {exp.highlights.length > 0 && (
          <>
            {buildBulletPoints(shown)}
            {hasMore && (
              <Button
                size="small"
                onClick={() => setOpen((v) => !v)}
                endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ mt: 0.5, color: 'text.secondary', fontWeight: 600 }}
              >
                {open ? 'Show less' : `Show ${exp.highlights.length - PREVIEW} more`}
              </Button>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}

const CONTACT_EMAIL = "marcus@moates.com.au";

export default function About() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable; the mailto link still works */
    }
  };

  return (
    <SectionNavLayout sections={SECTIONS}>
    <Box
      component="section"
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3, pb: 4 }}
    >
      <PageLinks />

      {/* Header */}
      <Box className="reveal">
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Marcus <GradientText>Oates</GradientText>
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 0.5, fontWeight: 400 }}>
          Senior Software Engineer, AI &amp; Backend. Building voice AI and the backend systems
          behind it, plus the apps, services and data around them.
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1.5, color: 'text.secondary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <PlaceOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">Sydney, Australia</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <Link
              href={`mailto:${CONTACT_EMAIL}`}
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}
            >
              <EmailOutlinedIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">{CONTACT_EMAIL}</Typography>
            </Link>
            <Tooltip title={copied ? "Copied!" : "Copy email"}>
              <IconButton
                onClick={handleCopyEmail}
                size="small"
                aria-label="Copy email address"
                sx={{ color: 'text.secondary', p: 0.5 }}
              >
                {copied
                  ? <CheckIcon sx={{ fontSize: 16 }} />
                  : <ContentCopyIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            href="marcus_oates_resume.pdf"
            download
            sx={{ fontWeight: 700 }}
          >
            Download PDF
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate('/contact')}
            sx={{ borderColor: 'divider', color: 'text.secondary' }}
          >
            Get in touch
          </Button>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      {/* Experience */}
      <Box id="experience" className="reveal" sx={{ animationDelay: '0.06s' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2.5 }}>
          Experience
        </Typography>
        {EXPERIENCE.map((exp, i) => (
          <ExperienceEntry key={exp.company} exp={exp} last={i === EXPERIENCE.length - 1} />
        ))}
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      {/* Skills */}
      <Box id="skills" className="reveal" sx={{ animationDelay: '0.12s' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Skills &amp; tools
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          }}
        >
          {SKILLS.map(({ group, items }) => (
            <Box key={group}>
              <Typography
                sx={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'primary.main', mb: 1 }}
              >
                {group}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {items.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: 'divider', color: 'text.secondary', fontWeight: 500 }}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      {/* Beyond work */}
      <Box id="beyond-work" className="reveal" sx={{ animationDelay: '0.18s' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Beyond work
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, maxWidth: 620 }}>
          Away from the keyboard I stay active and spend as much time outdoors as I can. I train
          regularly at the gym and am currently working towards an Ironman, and I like the mix of
          endurance and team sport, from bouldering and mountain biking with friends to tennis,
          ultimate frisbee and soccer. The same drive that keeps me chasing a hard problem at work
          is what keeps me chasing the next goal outside it.
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {INTERESTS.map(({ label, icon }) => (
            <Chip
              key={label}
              icon={icon}
              label={label}
              variant="outlined"
              sx={{
                borderColor: 'divider',
                color: 'text.secondary',
                fontWeight: 500,
                '& .MuiChip-icon': { color: 'primary.main' },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
    </SectionNavLayout>
  );
}
