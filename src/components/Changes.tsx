import { JSX } from "react"
import { ChipKey, getChip } from "../middleware/chipMap"
import { iconMap } from "../pages/Home"
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, IconButton, Stack, Typography } from "@mui/material"
import { buildBulletPoints } from "../middleware/helpers"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export type ChangeProject = 'finska' | 'gym_junkie';

export interface ChangeData {
  // icon: string
  header: string
  points: string[]
}

export interface RoadmapBareData extends ChangeData {
  chipKey: ChipKey
}

export const roadmapData: Record<ChangeProject, RoadmapBareData[]> = {
  finska: [
    {
      // icon: iconMap.finska,
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
      // icon: iconMap.gym_junkie,
      header: 'add leaderboards, global & per exercise',
      chipKey: 'feature',
      points: [],
    },
    {
      // icon: iconMap.finska,
      header: 'create component tests to ensure game state',
      chipKey: 'improvement',
      points: [],
    },
    {
      // icon: iconMap.finska,
      header: 'save games & show history',
      chipKey: 'feature',
      points: [],
    },
  ],
  gym_junkie: []
}

export interface RoadmapData extends RoadmapBareData {
  icon: string
}

export interface ReleaseData extends ChangeData {
  version: string
  link: string
}

export const releaseData: Record<ChangeProject, ReleaseData[]> = {
  finska: [
    {
      // icon: iconMap.finska,
      header: 'finska internal',
      version: '0.0.1',
      link: 'https://expo.dev/accounts/moates/projects/finska/builds/ff39d715-c47a-4e03-9e7b-67beb5ebae5c',
      points: [],
    },
    {
      // icon: iconMap.gym_junkie,
      header: 'gym junkie internal',
      version: '0.0.1',
      link: 'https://expo.dev/accounts/moates/projects/gym-junkie/builds/a3a24607-c9df-445c-bc24-e3c91ae4c19b',
      points: [],
    },
    {
      // icon: iconMap.downer_helper,
      header: 'downer helper latest',
      version: '0.1.25',
      link: 'https://pypi.org/project/downerhelper/',
      points: [],
    },
  ],
  gym_junkie: [],
}

export const buildRoadmap = (roadmap: RoadmapData[], maxHeight?: number): JSX.Element => {
  return (
    <>
      <Typography variant="h6" sx={{paddingBottom: '5px'}}>
        Roadmap
      </Typography>
      <Box
        sx={{...(maxHeight && {
          maxHeight: maxHeight,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        })}}
      >
        <Stack
          spacing={1.5}
        >
          {roadmap.map((data, i) => {
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
    </>
  )
};

export const buildProjectRoadmap = (project: ChangeProject, maxHeight?: number): JSX.Element => {
  const roadmap: RoadmapData[] = roadmapData[project].map((item) => ({
    ...item,
    icon: iconMap[project]
  }));
  return buildRoadmap(roadmap, maxHeight);
};

export const buildAllRoadmap = (maxHeight?: number): JSX.Element => {
  const roadmap: RoadmapData[] = [];
  let i = 0;
  while (1) {
    let isExhausted = true;
    for (const [project, data] of Object.entries(roadmapData)) {
      if (i >= data.length) continue;
      isExhausted = false;
      roadmap.push({
        ...data[i],
        icon: iconMap[project as  ChangeProject]
      })
    }
    if (isExhausted) break;
    i++;
  }
  return buildRoadmap(roadmap, maxHeight);
};



export const buildReleases = (project: ChangeProject, maxHeight?: number): JSX.Element => {
  return (
    <>
      <Typography variant="h6" sx={{paddingBottom: '5px'}}>
        Releases
      </Typography>
      <Box
        sx={{...(maxHeight && {
          maxHeight: maxHeight,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        })}}
      >
        <Stack
          spacing={1.5}
        >
          {releaseData[project].map((data, i) => {
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
                        src={iconMap[project]}
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
    </>
  );
};

// const listAll = () => {
//   while (1) {
    
//     let i = 0;
//     for () {

//     }
//   }

//   return {
//     roadmap: [],
//     releases: []
//   }
// };