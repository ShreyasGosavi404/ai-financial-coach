import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  PieChart,
  Assessment,
} from '@mui/icons-material';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

const colorPalette = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#757575'];

const BudgetAnalysisDisplay = ({ analysis }) => {
  if (!analysis) return null;

  const {
    total_expenses = 0,
    monthly_income = 0,
    spending_categories = [],
    recommendations = [],
  } = analysis;

  const surplus = monthly_income - total_expenses;
  const savingsRate = monthly_income > 0 ? ((surplus / monthly_income) * 100).toFixed(1) : 0;

  // Prepare data for charts
  const categoryData = spending_categories.map((cat, index) => ({
    ...cat,
    color: colorPalette[index % colorPalette.length],
  }));

  const incomeVsExpenses = [
    { name: 'Income', amount: monthly_income, color: '#4caf50' },
    { name: 'Expenses', amount: total_expenses, color: '#f44336' },
    { name: 'Surplus', amount: Math.max(0, surplus), color: '#2196f3' },
  ];

  return (
    <Card className="fade-in">
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          💰 Budget Analysis
        </Typography>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
              <Typography variant="h4" fontWeight="bold" color="success.contrastText">
                ${monthly_income.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="success.contrastText">
                Monthly Income
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
              <Typography variant="h4" fontWeight="bold" color="error.contrastText">
                ${total_expenses.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="error.contrastText">
                Total Expenses
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: surplus >= 0 ? 'info.light' : 'warning.light' }}>
              <Typography variant="h4" fontWeight="bold" color={surplus >= 0 ? 'info.contrastText' : 'warning.contrastText'}>
                ${Math.abs(surplus).toLocaleString()}
              </Typography>
              <Typography variant="body2" color={surplus >= 0 ? 'info.contrastText' : 'warning.contrastText'}>
                {surplus >= 0 ? 'Surplus' : 'Deficit'}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
              <Typography variant="h4" fontWeight="bold" color="primary.contrastText">
                {savingsRate}%
              </Typography>
              <Typography variant="body2" color="primary.contrastText">
                Savings Rate
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Spending Categories Pie Chart */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Spending by Category
            </Typography>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <PieChart sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No spending data available
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Income vs Expenses Bar Chart */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Income vs Expenses
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeVsExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="amount" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>

        {/* Category Details */}
        {categoryData.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Category Breakdown
            </Typography>
            <Grid container spacing={2}>
              {categoryData.map((category, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            bgcolor: category.color,
                            borderRadius: '50%',
                          }}
                        />
                        <Typography variant="body1" fontWeight="medium">
                          {category.category}
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        ${category.amount.toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={category.percentage || 0}
                      sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.200' }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {(category.percentage || 0).toFixed(1)}% of total expenses
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              💡 AI Recommendations
            </Typography>
            <List>
              {recommendations.map((rec, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      {rec.potential_savings && rec.potential_savings > 0 ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Warning color="warning" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" fontWeight="medium">
                            {rec.category}
                          </Typography>
                          {rec.potential_savings && rec.potential_savings > 0 && (
                            <Chip
                              label={`Save $${rec.potential_savings.toLocaleString()}/month`}
                              color="success"
                              size="small"
                            />
                          )}
                        </Box>
                      }
                      secondary={rec.recommendation}
                    />
                  </ListItem>
                  {index < recommendations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}

        {/* Financial Health Indicators */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            📊 Financial Health Indicators
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Savings Rate
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, savingsRate)}
                  color={savingsRate >= 20 ? 'success' : savingsRate >= 10 ? 'warning' : 'error'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {savingsRate}% {savingsRate >= 20 ? '(Excellent)' : savingsRate >= 10 ? '(Good)' : '(Needs Improvement)'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Expense Ratio
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={monthly_income > 0 ? (total_expenses / monthly_income) * 100 : 0}
                  color={total_expenses / monthly_income <= 0.8 ? 'success' : 'warning'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {monthly_income > 0 ? ((total_expenses / monthly_income) * 100).toFixed(1) : 0}% of income
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Budget Balance
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={surplus >= 0 ? 100 : 50}
                  color={surplus >= 0 ? 'success' : 'error'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {surplus >= 0 ? 'Balanced' : 'Over Budget'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BudgetAnalysisDisplay;
