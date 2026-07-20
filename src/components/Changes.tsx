import { JSX } from "react"
import { ChipKey, getChip } from "../middleware/chipMap"
import { iconMap, Project } from "../middleware/projects"
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, IconButton, Stack, Typography } from "@mui/material"
import { buildBulletPoints } from "../middleware/helpers"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Subset<T, U extends T> = U;
export type ChangeProject = Subset<Project, 'finska' | 'gym_junkie' | 'balderdash' | 'downer_helper'>

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
      header: 'game history viewer',
      chipKey: 'feature',
      points: [
        'view past completed games',
        'multi-game storage (currently single save slot)',
        'game stats and summaries',
      ],
    },
    {
      header: 'component tests',
      chipKey: 'improvement',
      points: [
        'React component tests for Scoreboard, PinMap, UpNext',
        'core game logic tests complete',
      ],
    },
    {
      header: 'theme selection fix',
      chipKey: 'bug_fix',
      points: [
        'sand theme can load even when an alternate theme is chosen',
        'respect the saved theme choice on startup',
      ],
    },
  ],
  gym_junkie: [
    {
      header: 'custom exercises',
      chipKey: 'feature',
      points: [
        'create custom exercises and variants of the defaults',
        'backend and merging of custom exercises complete',
        'frontend in progress',
      ],
    },
    {
      header: 'data export',
      chipKey: 'feature',
      points: [
        'export workout history and profile data',
        'auth-protected export endpoints',
      ],
    },
  ],
  balderdash: [
    {
      header: 'persistent round recovery',
      chipKey: 'feature',
      points: [
        'active round state is in-memory only, so a restart mid-round drops the round',
        'persist real and fake answers, votes and score deltas so a restart can resume',
      ],
    },
    {
      header: 'multi-worker support',
      chipKey: 'improvement',
      points: [
        'the in-memory rooms dict assumes a single uvicorn worker',
        'add Redis pub/sub so multiple workers can share room state and broadcasts',
      ],
    },
    {
      header: 'public play store release',
      chipKey: 'feature',
      points: [
        'currently distributed as an Expo internal build',
        'polish onboarding and ship to the Play Store',
      ],
    },
  ],
  downer_helper: []
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
      header: 'woodchuck internal testing',
      version: '0.0.4',
      link: 'https://expo.dev/accounts/moates/projects/finska/builds/ff39d715-c47a-4e03-9e7b-67beb5ebae5c',
      points: [
        'edit-mode scoreboard with score and miss-count corrections',
        'save and continue games via AsyncStorage snapshots',
        'light, dark and sand themes (Jotai-backed)',
        'team support with rotating throws and mid-game member swap',
        'rule customisation guarded against invalidating the in-progress game',
      ],
    },
  ],
  gym_junkie: [
    {
      header: 'gym junkie internal',
      version: '0.0.12',
      link: 'https://expo.dev/accounts/moates/projects/gym-junkie/builds/a3a24607-c9df-445c-bc24-e3c91ae4c19b',
      points: [
        'leaderboards, global and per exercise',
        'Strava integration with TCX upload',
        'friends system with permissions',
        'heart rate monitor support',
        'two-factor auth for external logins',
        'account deletion with full data cascade',
      ],
    },
  ],
  balderdash: [
    {
      header: 'poppycock internal',
      version: '0.0.1',
      link: 'https://expo.dev/accounts/moates',
      points: [
        'real-time rooms with host, dasher and player roles',
        'collecting to voting to scored round phases',
        'FastAPI and WebSocket backend with a Postgres-persisted shell',
        'in-memory active round state',
      ],
    },
  ],
  downer_helper: []
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
        flexWrap: 'wrap',
        width: '100%',
      }}
    >
      <Box
        sx={{
          height: 'auto',
          padding: 1,
          flex: '1 1 300px',
          minWidth: 0,
        }}
      >
        {buildChange('Roadmap', roadmapRows, maxHeight)}
      </Box>
      <Box
        sx={{
          height: 'auto',
          padding: 1,
          flex: '1 1 300px',
          minWidth: 0,
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
        flexWrap: 'wrap',
        width: '100%',
      }}
    >
      <Box
        sx={{
          height: 'auto',
          padding: 1,
          flex: '1 1 300px',
          minWidth: 0,
        }}
      >
        {buildChange('Roadmap', roadmapRows, maxHeight)}
      </Box>
      <Box
        sx={{
          height: 'auto',
          padding: 1,
          flex: '1 1 300px',
          minWidth: 0,
        }}
      >
        {buildChange('Releases', releaseRows, maxHeight)}
      </Box>
    </Box>
  )

};