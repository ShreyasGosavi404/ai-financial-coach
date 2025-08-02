import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Import components
import Login from './components/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import FinancialAnalysis from './pages/FinancialAnalysis';
import FinancialCoach from './pages/FinancialCoach';
import Portfolio from './pages/Portfolio';
import Reports from './pages/Reports';
import authService from './services/authService';

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              width: 50,
              height: 50,
              border: '3px solid rgba(255,255,255,0.3)',
              borderTop: '3px solid white',
              borderRadius: '50%',
            }}
          />
        </motion.div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <Login onLogin={handleLogin} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  );
}

export default App;
