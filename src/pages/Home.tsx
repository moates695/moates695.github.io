import { Avatar, Box, Chip, Grid, IconButton, Stack, Typography } from "@mui/material";
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

const iconMap: Record<string, string> = {
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
    description: 'A PyPi package to help reduce code repetition across projects. Open source and \
    deployed straight from GitHub.',
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

interface RoadmapData {
  icon: string
  message: string
  chipKey: ChipKey
}

const roadmapData: RoadmapData[] = [
  {
    icon: iconMap.finska,
    message: 'add edit leaderboard functionality',
    chipKey: 'feature'
  },
  {
    icon: iconMap.gym_junkie,
    message: 'add leaderboards, global & per exercise',
    chipKey: 'feature'
  },
  {
    icon: iconMap.finska,
    message: 'create component tests to ensure game state',
    chipKey: 'improvement'
  },
  {
    icon: iconMap.finska,
    message: 'save games & show history',
    chipKey: 'feature'
  },
]

interface ReleaseData {
  icon: string
  message: string
  version: string
  link: string
}

const releaseData: ReleaseData[] = [
  {
    icon: iconMap.finska,
    message: 'finska internal',
    version: '0.0.1',
    link: 'https://expo.dev/accounts/moates/projects/finska/builds/ff39d715-c47a-4e03-9e7b-67beb5ebae5c',
  },
  {
    icon: iconMap.gym_junkie,
    message: 'gym junkie internal',
    version: '0.0.1',
    link: 'https://expo.dev/accounts/moates/projects/gym-junkie/builds/a3a24607-c9df-445c-bc24-e3c91ae4c19b',
  },
  {
    icon: iconMap.downer_helper,
    message: 'downer helper latest',
    version: '0.1.25',
    link: 'https://pypi.org/project/downerhelper/',
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
                  <Grid 
                    container 
                    spacing={2}
                    key={i}
                    sx={{
                      height: 50,
                      backgroundColor: '#0d0d0dff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      borderRadius: '10px',
                    }}
                  >
                    <Grid size="auto">
                      <Avatar 
                        alt="icon" 
                        src={data.icon}
                        sx={{ 
                          width: 24, 
                          height: 24, 
                        }}
                      />
                    </Grid>
                    <Grid size={8.8}>
                      <Typography sx={{justifySelf: 'center'}}>
                        {data.message}
                      </Typography>
                    </Grid>
                    <Grid size="grow" sx={{alignItems: 'flex-end'}}>
                      <Box sx={{justifySelf: 'flex-end'}}>
                        {getChip(data.chipKey)}
                      </Box>
                    </Grid>
                  </Grid>
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
                  // <Box
                  //   key={i}
                  //   sx={{
                  //     height: 50,
                  //     backgroundColor: '#0d0d0dff',
                  //     display: 'flex',
                  //     alignItems: 'center',
                  //     justifyContent: 'space-between',
                  //     paddingLeft: '10px',
                  //     paddingRight: '10px',
                  //     // borderColor: 'black',
                  //     // borderWidth: '2px',
                  //     // borderStyle: 'solid',
                  //     borderRadius: 1,
                  //   }}
                  // >
                  //   <Avatar 
                  //     alt="icon" 
                  //     src={data.icon}
                  //     sx={{ 
                  //       width: 24, 
                  //       height: 24, 
                  //     }}
                  //   />
                  //   <Typography>{data.message}</Typography>
                  //   <Typography>{data.version}</Typography>
                  // </Box>
                  <Grid 
                    container 
                    spacing={2}
                    key={i}
                    sx={{
                      height: 50,
                      backgroundColor: '#0d0d0dff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      borderRadius: '10px',
                    }}
                  >
                    <Grid size="auto">
                      <Avatar 
                        alt="icon" 
                        src={data.icon}
                        sx={{ 
                          width: 24, 
                          height: 24, 
                        }}
                      />
                    </Grid>
                    <Grid size={9}>
                      <Typography sx={{justifySelf: 'center'}}>
                        {data.message}
                      </Typography>
                    </Grid>
                    <Grid size="grow" >
                      <Typography sx={{justifySelf: 'center'}}>
                        {data.version}
                      </Typography>
                    </Grid>
                    <Grid size="grow">
                      <IconButton href={data.link} target="_blank" rel="noopener">
                        <OpenInNewIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                )
              })}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}