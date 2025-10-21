import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AppToolbar from './components/AppToolbar'
import Home from './pages/Home'
import Contact from './pages/Contact'
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from "./styles/theme";

function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          <AppToolbar isDark={isDark} setIsDark={setIsDark}/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
