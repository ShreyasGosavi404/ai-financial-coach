import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Box } from '@mui/material';

// Import components
import Login from './components/Login';
import FinanceForm from './components/FinanceForm';
import authService from './services/authService';

// Simple theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (success) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          Loading...
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box minHeight="100vh" bgcolor="#f5f5f5">
        {!isAuthenticated ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route path="/" element={
              <Box>
                <Box sx={{ p: 2, textAlign: 'right' }}>
                  <button onClick={handleLogout}>Logout</button>
                </Box>
                <FinanceForm />
              </Box>
            } />
            <Route path="*" element={
              <Box>
                <Box sx={{ p: 2, textAlign: 'right' }}>
                  <button onClick={handleLogout}>Logout</button>
                </Box>
                <FinanceForm />
              </Box>
            } />
          </Routes>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
