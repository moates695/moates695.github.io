import { JSX } from "react"
import { ChipKey } from "../middleware/chipMap"
import { iconMap } from "../pages/Home"

export interface ChangeData {
  // icon: string
  header: string
  points: string[]
}

export interface RoadmapData extends ChangeData {
  chipKey: ChipKey
}

export type ChangeProject = 'finska' | 'gym_junkie';

export const roadmapData: Record<ChangeProject, RoadmapData[]> = {
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

// todo build roadmap, build release

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