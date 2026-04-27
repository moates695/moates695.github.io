import { ReactElement } from "react";
import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";

type Feature = {
  icon: ReactElement;
  title: string;
  blurb: string;
  link: string;
};

const iconSx = { fontSize: 36 };

const sections: { heading: string; features: Feature[] }[] = [
  {
    heading: "Logging your workouts",
    features: [
      {
        icon: <FitnessCenterIcon sx={iconSx} />,
        title: "Workout Logging",
        blurb: "Fast set, rep and weight entry. Reorder, swap and tweak exercises mid-workout. Drafts autosave so you never lose a session.",
        link: "/gym-junkie/details/workout-logging",
      },
      {
        icon: <LibraryBooksIcon sx={iconSx} />,
        title: "Exercise Library",
        blurb: "A built-in catalogue of exercises with filters, plus your own custom exercises, variations and favourites.",
        link: "/gym-junkie/details/exercise-library",
      },
      {
        icon: <TimerIcon sx={iconSx} />,
        title: "Rest Timer & Heart Rate",
        blurb: "Built-in rest timer between sets and Bluetooth heart-rate strap support so you can see your effort live.",
        link: "/gym-junkie/details/rest-timer-heart-rate",
      },
    ],
  },
  {
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
        blurb: "A body map that shows which muscles you've trained recently, and how often, so nothing falls through the cracks.",
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
    heading: "Social",
    features: [
      {
        icon: <GroupIcon sx={iconSx} />,
        title: "Friends & Leaderboards",
        blurb: "Add your mates, follow what they're up to and compete on lift-based leaderboards. No likes, no comments.",
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
  const navigate = useNavigate();

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
        Details
      </Typography>
      <Typography>
        Gym Junkie packs a lot in. Pick a feature below to read about how it works
        from a user's point of view.
      </Typography>

      {sections.map(({ heading, features }) => (
        <Box key={heading} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
          <Typography variant="h6">{heading}</Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 2,
              width: '100%',
            }}
          >
            {features.map((feature) => (
              <Card key={feature.link} variant="outlined" sx={{ height: '100%' }}>
                <CardActionArea
                  onClick={() => navigate(feature.link)}
                  sx={{ height: '100%', alignItems: 'stretch' }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {feature.icon}
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {feature.blurb}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Box>
      ))}

      <Box sx={{ mt: 2 }}>
        {BottomNavigation({
          left: {
            text: 'Overview',
            link: '/gym-junkie',
          },
          right: {
            text: 'Changes',
            link: '/gym-junkie/changes',
          },
        })}
      </Box>
    </Box>
  );
}
