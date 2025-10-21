import { Box, Chip, IconButton, Stack, Typography } from "@mui/material";
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

interface ProjectInfo {
  name: string
  description: string
  link: string
}

const projects: ProjectInfo[] = [
  {
    name: 'Finska',
    description: 'A game game game',
    link: '/finska'
  },
  {
    name: 'Gym Junkie',
    description: 'A game game game',
    link: '/gym-junkie'
  },
  {
    name: 'Downer Helper',
    description: 'A game game game',
    link: '/other/downer-helper'
  },
  {
    name: 'Cellular Tracking',
    description: 'A game game game',
    link: '/other/cellular-tracking'
  }
]

export default function HomePage(this: any) {
  const navigate = useNavigate();

  const [hovered, setHovered] = useState<boolean[]>(Array(projects.length).fill(false));
  
  const handleHover = (index: number, value: boolean) => {
    console.log(index)
    setHovered(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const slides = useMemo(() => {
    return projects.map((project, i) => (
      <Box
        key={i}
        onMouseEnter={() => handleHover(i, true)}
        onMouseLeave={() => handleHover(i, false)}
        sx={{
          height: 200,
          padding: '10px',
          // ml: 1,
          borderColor: hovered[i] ? '#22ff00ff' : '#7d7d7dff',
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: 2,
          transition: 'border-color 0.2s',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', height: '40px' }}>
          <Typography variant="h6">{project.name}</Typography>
          {hovered[i] && (
            <IconButton
              onClick={() => navigate(project.link)}
              color="inherit" 
              size="small"
              sx={{marginLeft: '5px' }}
            >
              <LinkIcon />
            </IconButton>
          )}
        </Box>
        <Typography>{project.description}</Typography>
      </Box>
    ));
  }, [projects, hovered, handleHover]);

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        // maxWidth: 1200,
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

      <Box>
        <Chip
          label="TypeScript"
          variant="outlined"
          sx={{
            bgcolor: "#8b0000",
            borderColor: "#ff1f1fff",
            borderWidth: '2px',
            color: "white",
            fontWeight: 400,
            fontSize: 12,
          }}
        />
        <Chip
          label="React"
          variant="outlined"
          sx={{
            bgcolor: "#d28800",
            borderColor: "#ffad16ff",
            borderWidth: '2px',
            color: "white",
            fontWeight: 400,
            fontSize: 12,
          }}
        />
      </Box>
      <EmblaCarousel slides={slides} options={{ loop: true }} />
    </Box>
  )
}