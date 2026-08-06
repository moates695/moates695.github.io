import './App.css';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import AppToolbar from './components/AppToolbar'
import Home from './pages/Home'
import Contact from './pages/Contact'
import About from './pages/About'
import Projects from './pages/Projects'
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from "./styles/theme";
import SandBackground from './components/SandBackground';
import SandInnerBackground from './components/SandInnerBackground';
import ChatWidget from './components/ChatWidget';
import WoodchuckOverview from './pages/finska/Overview';
import WoodchuckDesign from './pages/finska/Design';
import GymJunkieOverview from './pages/gym_junkie/Overview';
import GymJunkieDetails from './pages/gym_junkie/Details';
import GymJunkieWorkoutLogging from './pages/gym_junkie/details/WorkoutLogging';
import GymJunkieExerciseLibrary from './pages/gym_junkie/details/ExerciseLibrary';
import GymJunkieRestTimerHeartRate from './pages/gym_junkie/details/RestTimerHeartRate';
import GymJunkieMuscleTargets from './pages/gym_junkie/details/MuscleTargets';
import GymJunkieMuscleHeatmap from './pages/gym_junkie/details/MuscleHeatmap';
import GymJunkieExerciseStats from './pages/gym_junkie/details/ExerciseStats';
import GymJunkieDistributions from './pages/gym_junkie/details/Distributions';
import GymJunkieHistoryCalendar from './pages/gym_junkie/details/HistoryCalendar';
import GymJunkieFriends from './pages/gym_junkie/details/Friends';
import GymJunkieStrava from './pages/gym_junkie/details/Strava';
import OtherDownerHelper from './pages/other/DownerHelper';
import OtherCellularTracking from './pages/other/CellularTracking';
import WoodchuckChanges from './pages/finska/Changes';
import PoppycockOverview from './pages/poppycock/Overview';
import PoppycockDesign from './pages/poppycock/Design';
import PoppycockChanges from './pages/poppycock/Changes';
import PoppycockPrivacyPolicy from './pages/poppycock/PrivacyPolicy';
import GymJunkieChanges from './pages/gym_junkie/Changes';
import OtherPostgresDeploy from './pages/other/PostgresDeploy';
import OtherImaxBot from './pages/other/ImaxBot';
import OtherMcpServer from './pages/other/McpServer';
import OtherSmartTrainer from './pages/other/SmartTrainer';
import OtherArbitrage from './pages/other/Arbitrage';
import OtherTradingStrategies from './pages/other/TradingStrategies';
import OtherAuthenticator from './pages/other/Authenticator';
import OtherEventPicker from './pages/other/EventPicker';
import WoodchuckPrivacyPolicy from './pages/finska/PrivacyPolicy';
import GymJunkiePrivacyPolicy from './pages/gym_junkie/PrivacyPolicy';
import DeleteMe from './pages/gym_junkie/DeleteMe';
import DataExport from './pages/gym_junkie/DataExport';
import SmallProjects from './pages/SmallProjects';

/**
 * Inner shell (inside the Router so it can read the route). The Tech Sand home
 * page renders full-bleed up to a 1440px cap over the dune backdrop; every other
 * page keeps the 1220px content column over a calmer sand backdrop.
 */
function AppShell() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  // Reset scroll to the top whenever the route changes, otherwise navigating to
  // a new page keeps the previous page's scroll position.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {isHome ? <SandBackground /> : <SandInnerBackground />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          alignItems: 'center',
          justifyContent: 'flex-start',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <AppToolbar />
        <Box
          sx={{
            width: '100%',
            maxWidth: isHome ? 1440 : 1220,
            paddingTop: isHome ? 0 : '10px',
            paddingLeft: isHome ? 0 : { xs: '12px', sm: '20px' },
            paddingRight: isHome ? 0 : { xs: '12px', sm: '20px' },
            flex: '1 0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/small-projects" element={<SmallProjects />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/woodchuck">
              <Route index element={<WoodchuckOverview />} />
              <Route path="design" element={<WoodchuckDesign />} />
              <Route path="changes" element={<WoodchuckChanges />} />
              <Route path="privacy" element={<WoodchuckPrivacyPolicy />} />
            </Route>
            <Route path="/poppycock">
              <Route index element={<PoppycockOverview />} />
              <Route path="design" element={<PoppycockDesign />} />
              <Route path="changes" element={<PoppycockChanges />} />
              <Route path="privacy" element={<PoppycockPrivacyPolicy />} />
            </Route>
            <Route path="/gym-junkie">
              <Route index element={<GymJunkieOverview />} />
              <Route path="details">
                <Route index element={<GymJunkieDetails />} />
                <Route path="workout-logging" element={<GymJunkieWorkoutLogging />} />
                <Route path="exercise-library" element={<GymJunkieExerciseLibrary />} />
                <Route path="rest-timer-heart-rate" element={<GymJunkieRestTimerHeartRate />} />
                <Route path="muscle-targets" element={<GymJunkieMuscleTargets />} />
                <Route path="muscle-heatmap" element={<GymJunkieMuscleHeatmap />} />
                <Route path="exercise-stats" element={<GymJunkieExerciseStats />} />
                <Route path="distributions" element={<GymJunkieDistributions />} />
                <Route path="history-calendar" element={<GymJunkieHistoryCalendar />} />
                <Route path="friends" element={<GymJunkieFriends />} />
                <Route path="strava" element={<GymJunkieStrava />} />
              </Route>
              <Route path="changes" element={<GymJunkieChanges />} />
              <Route path="privacy" element={<GymJunkiePrivacyPolicy />} />
              <Route path="delete-me" element={<DeleteMe />} />
              <Route path="data-export" element={<DataExport />} />
            </Route>
            <Route path="/other">
              <Route index element={<Navigate to="/projects" replace />} />
              <Route path="downer-helper" element={<OtherDownerHelper />} />
              <Route path="cellular-tracking" element={<OtherCellularTracking />} />
              <Route path="postgres-deploy" element={<OtherPostgresDeploy />} />
              <Route path="imax-bot" element={<OtherImaxBot />} />
              <Route path="mcp-server" element={<OtherMcpServer />} />
              <Route path="smart-trainer" element={<OtherSmartTrainer />} />
              <Route path="arbitrage" element={<OtherArbitrage />} />
              <Route path="trading-strategies" element={<OtherTradingStrategies />} />
              <Route path="authenticator" element={<OtherAuthenticator />} />
              <Route path="event-picker" element={<OtherEventPicker />} />
            </Route>
          </Routes>
        </Box>
      </Box>
      <ChatWidget />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <AppShell />
      </Router>
    </ThemeProvider>
  );
}

export default App;
