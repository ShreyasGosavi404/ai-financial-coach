import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  useTheme,
  Paper,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Savings,
  CreditCard,
  PieChart,
  Timeline,
  MoreVert,
  Add,
  AttachMoney,
  Assessment,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

// Mock data for dashboard
const mockFinancialData = {
  totalAssets: 125000,
  totalLiabilities: 45000,
  netWorth: 80000,
  monthlyIncome: 8500,
  monthlyExpenses: 6200,
  savingsRate: 27,
  creditScore: 750,
  emergencyFund: 18000,
  investments: 65000,
};

const monthlySpendingData = [
  { month: 'Jan', spending: 5800, income: 8500 },
  { month: 'Feb', spending: 6100, income: 8500 },
  { month: 'Mar', spending: 5900, income: 8500 },
  { month: 'Apr', spending: 6400, income: 8500 },
  { month: 'May', spending: 6200, income: 8500 },
  { month: 'Jun', spending: 6000, income: 8500 },
];

const expenseCategories = [
  { name: 'Housing', value: 2800, color: '#1976d2' },
  { name: 'Food', value: 800, color: '#2e7d32' },
  { name: 'Transportation', value: 650, color: '#ed6c02' },
  { name: 'Entertainment', value: 400, color: '#9c27b0' },
  { name: 'Utilities', value: 350, color: '#d32f2f' },
  { name: 'Other', value: 200, color: '#757575' },
];

const investmentPortfolio = [
  { name: 'Stocks', value: 38000, percentage: 58.5, change: 12.4 },
  { name: 'Bonds', value: 16000, percentage: 24.6, change: 3.2 },
  { name: 'Real Estate', value: 8000, percentage: 12.3, change: 8.7 },
  { name: 'Crypto', value: 3000, percentage: 4.6, change: -5.2 },
];

const MetricCard = ({ title, value, subtitle, icon, color, trend, trendValue }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="metric-card card-hover">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={color}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {subtitle}
                </Typography>
              )}
              {trend && (
                <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                  {trend === 'up' ? (
                    <TrendingUp sx={{ color: 'success.main', fontSize: 20, mr: 0.5 }} />
                  ) : (
                    <TrendingDown sx={{ color: 'error.main', fontSize: 20, mr: 0.5 }} />
                  )}
                  <Typography
                    variant="body2"
                    color={trend === 'up' ? 'success.main' : 'error.main'}
                    fontWeight="medium"
                  >
                    {trendValue}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    vs last month
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar
              sx={{
                bgcolor: `${color}.light`,
                color: `${color}.main`,
                width: 56,
                height: 56,
              }}
            >
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const QuickActionCard = ({ title, description, icon, action, color }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="card-hover" sx={{ height: '100%' }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Avatar
              sx={{
                bgcolor: `${color}.light`,
                color: `${color}.main`,
                width: 64,
                height: 64,
                mb: 2,
              }}
            >
              {icon}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {description}
            </Typography>
            <Button
              variant="contained"
              color={color}
              startIcon={<Add />}
              fullWidth
              onClick={action}
            >
              Get Started
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>
            Loading your financial dashboard...
          </Typography>
          <LinearProgress sx={{ width: 300, mt: 2 }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Header */}
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
              color: '#e1bee7', // Very light purple
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              background: 'linear-gradient(45deg, #e1bee7 30%, #f3e5f5 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Welcome back! 👋
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#ce93d8', // Light purple
              fontWeight: '600',
              fontSize: '1.3rem'
            }}
          >
            Here's an overview of your financial health
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Key Metrics Row */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Net Worth"
            value={`$${mockFinancialData.netWorth.toLocaleString()}`}
            subtitle="Total assets minus liabilities"
            icon={<AccountBalance />}
            color="primary"
            trend="up"
            trendValue="12.5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Monthly Income"
            value={`$${mockFinancialData.monthlyIncome.toLocaleString()}`}
            subtitle="After taxes and deductions"
            icon={<AttachMoney />}
            color="success"
            trend="up"
            trendValue="3.2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Savings Rate"
            value={`${mockFinancialData.savingsRate}%`}
            subtitle="Of monthly income saved"
            icon={<Savings />}
            color="info"
            trend="up"
            trendValue="2.1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Credit Score"
            value={mockFinancialData.creditScore}
            subtitle="Excellent credit rating"
            icon={<CreditCard />}
            color="warning"
            trend="up"
            trendValue="0.8"
          />
        </Grid>

        {/* Charts Row */}
        <Grid item xs={12} lg={8}>
          <Card className="chart-container">
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Income vs Expenses
                </Typography>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlySpendingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="1"
                    stroke="#4caf50"
                    fill="#4caf50"
                    fillOpacity={0.3}
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="spending"
                    stackId="2"
                    stroke="#f44336"
                    fill="#f44336"
                    fillOpacity={0.3}
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card className="chart-container">
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Expense Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </RechartsPieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                {expenseCategories.map((category, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          bgcolor: category.color,
                          borderRadius: '50%',
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2">{category.name}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      ${category.value.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Investment Portfolio */}
        <Grid item xs={12} lg={6}>
          <Card className="card-hover">
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Investment Portfolio
              </Typography>
              <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                ${mockFinancialData.investments.toLocaleString()}
              </Typography>
              {investmentPortfolio.map((investment, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {investment.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2">
                        ${investment.value.toLocaleString()}
                      </Typography>
                      <Chip
                        label={`${investment.change > 0 ? '+' : ''}${investment.change}%`}
                        color={investment.change > 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={investment.percentage}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {investment.percentage}% of portfolio
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={6}>
          <Card className="card-hover">
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <QuickActionCard
                    title="Financial Analysis"
                    description="Get personalized insights"
                    icon={<Assessment />}
                    color="primary"
                    action={() => window.location.href = '/analysis'}
                  />
                </Grid>
                <Grid item xs={6}>
                  <QuickActionCard
                    title="Track Expenses"
                    description="Monitor your spending"
                    icon={<PieChart />}
                    color="secondary"
                    action={() => window.location.href = '/portfolio'}
                  />
                </Grid>
                <Grid item xs={6}>
                  <QuickActionCard
                    title="Set Goals"
                    description="Plan your financial future"
                    icon={<Timeline />}
                    color="success"
                    action={() => window.location.href = '/reports'}
                  />
                </Grid>
                <Grid item xs={6}>
                  <QuickActionCard
                    title="Investment Tips"
                    description="Optimize your portfolio"
                    icon={<TrendingUp />}
                    color="warning"
                    action={() => window.location.href = '/portfolio'}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Health Score */}
        <Grid item xs={12}>
          <Card className="card-hover">
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Financial Health Score
              </Typography>
              <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h3" color="success.main" fontWeight="bold" sx={{ mr: 2 }}>
                  8.5
                </Typography>
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    Excellent Financial Health
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You're doing great! Keep up the good work.
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Emergency Fund
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={85}
                      color="success"
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" fontWeight="medium">
                      85% - Well funded
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Debt-to-Income
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={20}
                      color="success"
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" fontWeight="medium">
                      20% - Excellent
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Savings Rate
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={90}
                      color="success"
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" fontWeight="medium">
                      27% - Outstanding
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Investment Diversification
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      color="warning"
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" fontWeight="medium">
                      75% - Good
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
