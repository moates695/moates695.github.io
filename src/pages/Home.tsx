import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Chip, Grid, IconButton, List, Stack, Typography } from "@mui/material";
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

export type Project = 'finska' | 'gym_junkie' | 'downer_helper' | 'cellular_tracking';

export const iconMap: Record<Project, string> = {
  finska: '/finska-icon.png',
  gym_junkie: '/gym-junkie-icon.png',
  downer_helper: '',
  cellular_tracking: '',
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
    icon: iconMap.downer_helper,
    name: 'Downer Helper',
    description: 'A PyPi package to help reduce code repetition across projects.\
    Available for anyone to use, deployed straight from GitHub.',
    link: '/other/downer-helper',
    chipKeys: ['python', 'package'],
    highlight: ''
  },
  {
    icon: iconMap.cellular_tracking,
    name: 'Cellular Tracking',
    description: 'Major computer vision project for segmenting cells, tracking and displaying their paths\
    and identifying divisions.',
    link: '/other/cellular-tracking',
    chipKeys: ['ai_ml', 'python'],
    highlight: ''
  }
]

export interface ChangeData {
  icon: string
  header: string
  points: string[]
}

export interface RoadmapData extends ChangeData {
  chipKey: ChipKey
}

const roadmapData: RoadmapData[] = [
  {
    icon: iconMap.finska,
    header: 'add edit leaderboard functionality',
    chipKey: 'feature',
    points: [
      'dot point1',
      'dot point2',
      'dot point3',
      'dot point4',
      'dot point5',
    ],
  },
  {
    icon: iconMap.gym_junkie,
    header: 'add leaderboards, global & per exercise',
    chipKey: 'feature',
    points: [],
  },
  {
    icon: iconMap.finska,
    header: 'create component tests to ensure game state',
    chipKey: 'improvement',
    points: [],
  },
  {
    icon: iconMap.finska,
    header: 'save games & show history',
    chipKey: 'feature',
    points: [],
  },
]

export interface ReleaseData extends ChangeData {
  version: string
  link: string
}

const releaseData: ReleaseData[] = [
  {
    icon: iconMap.finska,
    header: 'finska internal',
    version: '0.0.1',
    link: 'https://expo.dev/accounts/moates/projects/finska/builds/ff39d715-c47a-4e03-9e7b-67beb5ebae5c',
    points: [],
  },
  {
    icon: iconMap.gym_junkie,
    header: 'gym junkie internal',
    version: '0.0.1',
    link: 'https://expo.dev/accounts/moates/projects/gym-junkie/builds/a3a24607-c9df-445c-bc24-e3c91ae4c19b',
    points: [],
  },
  {
    icon: iconMap.downer_helper,
    header: 'downer helper latest',
    version: '0.1.25',
    link: 'https://pypi.org/project/downerhelper/',
    points: [],
  },
]

export default function HomePage(this: any) {
  const navigate = useNavigate();

  const [hovered, setHovered] = useState<boolean[]>(Array(projectData.length).fill(false));
  
  const handleHover = (index: number, value: boolean) => {
    console.log(index)
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
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: 200,
          padding: '10px',
          borderColor: hovered[i] ? '#22ff00ff' : '#7d7d7dff',
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: 2,
          transition: 'border-color 0.2s',
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
            <Typography sx={{whiteSpace: 'pre-line'}}>
              {data.description}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
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
        <Box 
          sx={{
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
          }}
          component="img"
          src={data.highlight}
        />
      </Box>
    ));
  }, [projectData, hovered, handleHover]);

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        gap: '10px',
      }}
    >
      <PageLinks />
      <Typography variant="h5">
        Marcus Oates
      </Typography>
      <Typography>
        Hey there, check out some of my projects!
      </Typography>
      <Box>
        <EmblaCarousel slides={slides} options={{ loop: true }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
        }}
      >
        <Box
          sx={{
            height: 'auto',
            padding: 1,
            width: '50%',
          }}
        >
          <Typography variant="h6" sx={{paddingBottom: '5px'}}>
            Roadmap
          </Typography>
          <Box
            sx={{
              maxHeight: 300,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <Stack
              spacing={1.5}
            >
              {roadmapData.map((data, i) => {
                return (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                          }}
                        >
                          <Avatar 
                            alt="icon" 
                            src={data.icon}
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              marginRight: 1.5,
                            }}
                          />
                          <Typography>
                            {data.header}
                          </Typography>
                        </Box>
                        <Box sx={{marginRight: 0.5}}>
                          {getChip(data.chipKey)}
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {buildBulletPoints(data.points)}
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </Stack>
          </Box>
        </Box>
        <Box
          sx={{
            padding: 1,
            width: '50%',
          }}
        >
          <Typography variant="h6" sx={{paddingBottom: '5px'}}>
            Releases
          </Typography>
          <Box
            sx={{
              maxHeight: 300,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <Stack
              spacing={1.5}
            >
              {releaseData.map((data, i) => {
                return (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                          }}
                        >
                          <Avatar 
                            alt="icon" 
                            src={data.icon}
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              marginRight: 1.5,
                            }}
                          />
                          <Typography>
                            {data.header}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginRight: 1,
                          }}
                        >
                          <Typography sx={{marginRight: 1}}>
                            {data.version}
                          </Typography>
                          <IconButton 
                            href={data.link} 
                            target="_blank" 
                            rel="noopener"
                            sx={{
                              width: 20,
                              height: 20,
                            }}
                          >
                            <OpenInNewIcon sx={{ fontSize: 20 }}/>
                          </IconButton>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {buildBulletPoints(data.points)}
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}