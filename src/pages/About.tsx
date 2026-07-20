import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { useNavigate } from 'react-router-dom';
import PageLinks from "../components/PageLinks";
import { buildBulletPoints } from "../middleware/helpers";
import { MONO, ACCENT_GRADIENT } from "../styles/tokens";

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
    dates: '2025 to present',
    current: true,
    summary:
      'Building AI-driven backend systems and the services around them.',
    highlights: [],
  },
  {
    role: 'Automation Software Engineer',
    company: 'Downer Group',
    dates: 'May 2023 to 2025',
    summary:
      'Designed and shipped automation across cloud and on-prem systems, turning manual workflows ' +
      'into monitored, cost-efficient services.',
    highlights: [
      'Automated data extraction from spreadsheets using Azure Function Apps, stored in a database with a PowerBI connection, saving ~$175k a year per business-unit implementation and eliminating manual transcribing errors',
      'Built a custom internal Azure dashboard for monitoring project resources across subscriptions, with resource actions and deployment monitoring',
      'Reduced Azure operating costs by ~60% by scheduling startup/shutdown events with a centralised tagging policy driven from the dashboard',
      'Extracted text with OCR from CAD drawing PDFs and generated project report spreadsheets, a ~95% time saving',
      'Built custom sFTP file routing to applications with remote configuration from trusted actors, removing the need for developer intervention on config updates',
      'Wrote project setup shell scripts that deploy environments and resources in Azure, linked to custom GitHub branch environments with rules and protections for consistent IaC deployments using Bicep',
      'Automated Konect API queries for critical field work, notifying requisite authorities to consistently meet SLAs and avoid total penalties of ~$450k',
      'Identified and designed automation between existing cloud and on-prem systems, leveraging Azure microservices to eliminate manual workflows',
      'Enhanced security through daily storage account key rotation and SAS generation via Azure Key Vault, reducing 80–100 points of failure to a centralised point',
      'Created a custom PyPI module wrapping the Azure SDK with common commands, cutting ~200 lines of replicated code per project',
      'Developed a React frontend so non-technical staff can submit data and run automated jobs',
      'Implemented bespoke deep-learning and computer-vision solutions for real-time artefact recognition with ~94% accuracy',
      'Combined ML and classical analysis to read a variety of analogue meters from a limited dataset, at ~85% accuracy',
      'Deployed and monitored new Esri ArcGIS Enterprise servers',
      'Configured Azure DevOps for integration with external tracking',
      'Liaised with management to find opportunities for automation adoption across divisions',
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
  { group: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'SQL'] },
  { group: 'Frontend', items: ['React', 'React Native', 'Expo', 'MUI'] },
  { group: 'Backend', items: ['Node / Express', 'FastAPI', 'WebSockets', 'REST APIs'] },
  { group: 'Data', items: ['Postgres', 'PowerBI', 'Data analytics'] },
  { group: 'Cloud & DevOps', items: ['Azure', 'Bicep (IaC)', 'GitHub Actions', 'Docker'] },
  { group: 'AI / ML', items: ['Deep learning', 'Computer vision', 'OCR', 'Applied ML'] },
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

export default function About() {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3, pb: 4 }}
    >
      <PageLinks />

      {/* Header */}
      <Box className="reveal">
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Marcus{' '}
          <Box
            component="span"
            sx={{
              background: ACCENT_GRADIENT,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Oates
          </Box>
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 0.5, fontWeight: 400 }}>
          Senior Software Engineer, AI &amp; Backend. Full-stack developer shipping apps, services
          and the data/ML behind them.
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1.5, color: 'text.secondary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <PlaceOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">Australia</Typography>
          </Box>
          <Link
            href="mailto:marcusjoates@gmail.com"
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}
          >
            <EmailOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">marcusjoates@gmail.com</Typography>
          </Link>
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
      <Box className="reveal" sx={{ animationDelay: '0.06s' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2.5 }}>
          Experience
        </Typography>
        {EXPERIENCE.map((exp, i) => (
          <ExperienceEntry key={exp.company} exp={exp} last={i === EXPERIENCE.length - 1} />
        ))}
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      {/* Skills */}
      <Box className="reveal" sx={{ animationDelay: '0.12s' }}>
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
    </Box>
  );
}
