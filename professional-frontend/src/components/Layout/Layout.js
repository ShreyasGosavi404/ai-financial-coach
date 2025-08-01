import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  AccountBalance as PortfolioIcon,
  Assessment as ReportsIcon,
  Menu as MenuIcon,
  AccountCircle,
  Settings,
  Logout,
  Notifications,
  TrendingUp,
  SmartToy as AIIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { checkBackendHealth } from '../../services/api';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/', color: '#1976d2' },
  { text: 'Financial Analysis', icon: <AnalyticsIcon />, path: '/analysis', color: '#9c27b0' },
  { text: 'AI Financial Coach', icon: <AIIcon />, path: '/ai-coach', color: '#4caf50' },
  { text: 'Portfolio', icon: <PortfolioIcon />, path: '/portfolio', color: '#2e7d32' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports', color: '#ed6c02' },
];

const Layout = ({ children, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount] = useState(3); // Mock notification count

  // Check backend connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await checkBackendHealth();
        setConnectionStatus('connected');
      } catch (error) {
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Handle profile menu
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Get connection status color and text
  const getConnectionStatus = () => {
    switch (connectionStatus) {
      case 'connected':
        return { color: 'success', text: 'Online' };
      case 'disconnected':
        return { color: 'error', text: 'Offline' };
      default:
        return { color: 'warning', text: 'Checking...' };
    }
  };

  // Drawer content
  const drawerContent = (
    <Box sx={{ width: drawerWidth, pt: 2 }}>
      {/* Logo and Brand */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
            }}
          >
            <TrendingUp />
          </Avatar>
          <Box>
            <Typography variant="h6" className="professional-heading">
              AI Financial Coach
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Professional Edition
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mx: 2, mb: 2 }} />

      {/* Navigation Menu */}
      <List sx={{ px: 2 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    borderLeft: `4px solid ${item.color}`,
                    '& .MuiListItemIcon-root': {
                      color: item.color,
                    },
                    '& .MuiListItemText-primary': {
                      color: item.color,
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 48 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>

      {/* Connection Status */}
      <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Server Status
            </Typography>
            <Chip
              label={getConnectionStatus().text}
              color={getConnectionStatus().color}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          ml: { md: drawerOpen ? `${drawerWidth}px` : 0 },
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          color: 'text.primary',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          {/* Header Actions */}
          <Box display="flex" alignItems="center" gap={1}>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton color="inherit" sx={{ position: 'relative' }}>
                <Notifications />
                {notificationCount > 0 && (
                  <Chip
                    label={notificationCount}
                    size="small"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      height: 18,
                      minWidth: 18,
                      fontSize: '0.75rem',
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <Tooltip title="Account settings">
              <IconButton
                color="inherit"
                onClick={handleProfileMenuOpen}
                sx={{ ml: 1 }}
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              onClick={handleProfileMenuClose}
              PaperProps={{
                elevation: 8,
                sx: {
                  borderRadius: 2,
                  mt: 1.5,
                  minWidth: 200,
                  '& .MuiMenuItem-root': {
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                  },
                },
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={onLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(15px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
