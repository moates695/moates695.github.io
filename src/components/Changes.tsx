import { JSX } from "react"
import { ChipKey, getChip } from "../middleware/chipMap"
import { iconMap, Project } from "../pages/Home"
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, IconButton, Stack, Typography } from "@mui/material"
import { buildBulletPoints } from "../middleware/helpers"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Subset<T, U extends T> = U;
export type ChangeProject = Subset<Project, 'finska' | 'gym_junkie'>

export interface ChangeData {
  header: string
  points: string[]
}

export interface RoadmapBareData extends ChangeData {
  chipKey: ChipKey
}

export interface RoadmapData extends RoadmapBareData {
  icon: string
}

type RoadmapMap = Record<ChangeProject, RoadmapBareData[]>;

export const roadmapMap: RoadmapMap = {
  finska: [
    {
      header: 'edit leaderboard functionality',
      chipKey: 'feature',
      points: [
        'edit button on leaderboard to switch into edit mode',
        'remove player, member or team',
        'edit score, misses',
        'update player standing',
        'save or discard changes'
      ],
    },
    {
      header: 'add component tests',
      chipKey: 'improvement',
      points: [
        'test game state with components',
        'check name collisions',
        'check score update and resets, + elims'
      ],
    },
    {
      header: 'save games & show history',
      chipKey: 'feature',
      points: [],
    },
  ],
  gym_junkie: [
    {
      header: 'add leaderboards, global & per exercise',
      chipKey: 'feature',
      points: [],
    },
    {
      header: 'custom exercises',
      chipKey: 'feature',
      points: [],
    },
  ]
}

export interface ReleaseBareData extends ChangeData {
  version: string
  link: string
}

export interface ReleaseData extends ReleaseBareData {
  icon: string
}

type ReleaseMap = Record<ChangeProject, ReleaseBareData[]>

export const releaseMap: ReleaseMap = {
  finska: [
    {
      header: 'finska internal',
      version: '0.0.1',
      link: 'https://expo.dev/accounts/moates/projects/finska/builds/ff39d715-c47a-4e03-9e7b-67beb5ebae5c',
      points: [],
    },
  ],
  gym_junkie: [
    {
      header: 'gym junkie internal',
      version: '0.0.1',
      link: 'https://expo.dev/accounts/moates/projects/gym-junkie/builds/a3a24607-c9df-445c-bc24-e3c91ae4c19b',
      points: [],
    },
  ],
}

interface ChangeRow {
  summary: JSX.Element
  details: string[]
}

type ChangeTitle = 'Roadmap' | 'Releases'

export const buildRoadmapSummary = (data: RoadmapData): JSX.Element => {
  return (
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
  )
};

export const buildReleaseSummary = (data: ReleaseData): JSX.Element => {
  return (
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
  )
};

export const buildChange = (title: ChangeTitle, rows: ChangeRow[], maxHeight?: number): JSX.Element => {
  return (
    <>
      <Typography variant="h6" sx={{paddingBottom: '5px'}}>
        {title}
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
          {rows.map((row, i) => {
            return (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  {row.summary}
                </AccordionSummary>
                <AccordionDetails>
                  {buildBulletPoints(row.details)}
                </AccordionDetails>
              </Accordion>
            )
          })}
        </Stack>
      </Box>
    </>
  )
};

const getProjectRows = (map: RoadmapMap | ReleaseMap, project: ChangeProject, buildSummary: (data: any) => JSX.Element): ChangeRow[] => {
  return map[project].map((data, i): ChangeRow => {
    return {
      summary: buildSummary({
        ...data,
        icon: iconMap[project]
      }),
      details: data.points
    }
  });
};

export const buildProjectChange = (project: ChangeProject, maxHeight?: number) => {
  const roadmapRows = getProjectRows(roadmapMap, project, buildRoadmapSummary);
  const releaseRows = getProjectRows(releaseMap, project, buildReleaseSummary);
  
  return (
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
        {buildChange('Roadmap', roadmapRows, maxHeight)}
      </Box>
      <Box
        sx={{
          height: 'auto',
          padding: 1,
          width: '50%',
        }}
      >
        {buildChange('Releases', releaseRows, maxHeight)}
      </Box>
    </Box>
  )
};

export const getAllRows = (map: RoadmapMap | ReleaseMap, buildSummary: (data: any) => JSX.Element): ChangeRow[] => {
  let rows: ChangeRow[] = [];
  let i = 0;
  while (1) {
    let isExhausted = true;
    for (const [project, dataList] of Object.entries(map)) {
      if (i >= dataList.length) continue;
      isExhausted = false;
      rows.push({
        summary: buildSummary({
          ...dataList[i],
          icon: iconMap[project as ChangeProject]
        }),
        details: dataList[i].points
      })
    }
    if (isExhausted) break;
    i++;
  }
  return rows;
};

export const buildAllChange = (maxHeight?: number) => {
  const roadmapRows = getAllRows(roadmapMap, buildRoadmapSummary);
  const releaseRows = getAllRows(releaseMap, buildReleaseSummary);

  return (
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
        {buildChange('Roadmap', roadmapRows, maxHeight)}
      </Box>
      <Box
        sx={{
          height: 'auto',
          padding: 1,
          width: '50%',
        }}
      >
        {buildChange('Releases', releaseRows, maxHeight)}
      </Box>
    </Box>
  )

};