import React, { useState } from 'react';
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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
} from '@mui/material';
import {
  CreditCard,
  TrendingDown,
  TrendingUp,
  CompareArrows,
  Info,
  CheckCircle,
  Warning,
  Timeline,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`debt-tabpanel-${index}`}
      aria-labelledby={`debt-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const DebtReductionDisplay = ({ reduction }) => {
  const [tabValue, setTabValue] = useState(0);

  if (!reduction) return null;

  const {
    total_debt = 0,
    debts = [],
    payoff_plans = {},
    recommendations = [],
  } = reduction;

  const { avalanche = {}, snowball = {} } = payoff_plans;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Create comparison data for charts
  const comparisonData = [
    {
      method: 'Avalanche',
      totalInterest: avalanche.total_interest || 0,
      monthsToPayoff: avalanche.months_to_payoff || 0,
      monthlyPayment: avalanche.monthly_payment || 0,
    },
    {
      method: 'Snowball',
      totalInterest: snowball.total_interest || 0,
      monthsToPayoff: snowball.months_to_payoff || 0,
      monthlyPayment: snowball.monthly_payment || 0,
    },
  ];

  // Sort debts for avalanche method (highest interest first)
  const avalancheOrder = [...debts].sort((a, b) => (b.interest_rate || 0) - (a.interest_rate || 0));
  
  // Sort debts for snowball method (smallest balance first)
  const snowballOrder = [...debts].sort((a, b) => (a.amount || 0) - (b.amount || 0));

  const getDebtRiskColor = (interestRate) => {
    if (interestRate >= 20) return 'error';
    if (interestRate >= 15) return 'warning';
    if (interestRate >= 10) return 'info';
    return 'success';
  };

  return (
    <Card className="fade-in">
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          💳 Debt Reduction Strategy
        </Typography>

        {/* Total Debt Overview */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'error.light' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="error.contrastText">
                  ${total_debt.toLocaleString()}
                </Typography>
                <Typography variant="h6" color="error.contrastText">
                  Total Debt
                </Typography>
                <Typography variant="body2" color="error.contrastText" sx={{ mt: 1 }}>
                  Across {debts.length} debt{debts.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" color="error.contrastText" gutterBottom>
                  Debt Breakdown
                </Typography>
                {debts.map((debt, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="error.contrastText">
                        {debt.name}
                      </Typography>
                      <Typography variant="body2" color="error.contrastText" fontWeight="bold">
                        ${debt.amount ? debt.amount.toLocaleString() : 0}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={total_debt > 0 ? (debt.amount / total_debt) * 100 : 0}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'white',
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Debt List */}
        {debts.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📋 Your Debts
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Debt Name</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell align="right">Interest Rate</TableCell>
                    <TableCell align="right">Min Payment</TableCell>
                    <TableCell align="center">Risk Level</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {debts.map((debt, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CreditCard color="action" />
                          {debt.name}
                        </Box>
                      </TableCell>
                      <TableCell align="right" fontWeight="bold">
                        ${debt.amount ? debt.amount.toLocaleString() : 0}
                      </TableCell>
                      <TableCell align="right">
                        {debt.interest_rate ? debt.interest_rate.toFixed(2) : 0}%
                      </TableCell>
                      <TableCell align="right">
                        ${debt.min_payment ? debt.min_payment.toLocaleString() : 0}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={
                            debt.interest_rate >= 20 ? 'High Risk' :
                            debt.interest_rate >= 15 ? 'Medium Risk' :
                            debt.interest_rate >= 10 ? 'Low Risk' : 'Very Low'
                          }
                          color={getDebtRiskColor(debt.interest_rate)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Payoff Strategy Comparison */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            📊 Payoff Method Comparison
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Total Interest Paid
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="totalInterest" fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Time to Debt Freedom
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} months`} />
                  <Bar dataKey="monthsToPayoff" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Box>

        {/* Detailed Strategies */}
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Avalanche Method" />
              <Tab label="Snowball Method" />
              <Tab label="Recommendations" />
            </Tabs>
          </Box>

          {/* Avalanche Method */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                🎯 Debt Avalanche Method
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Pay off debts with the highest interest rates first to minimize total interest paid.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Key Metrics
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Interest Paid
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="error.main">
                      ${avalanche.total_interest ? avalanche.total_interest.toLocaleString() : 0}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Time to Debt Freedom
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {avalanche.months_to_payoff || 0} months
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Recommended Monthly Payment
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      ${avalanche.monthly_payment ? avalanche.monthly_payment.toLocaleString() : 0}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Payment Order (Highest Interest First)
                  </Typography>
                  <List>
                    {avalancheOrder.map((debt, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: `hsl(${index * 60}, 70%, 50%)`, width: 32, height: 32, fontSize: '0.875rem' }}>
                              {index + 1}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={debt.name}
                            secondary={
                              <Box>
                                <Typography variant="body2" component="span">
                                  ${debt.amount ? debt.amount.toLocaleString() : 0} at {debt.interest_rate || 0}%
                                </Typography>
                                <Chip
                                  label={`${debt.interest_rate || 0}% APR`}
                                  color={getDebtRiskColor(debt.interest_rate)}
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < avalancheOrder.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Snowball Method */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                ⚡ Debt Snowball Method
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Pay off smallest balances first to build momentum and psychological wins.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Key Metrics
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Interest Paid
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="error.main">
                      ${snowball.total_interest ? snowball.total_interest.toLocaleString() : 0}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Time to Debt Freedom
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {snowball.months_to_payoff || 0} months
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Recommended Monthly Payment
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      ${snowball.monthly_payment ? snowball.monthly_payment.toLocaleString() : 0}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Payment Order (Smallest Balance First)
                  </Typography>
                  <List>
                    {snowballOrder.map((debt, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: `hsl(${index * 60}, 70%, 50%)`, width: 32, height: 32, fontSize: '0.875rem' }}>
                              {index + 1}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={debt.name}
                            secondary={
                              <Box>
                                <Typography variant="body2" component="span">
                                  ${debt.amount ? debt.amount.toLocaleString() : 0} at {debt.interest_rate || 0}%
                                </Typography>
                                <Chip
                                  label={`$${debt.amount ? debt.amount.toLocaleString() : 0}`}
                                  color="primary"
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < snowballOrder.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Recommendations */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              💡 AI Recommendations
            </Typography>
            {recommendations && recommendations.length > 0 ? (
              <List>
                {recommendations.map((rec, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={rec.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" paragraph>
                              {rec.description}
                            </Typography>
                            {rec.impact && (
                              <Chip
                                label={rec.impact}
                                color="info"
                                size="small"
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recommendations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Info sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No specific recommendations available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Continue following your chosen debt payoff strategy consistently.
                </Typography>
              </Paper>
            )}

            {/* General Tips */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                📚 General Debt Reduction Tips
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      💰 Increase Your Payments
                    </Typography>
                    <Typography variant="body2">
                      Even small additional payments can significantly reduce interest and payoff time.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      🔄 Consider Consolidation
                    </Typography>
                    <Typography variant="body2">
                      Look into debt consolidation options to potentially lower interest rates.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      📞 Negotiate with Creditors
                    </Typography>
                    <Typography variant="body2">
                      Contact creditors to discuss payment plans or interest rate reductions.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      🚫 Stop Using Credit
                    </Typography>
                    <Typography variant="body2">
                      Avoid adding new debt while working on your current balances.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DebtReductionDisplay;
