import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Chip, Divider, Grid, IconButton, List, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import PageLinks from "../components/PageLinks";
import Carousel, { CarouselItem } from "../components/Carousel";
import EmblaCarousel from "../components/EmblaCarousel";
import '../css/embla.css';
import { useMemo, useState } from "react";
import LinkIcon from '@mui/icons-material/Link';
import React from "react";
import { useNavigate } from 'react-router-dom';
import { ChipKey, getChip } from "../middleware/chipMap";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { buildBulletPoints } from "../middleware/helpers";
import { buildAllChange } from "../components/Changes";
import { contactButtons } from "./Contact";

export type Project = 'finska' | 'gym_junkie' | 'downer_helper' | 'cellular_tracking' | 'postgres_deploy';

export const iconMap: Record<Project, string> = {
  finska: '/finska-icon.png',
  gym_junkie: '/gym-junkie-icon.png',
  downer_helper: '/pypi-logo.png',
  cellular_tracking: '/cells-logo.png',
  postgres_deploy: '/pypi-logo.png',
}

interface ProjectInfo {
  icon: string
  name: string
  description: string
  link: string
  chipKeys: ChipKey[],
  highlight: string
}

const projectData: ProjectInfo[] = [
  {
    icon: iconMap.finska,
    name: 'Finska',
    description: 'A simple, lightweight client side app to track a game of Finska.\
    \nDownload and go, no sign in required!',
    link: '/finska',
    chipKeys: ['client_side', 'react_ts'],
    highlight: '/finska-highlight.png'
  },
  {
    icon: iconMap.gym_junkie,
    name: 'Gym Junkie',
    description: 'A free gym workout tracker, with advanced data analytics and graphing capabilites.\
    Compare lifts with previous sessions or climb the leaderboards.',
    link: '/gym-junkie',
    chipKeys: ['full_stack', 'react_ts', 'express', 'python', 'postgres', 'ai_ml'],
    highlight: '/gym-junkie-highlight.png'
  },
  {
    icon: iconMap.cellular_tracking,
    name: 'Cellular Tracking',
    description: 'Major computer vision project for segmenting cells, tracking and displaying their paths\
    and identifying divisions.',
    link: '/other/cellular-tracking',
    chipKeys: ['ai_ml', 'python'],
    highlight: ''
  },
  {
    icon: iconMap.downer_helper,
    name: 'Downer Helper',
    description: 'A PyPi package to help reduce code repetition across projects.\
    Available for anyone to use, deployed straight from GitHub.',
    link: '/other/downer-helper',
    chipKeys: ['python', 'package'],
    highlight: ''
  },
  {
    icon: iconMap.postgres_deploy,
    name: 'Postgres Deploy',
    description: 'A PyPi package that deploys/updates Postgres schemas from a \
    set of configuration files. Helps projects with different db environments.',
    link: '/other/postgres-deploy',
    chipKeys: ['python', 'package'],
    highlight: ''
  },
]

export default function HomePage(this: any) {
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [hovered, setHovered] = useState<boolean[]>(Array(projectData.length).fill(false));

  const handleHover = (index: number, value: boolean) => {
    setHovered(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const slides = useMemo(() => {
    return projectData.map((data, i) => (
      <Box
        key={i}
        onMouseEnter={() => handleHover(i, true)}
        onMouseLeave={() => handleHover(i, false)}
        onClick={isMobile ? () => navigate(data.link) : undefined}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: { xs: 'auto', sm: 200 },
          minHeight: { xs: 160, sm: 200 },
          padding: '10px',
          borderColor: hovered[i] ? theme.palette.primary.main : theme.palette.divider,
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: 2,
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          boxShadow: hovered[i] ? '0 0 16px rgba(77, 208, 225, 0.15)' : 'none',
          maxWidth: '85vw',
          cursor: isMobile ? 'pointer' : 'default',
        }}
      >
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            width: '100%',
          }}
        >  
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              // width: '75%', 
              height: '100%',
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                height: '40px'
              }}
            >
              <Avatar 
                alt="icon" 
                src={data.icon}
                sx={{ 
                  width: 32, 
                  height: 32, 
                  marginRight: '10px'
                }}
              />
              <Typography variant="h6">
                {data.name}
              </Typography>
              {hovered[i] && (
                <IconButton
                  onClick={() => navigate(data.link)}
                  color="inherit" 
                  size="small"
                  sx={{marginLeft: '5px' }}
                >
                  <LinkIcon />
                </IconButton>
              )}
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: 'text.secondary', mt: 0.5 }}>
              {data.description}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '4px',
                marginTop: 'auto',
              }}
            >
              {data.chipKeys.map((key) => {
                return getChip(key);
              })}
            </Box>
          </Box>
        </Box>
        {data.highlight && (
          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
              maxWidth: '35%',
              maxHeight: 200,
              objectFit: 'contain',
              objectPosition: 'center right',
              flexShrink: 0,
            }}
            component="img"
            src={data.highlight}
          />
        )}
      </Box>
    ));
  }, [hovered, isMobile, navigate, theme]);

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        gap: '10px',
        justifyContent: 'space-between'
      }}
    >
      <Box>
        <PageLinks />
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
            Marcus Oates
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 300,
              color: 'text.secondary',
              mt: 0.5,
            }}
          >
            Full stack developer &mdash; check out some of my projects below.
          </Typography>
        </Box>
        <Box>
          <EmblaCarousel slides={slides} options={{ loop: true }} />
        </Box>
        <Box
          sx={{
            '& > .MuiBox-root': {
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            },
            '& > .MuiBox-root > .MuiBox-root': {
              width: isMobile ? '100%' : '50%',
            },
          }}
        >
          {buildAllChange(isMobile ? 260 : 375)}
        </Box>
      </Box>
      <Box>
        <Divider sx={{ mb: 2, borderColor: 'divider' }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pb: 2,
          }}
        >
          {contactButtons}
          <Typography fontSize={12} sx={{ mt: 0.5, color: 'text.disabled' }}>
            quick links
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}