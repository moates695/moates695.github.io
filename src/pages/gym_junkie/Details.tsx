import { ReactElement } from "react";
import { Box } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import TimerIcon from "@mui/icons-material/Timer";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import BarChartIcon from "@mui/icons-material/BarChart";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import ShareIcon from "@mui/icons-material/Share";
import {
  Reveal,
  GradientText,
  PageHeader,
  SectionHeading,
  FeatureCard,
  CardGrid,
  PageNav,
} from "../../components/design";

const ACCENT = "#d8aa78";
const iconSx = { fontSize: 22 };

type Feature = {
  icon: ReactElement;
  title: string;
  blurb: string;
  link: string;
};

const sections: { eyebrow: string; heading: string; features: Feature[] }[] = [
  {
    eyebrow: "log",
    heading: "Logging your workouts",
    features: [
      {
        icon: <FitnessCenterIcon sx={iconSx} />,
        title: "Workout Logging",
        blurb: "Fast set, rep and weight entry. Reorder, swap and tweak exercises mid-workout, with drafts autosaving so you never lose a session.",
        link: "/gym-junkie/details/workout-logging",
      },
      {
        icon: <LibraryBooksIcon sx={iconSx} />,
        title: "Exercise Library",
        blurb: "A built-in catalogue with filters, plus your own custom exercises, variations and favourites.",
        link: "/gym-junkie/details/exercise-library",
      },
      {
        icon: <TimerIcon sx={iconSx} />,
        title: "Rest Timer & Heart Rate",
        blurb: "A rest timer between sets and Bluetooth heart-rate strap support so you can see your effort live.",
        link: "/gym-junkie/details/rest-timer-heart-rate",
      },
    ],
  },
  {
    eyebrow: "analyse",
    heading: "Tracking & insights",
    features: [
      {
        icon: <MyLocationIcon sx={iconSx} />,
        title: "Muscle Targets",
        blurb: "Set weekly targets per muscle group and see at a glance how close you are to hitting them.",
        link: "/gym-junkie/details/muscle-targets",
      },
      {
        icon: <WhatshotIcon sx={iconSx} />,
        title: "Muscle Heatmap",
        blurb: "A body map of which muscles you have trained recently, and how often, so nothing slips through the cracks.",
        link: "/gym-junkie/details/muscle-heatmap",
      },
      {
        icon: <BarChartIcon sx={iconSx} />,
        title: "Exercise Stats",
        blurb: "Per-exercise history, n-rep maxes, personal records and progression charts over time.",
        link: "/gym-junkie/details/exercise-stats",
      },
      {
        icon: <DonutLargeIcon sx={iconSx} />,
        title: "Distributions & Ratios",
        blurb: "Radar charts of your training balance across muscle groups by volume, sets or reps.",
        link: "/gym-junkie/details/distributions",
      },
      {
        icon: <CalendarMonthIcon sx={iconSx} />,
        title: "History & Calendar",
        blurb: "Browse every past workout and see your training frequency on a yearly calendar.",
        link: "/gym-junkie/details/history-calendar",
      },
    ],
  },
  {
    eyebrow: "share",
    heading: "Social",
    features: [
      {
        icon: <GroupIcon sx={iconSx} />,
        title: "Friends & Leaderboards",
        blurb: "Add your mates, follow what they are up to and compete on lift-based leaderboards. No likes, no comments.",
        link: "/gym-junkie/details/friends",
      },
      {
        icon: <ShareIcon sx={iconSx} />,
        title: "Strava Sharing",
        blurb: "Connect Strava and share completed workouts to your feed in one tap.",
        link: "/gym-junkie/details/strava",
      },
    ],
  },
];

export default function GymJunkieDetails() {
  return (
    <Box
      component="section"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 3, sm: 4 }, pb: 4 }}
    >
      <PageHeader
        eyebrow="details"
        title={
          <>
            Feature <GradientText>hub</GradientText>
          </>
        }
        subtitle="Gym Junkie packs a lot in. Pick a feature below to read how it works from a user's point of view."
      />

      {sections.map(({ eyebrow, heading, features }, i) => (
        <Reveal key={heading} delay={0.06 + i * 0.06}>
          <SectionHeading eyebrow={eyebrow}>{heading}</SectionHeading>
          <CardGrid>
            {features.map((feature) => (
              <FeatureCard
                key={feature.link}
                icon={feature.icon}
                title={feature.title}
                blurb={feature.blurb}
                to={feature.link}
                accent={ACCENT}
              />
            ))}
          </CardGrid>
        </Reveal>
      ))}

      <PageNav
        left={{ text: "Overview", link: "/gym-junkie" }}
        right={{ text: "Changes", link: "/gym-junkie/changes" }}
      />
    </Box>
  );
}
