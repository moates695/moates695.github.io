import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AppToolbar from './components/AppToolbar'
import Home from './pages/Home'
import Contact from './pages/Contact'
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from "./styles/theme";
import FinksaOverview from './pages/finska/Overview';
import FinksaDesign from './pages/finska/Design';
import GymJunkieOverview from './pages/gym_junkie/Overview';
import GymJunkieFunctionality from './pages/gym_junkie/Functionality';
import OtherAll from './pages/other/All';
import OtherDownerHelper from './pages/other/DownerHelper';
import OtherCellularTracking from './pages/other/CellularTracking';
import FinksaChanges from './pages/finska/Changes';
import GymJunkieChanges from './pages/gym_junkie/Changes';
import OtherPostgresDeploy from './pages/other/PostgresDeploy';
import PrivacyPolicy from './pages/finska/PrivacyPolicy';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  console.log(isMobile)

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            height: "100vh",
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <AppToolbar isDark={isDark} setIsDark={setIsDark}/>
          <Box
            sx={{
              width: '100%',
              maxWidth: 1220,
              paddingTop: '10px',
              paddingLeft: '20px',
              paddingRight: '20px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              // justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/finska">
                <Route index element={<FinksaOverview />} />
                <Route path="design" element={<FinksaDesign />} />
                <Route path="changes" element={<FinksaChanges />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
              </Route>
              <Route path="/gym-junkie">
                <Route index element={<GymJunkieOverview />} />
                <Route path="functionality" element={<GymJunkieFunctionality />} />
                <Route path="changes" element={<GymJunkieChanges />} />
              </Route>
              <Route path="/other">
                <Route index element={<OtherAll />} />
                <Route path="downer-helper" element={<OtherDownerHelper />} />
                <Route path="cellular-tracking" element={<OtherCellularTracking />} />
                <Route path="postgres-deploy" element={<OtherPostgresDeploy />} />
              </Route>
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
