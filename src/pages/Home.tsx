import { Box, Chip, Grid, IconButton, Stack, Typography } from "@mui/material";
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

interface ProjectInfo {
  name: string
  description: string
  link: string
  chipKeys: ChipKey[]
}

const projectData: ProjectInfo[] = [
  {
    name: 'Finska',
    description: 'A game game game',
    link: '/finska',
    chipKeys: ['react_ts', 'client_side'],
  },
  {
    name: 'Gym Junkie',
    description: 'A game game game',
    link: '/gym-junkie',
    chipKeys: ['full_stack', 'react_ts', 'express', 'python', 'postgres', 'ai_ml'],
  },
  {
    name: 'Downer Helper',
    description: 'A game game game',
    link: '/other/downer-helper',
    chipKeys: ['python', 'package'],
  },
  {
    name: 'Cellular Tracking',
    description: 'A game game game',
    link: '/other/cellular-tracking',
    chipKeys: ['ai_ml', 'python'],
  }
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
          flexDirection: 'column',
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
            height: '100%'
          }}
        >  
          <Box 
            sx={{
              width: '75%', 
              height: '100%'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                height: '40px' 
              }}
            >
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
            <Typography>{data.description}</Typography>
          </Box>
          <Box sx={{width: '25%', height: '100%'}}>

          </Box>
        </Box>
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4px',
            marginTop: 'auto',
            paddingTop: '5px',
          }}
        >
          {data.chipKeys.map((key) => {
            return getChip(key);
          })}
        </Box>
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
        alignSelf: 'center',
        gap: '10px'
      }}
    >
      <PageLinks />

      <Typography variant="h5">
        Marcus Oates
      </Typography>
      <Typography>
        Hey there, check out some of my projects!
      </Typography>
      <EmblaCarousel slides={slides} options={{ loop: true }} />
    </Box>
  )
}