import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Avatar,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  MoreVert,
  TrendingUp,
  TrendingDown,
  Add,
  Edit,
  Delete,
  PieChart,
  Timeline,
  AccountBalance,
  Assessment,
  Savings,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Pie,
} from 'recharts';

// Mock portfolio data
const mockPortfolioData = {
  totalValue: 85000,
  totalGain: 12500,
  gainPercentage: 17.2,
  assets: [
    {
      id: 1,
      name: 'Stock Portfolio',
      type: 'Stocks',
      value: 45000,
      allocation: 52.9,
      gain: 8500,
      gainPercent: 23.3,
      color: '#1976d2',
    },
    {
      id: 2,
      name: 'Bond Fund',
      type: 'Bonds',
      value: 20000,
      allocation: 23.5,
      gain: 1200,
      gainPercent: 6.4,
      color: '#2e7d32',
    },
    {
      id: 3,
      name: 'Real Estate Investment',
      type: 'Real Estate',
      value: 15000,
      allocation: 17.6,
      gain: 2300,
      gainPercent: 18.1,
      color: '#ed6c02',
    },
    {
      id: 4,
      name: 'Cryptocurrency',
      type: 'Crypto',
      value: 5000,
      allocation: 5.9,
      gain: 500,
      gainPercent: 11.1,
      color: '#9c27b0',
    },
  ],
  performance: [
    { month: 'Jan', value: 72000 },
    { month: 'Feb', value: 74500 },
    { month: 'Mar', value: 71800 },
    { month: 'Apr', value: 76200 },
    { month: 'May', value: 79800 },
    { month: 'Jun', value: 85000 },
  ],
  goals: [
    {
      id: 1,
      name: 'Emergency Fund',
      target: 25000,
      current: 18000,
      deadline: '2024-12-31',
      priority: 'high',
    },
    {
      id: 2,
      name: 'House Down Payment',
      target: 80000,
      current: 35000,
      deadline: '2026-06-30',
      priority: 'medium',
    },
    {
      id: 3,
      name: 'Retirement Fund',
      target: 1000000,
      current: 85000,
      deadline: '2054-12-31',
      priority: 'low',
    },
  ],
};

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`portfolio-tabpanel-${index}`}
      aria-labelledby={`portfolio-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const AssetCard = ({ asset, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="card-hover">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: asset.color,
                  width: 48,
                  height: 48,
                }}
              >
                {asset.type === 'Stocks' && <TrendingUp />}
                {asset.type === 'Bonds' && <AccountBalance />}
                {asset.type === 'Real Estate' && <PieChart />}
                {asset.type === 'Crypto' && <Timeline />}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {asset.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {asset.type}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                ${asset.value.toLocaleString()}
              </Typography>
              <Chip
                label={`${asset.gainPercent > 0 ? '+' : ''}${asset.gainPercent}%`}
                color={asset.gainPercent > 0 ? 'success' : 'error'}
                icon={asset.gainPercent > 0 ? <TrendingUp /> : <TrendingDown />}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Portfolio Allocation
            </Typography>
            <LinearProgress
              variant="determinate"
              value={asset.allocation}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: asset.color,
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {asset.allocation}% • ${asset.gain > 0 ? '+' : ''}
              {asset.gain.toLocaleString()} gain
            </Typography>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { onEdit(asset); handleMenuClose(); }}>
              <Edit sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => { onDelete(asset.id); handleMenuClose(); }}>
              <Delete sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const GoalCard = ({ goal, onEdit }) => {
  const progress = (goal.current / goal.target) * 100;
  const remaining = goal.target - goal.current;
  const daysUntilDeadline = Math.ceil(
    (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'primary';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="card-hover">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {goal.name}
              </Typography>
              <Chip
                label={goal.priority.toUpperCase()}
                color={getPriorityColor(goal.priority)}
                size="small"
              />
            </Box>
            <IconButton onClick={() => onEdit(goal)} size="small">
              <Edit />
            </IconButton>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {progress.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={getPriorityColor(goal.priority)}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                ${goal.current.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${goal.target.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body2" color="text.secondary">
                Remaining
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                ${remaining.toLocaleString()}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="body2" color="text.secondary">
                Deadline
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {daysUntilDeadline} days
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Portfolio = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditAsset = (asset) => {
    setSelectedAsset(asset);
    setEditDialogOpen(true);
  };

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setGoalDialogOpen(true);
  };

  const handleDeleteAsset = (assetId) => {
    // Handle asset deletion
    console.log('Delete asset:', assetId);
  };

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            className="professional-heading" 
            gutterBottom
            sx={{
              color: '#f5f5f5', // Pure white
              fontWeight: '500', // Normal weight (not bold)
              fontSize: '2.5rem',
              letterSpacing: '-0.5px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)', // Sharper, more defined shadow
              
            }}
          >
            Portfolio & Goals 📈
          </Typography>
          <Typography 
            variant="h6" 
            sx={{
              color: '#f5f5f5', // Very light gray (almost white)
              fontWeight: '500',
              fontSize: '1.2rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)' // Subtle shadow for readability
            }}
          >
            Track your investments and financial goals
          </Typography>
        </Box>
      </motion.div>

      {/* Portfolio Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card className="metric-card">
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Portfolio Value
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="primary">
                ${mockPortfolioData.totalValue.toLocaleString()}
              </Typography>
              <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                <TrendingUp sx={{ color: 'success.main', fontSize: 20, mr: 0.5 }} />
                <Typography variant="body2" color="success.main" fontWeight="medium">
                  +${mockPortfolioData.totalGain.toLocaleString()} ({mockPortfolioData.gainPercentage}%)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card className="chart-container">
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Portfolio Performance
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={mockPortfolioData.performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#1976d2"
                    fill="#1976d2"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Assets" />
              <Tab label="Goals" />
              <Tab label="Analytics" />
            </Tabs>
          </Box>

          {/* Assets Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Investment Assets
              </Typography>
              <Button variant="contained" startIcon={<Add />}>
                Add Asset
              </Button>
            </Box>

            <Grid container spacing={3}>
              {mockPortfolioData.assets.map((asset) => (
                <Grid item xs={12} md={6} lg={4} key={asset.id}>
                  <AssetCard
                    asset={asset}
                    onEdit={handleEditAsset}
                    onDelete={handleDeleteAsset}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Asset Allocation Chart */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Asset Allocation
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={mockPortfolioData.assets}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {mockPortfolioData.assets.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    {mockPortfolioData.assets.map((asset, index) => (
                      <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Box display="flex" alignItems="center">
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              bgcolor: asset.color,
                              borderRadius: '50%',
                              mr: 2,
                            }}
                          />
                          <Typography variant="body1">{asset.name}</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="medium">
                          {asset.allocation}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Goals Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Financial Goals
              </Typography>
              <Button variant="contained" startIcon={<Add />}>
                Add Goal
              </Button>
            </Box>

            <Grid container spacing={3}>
              {mockPortfolioData.goals.map((goal) => (
                <Grid item xs={12} md={6} lg={4} key={goal.id}>
                  <GoalCard goal={goal} onEdit={handleEditGoal} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Portfolio Analytics
            </Typography>
            
            <Grid container spacing={3}>
              {/* Risk Assessment */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Risk Assessment
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Portfolio Risk Level
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={65}
                      color="warning"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Moderate Risk (65/100)
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Your portfolio has a balanced risk profile with good diversification across asset classes.
                  </Typography>
                </Paper>
              </Grid>

              {/* Performance Metrics */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Box>
                    <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2">Annual Return</Typography>
                      <Typography variant="body2" fontWeight="medium">17.2%</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2">Sharpe Ratio</Typography>
                      <Typography variant="body2" fontWeight="medium">1.34</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2">Max Drawdown</Typography>
                      <Typography variant="body2" fontWeight="medium">-8.5%</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Volatility</Typography>
                      <Typography variant="body2" fontWeight="medium">12.8%</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Edit Asset Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Asset</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Asset Name"
            defaultValue={selectedAsset?.name}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Current Value"
            type="number"
            defaultValue={selectedAsset?.value}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Asset Type</InputLabel>
            <Select
              value={selectedAsset?.type || ''}
              label="Asset Type"
            >
              <MenuItem value="Stocks">Stocks</MenuItem>
              <MenuItem value="Bonds">Bonds</MenuItem>
              <MenuItem value="Real Estate">Real Estate</MenuItem>
              <MenuItem value="Crypto">Cryptocurrency</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={goalDialogOpen} onClose={() => setGoalDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Goal</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Goal Name"
            defaultValue={selectedGoal?.name}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Target Amount"
            type="number"
            defaultValue={selectedGoal?.target}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Current Amount"
            type="number"
            defaultValue={selectedGoal?.current}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Deadline"
            type="date"
            defaultValue={selectedGoal?.deadline}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGoalDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Portfolio;
