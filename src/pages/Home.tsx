import { Box, Chip, Stack, Typography } from "@mui/material";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import PageLinks from "../components/PageLinks";
import Carousel, { CarouselItem } from "../components/Carousel";
import EmblaCarousel from "../components/EmblaCarousel";

interface ProjectInfo {
  name: string
  description: string
}

export default function HomePage(this: any) {
  const projects: ProjectInfo[] = [
    {
      name: 'Finska',
      description: 'A game game game'
    },
    {
      name: 'Gym Junkie',
      description: 'A game game game'
    },
    {
      name: 'Downer Helper',
      description: 'A game game game'
    },
    {
      name: 'Cellular Tracking',
      description: 'A game game game'
    },
  ]

  // const slides = projects.map((project, i) => (
  //   <div
  //     className="embla__slide"
  //     style={{
  //       borderColor: 'red',
  //       borderWidth: '2px',
  //       borderStyle: 'solid'
  //     }}
  //   >
  //     <div>{project.name}</div>
  //   </div>
  // ))

  const slides = Array.from(Array(6).keys())

  // const items: CarouselItem[] = projects.map((project, i) => (
  //   {
  //     id: i,
  //     content: (
  //       <Box
  //         sx={{
  //           height: '200px',
  //           width: '100%',
  //           flexShrink: 0, 
  //           padding: '10px',
  //           backgroundColor: 'red',
  //           borderRadius: '10px',
  //         }}
  //       >
  //         <Typography>{project.name}</Typography>
  //         <Typography>{project.description}</Typography>
  //       </Box>
  //     )
  //   }
  // ))

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
      {/* <Stack 
        direction="row" 
        spacing={2} 
        sx={{ overflowX: "auto" }}
      >
        {projects.map((project) => (
          <Box
            sx={{
              height: '200px',
              width: '300px',
              flexShrink: 0, 
              padding: '10px',
              backgroundColor: 'red',
              borderRadius: '10px',
            }}
          >
            <Typography>{project.name}</Typography>
            <Typography>{project.description}</Typography>
          </Box>
        ))}
      </Stack> */}
      
      <Box>
        <Chip
          label="TypeScript"
          variant="outlined"
          sx={{
            bgcolor: "#8b0000",
            borderColor: "#ff1f1fff",
            borderWidth: '2px',
            color: "white",
            fontWeight: 600,
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
            fontWeight: 600,
          }}
        />
      </Box>
      <Box
        sx={{
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
      >
        {/* <Carousel items={items} defaultWidth={400} gap={16} /> */}
      </Box>
      <EmblaCarousel slides={slides} options={{ loop: true }} />
    </Box>
  )
}