import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  IconButton,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import {
  Download,
  Share,
  Print,
  Assessment,
  TrendingUp,
  PieChart,
  BarChart,
  Timeline,
  CalendarToday,
  FileDownload,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from 'recharts';

// Mock report data
const mockReportData = {
  monthly: {
    income: [
      { month: 'Jan', income: 8500, expenses: 6200, savings: 2300 },
      { month: 'Feb', income: 8500, expenses: 6100, savings: 2400 },
      { month: 'Mar', income: 8500, expenses: 6400, savings: 2100 },
      { month: 'Apr', income: 8500, expenses: 5900, savings: 2600 },
      { month: 'May', income: 8500, expenses: 6200, savings: 2300 },
      { month: 'Jun', income: 8500, expenses: 6000, savings: 2500 },
    ],
    expenses: [
      { category: 'Housing', amount: 2800, percentage: 45.2 },
      { category: 'Food', amount: 800, percentage: 12.9 },
      { category: 'Transportation', amount: 650, percentage: 10.5 },
      { category: 'Entertainment', amount: 400, percentage: 6.5 },
      { category: 'Utilities', amount: 350, percentage: 5.6 },
      { category: 'Other', amount: 1200, percentage: 19.4 },
    ],
    netWorth: [
      { month: 'Jan', assets: 120000, liabilities: 48000, netWorth: 72000 },
      { month: 'Feb', assets: 122000, liabilities: 47000, netWorth: 75000 },
      { month: 'Mar', assets: 121000, liabilities: 46500, netWorth: 74500 },
      { month: 'Apr', assets: 125000, liabilities: 46000, netWorth: 79000 },
      { month: 'May', assets: 127000, liabilities: 45500, netWorth: 81500 },
      { month: 'Jun', assets: 130000, liabilities: 45000, netWorth: 85000 },
    ],
  },
  insights: [
    {
      type: 'positive',
      title: 'Excellent Savings Rate',
      description: 'Your 27% savings rate is well above the recommended 20%.',
      impact: 'high',
    },
    {
      type: 'warning',
      title: 'High Housing Costs',
      description: 'Housing expenses are 33% of income, consider optimization.',
      impact: 'medium',
    },
    {
      type: 'info',
      title: 'Investment Growth',
      description: 'Your investment portfolio has grown 17.2% this year.',
      impact: 'high',
    },
    {
      type: 'negative',
      title: 'Emergency Fund Gap',
      description: 'Consider increasing emergency fund to 6 months of expenses.',
      impact: 'medium',
    },
  ],
};

const colorPalette = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#757575'];

const ReportCard = ({ title, description, icon, action, color = 'primary' }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="card-hover">
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: `${color}.light`,
                color: `${color}.main`,
                width: 48,
                height: 48,
              }}
            >
              {icon}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6" fontWeight="bold">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color={color}
            fullWidth
            onClick={action}
            startIcon={<FileDownload />}
          >
            Generate Report
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const InsightCard = ({ insight }) => {
  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return 'success';
      case 'warning': return 'warning';
      case 'negative': return 'error';
      default: return 'info';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive': return '✅';
      case 'warning': return '⚠️';
      case 'negative': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper sx={{ p: 2, mb: 2, borderLeft: `4px solid`, borderLeftColor: `${getInsightColor(insight.type)}.main` }}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Typography variant="h6" sx={{ mt: 0.5 }}>
            {getInsightIcon(insight.type)}
          </Typography>
          <Box flex={1}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {insight.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {insight.description}
            </Typography>
            <Chip
              label={`${insight.impact.toUpperCase()} IMPACT`}
              color={getInsightColor(insight.type)}
              size="small"
            />
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

const Reports = () => {
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState('6months');
  const [selectedReport, setSelectedReport] = useState(null);

  const generateReport = (type) => {
    console.log(`Generating ${type} report...`);
    setSelectedReport(type);
  };

  const downloadReport = (format) => {
    console.log(`Downloading report in ${format} format...`);
  };

  const shareReport = () => {
    console.log('Sharing report...');
  };

  const printReport = () => {
    window.print();
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
          <Typography variant="h3" className="professional-heading" gutterBottom>
            Financial Reports 📋
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Generate comprehensive financial reports and insights
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Report Configuration */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Report Settings
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="monthly">Monthly Summary</MenuItem>
                  <MenuItem value="quarterly">Quarterly Review</MenuItem>
                  <MenuItem value="annual">Annual Report</MenuItem>
                  <MenuItem value="custom">Custom Period</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  label="Date Range"
                >
                  <MenuItem value="3months">Last 3 Months</MenuItem>
                  <MenuItem value="6months">Last 6 Months</MenuItem>
                  <MenuItem value="12months">Last 12 Months</MenuItem>
                  <MenuItem value="ytd">Year to Date</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>

              {dateRange === 'custom' && (
                <>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                </>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Quick Reports
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <ReportCard
                    title="Income Analysis"
                    description="Detailed income breakdown"
                    icon={<TrendingUp />}
                    color="success"
                    action={() => generateReport('income')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ReportCard
                    title="Expense Report"
                    description="Spending analysis"
                    icon={<PieChart />}
                    color="warning"
                    action={() => generateReport('expenses')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ReportCard
                    title="Net Worth"
                    description="Assets vs liabilities"
                    icon={<BarChart />}
                    color="info"
                    action={() => generateReport('networth')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ReportCard
                    title="Investment Performance"
                    description="Portfolio analysis"
                    icon={<Timeline />}
                    color="secondary"
                    action={() => generateReport('investments')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🤖 AI Insights
              </Typography>
              {mockReportData.insights.map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Report Display */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Financial Dashboard - Last 6 Months
                </Typography>
                <Box display="flex" gap={1}>
                  <IconButton onClick={() => downloadReport('pdf')} title="Download PDF">
                    <Download />
                  </IconButton>
                  <IconButton onClick={shareReport} title="Share Report">
                    <Share />
                  </IconButton>
                  <IconButton onClick={printReport} title="Print Report">
                    <Print />
                  </IconButton>
                </Box>
              </Box>

              {/* Income vs Expenses Chart */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Monthly Income vs Expenses
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockReportData.monthly.income}>
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
                      fillOpacity={0.6}
                      name="Income"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stackId="2"
                      stroke="#f44336"
                      fill="#f44336"
                      fillOpacity={0.6}
                      name="Expenses"
                    />
                    <Area
                      type="monotone"
                      dataKey="savings"
                      stackId="3"
                      stroke="#2196f3"
                      fill="#2196f3"
                      fillOpacity={0.6}
                      name="Savings"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>

              {/* Expense Breakdown */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Expense Categories
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={mockReportData.monthly.expenses}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="amount"
                      >
                        {mockReportData.monthly.expenses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Category Breakdown
                  </Typography>
                  <List>
                    {mockReportData.monthly.expenses.map((expense, index) => (
                      <ListItem key={index} divider>
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              bgcolor: colorPalette[index % colorPalette.length],
                              borderRadius: '50%',
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={expense.category}
                          secondary={`${expense.percentage}%`}
                        />
                        <Typography variant="body1" fontWeight="medium">
                          ${expense.amount.toLocaleString()}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>

              {/* Net Worth Trend */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Net Worth Progress
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockReportData.monthly.netWorth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="assets"
                      stroke="#4caf50"
                      strokeWidth={3}
                      name="Assets"
                    />
                    <Line
                      type="monotone"
                      dataKey="liabilities"
                      stroke="#f44336"
                      strokeWidth={3}
                      name="Liabilities"
                    />
                    <Line
                      type="monotone"
                      dataKey="netWorth"
                      stroke="#2196f3"
                      strokeWidth={4}
                      name="Net Worth"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              {/* Key Metrics Summary */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Key Financial Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        27%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Savings Rate
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        $85K
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Net Worth
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main" fontWeight="bold">
                        3.1x
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Emergency Fund Ratio
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="info.main" fontWeight="bold">
                        17.2%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Investment Return
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
