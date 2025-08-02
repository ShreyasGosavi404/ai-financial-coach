import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Box, Typography, CircularProgress } from '@mui/material';

// Import components
import Login from './components/Login';
import AnimatedBackground from './components/AnimatedBackground';
import authService from './services/authService';

// Import pages with error handling
let Dashboard, FinancialAnalysis, FinancialCoach, Portfolio, Reports, Layout;

try {
  Dashboard = require('./pages/Dashboard').default;
  FinancialAnalysis = require('./pages/FinancialAnalysis').default;
  FinancialCoach = require('./pages/FinancialCoach').default;
  Portfolio = require('./pages/Portfolio').default;
  Reports = require('./pages/Reports').default;
  Layout = require('./components/Layout/Layout').default;
} catch (error) {
  console.error('Error loading components:', error);
  // Fallback components
  Dashboard = () => <Typography variant="h4">Dashboard Loading...</Typography>;
  FinancialAnalysis = () => <Typography variant="h4">Financial Analysis Loading...</Typography>;
  FinancialCoach = () => <Typography variant="h4">AI Coach Loading...</Typography>;
  Portfolio = () => <Typography variant="h4">Portfolio Loading...</Typography>;
  Reports = () => <Typography variant="h4">Reports Loading...</Typography>;
  Layout = ({ children }) => <Box sx={{ p: 2 }}>{children}</Box>;
}

// Enhanced theme with better colors and typography
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#f06292',
      dark: '#c51162',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userEmail = localStorage.getItem('userEmail');
      
      if (token && userEmail) {
        setIsAuthenticated(true);
        setUser({ email: userEmail });
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (success) => {
    if (success) {
      setIsAuthenticated(true);
      const userEmail = localStorage.getItem('userEmail');
      setUser({ email: userEmail });
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AnimatedBackground />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          sx={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography variant="h6" sx={{ 
            color: 'white', 
            textShadow: '0 0 20px rgba(255,255,255,0.8)',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            Loading AI Financial Coach...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatedBackground />
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Layout user={user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analysis" element={<FinancialAnalysis />} />
            <Route path="/ai-coach" element={<FinancialCoach />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </ThemeProvider>
  );
}

export default App;
