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
  Avatar,
} from '@mui/material';
import {
  Savings,
  Security,
  AutoMode,
  TrendingUp,
  CheckCircle,
  Info,
  AccountBalance,
} from '@mui/icons-material';

const SavingsStrategyDisplay = ({ strategy }) => {
  if (!strategy) return null;

  const {
    emergency_fund = {},
    recommendations = [],
    automation_techniques = [],
  } = strategy;

  const {
    recommended_amount = 0,
    current_amount = 0,
    current_status = 'Not started',
  } = emergency_fund;

  const emergencyFundProgress = recommended_amount > 0 ? (current_amount / recommended_amount) * 100 : 0;

  // Calculate total recommended savings
  const totalMonthlySavings = recommendations.reduce((sum, rec) => sum + (rec.amount || 0), 0);

  const getStatusColor = (status) => {
    if (status.toLowerCase().includes('excellent') || status.toLowerCase().includes('adequate')) return 'success';
    if (status.toLowerCase().includes('partially') || status.toLowerCase().includes('building')) return 'warning';
    return 'error';
  };

  return (
    <Card className="fade-in">
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          📈 Savings Strategy
        </Typography>

        {/* Emergency Fund Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            🛡️ Emergency Fund
          </Typography>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                    ${recommended_amount.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Recommended Emergency Fund
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    (6 months of expenses)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="body1" fontWeight="medium">
                      Current Progress
                    </Typography>
                    <Chip
                      label={current_status}
                      color={getStatusColor(current_status)}
                      icon={emergencyFundProgress >= 100 ? <CheckCircle /> : <Info />}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, emergencyFundProgress)}
                    color={getStatusColor(current_status)}
                    sx={{ height: 12, borderRadius: 6, mb: 2 }}
                  />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      ${current_amount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {emergencyFundProgress.toFixed(1)}% Complete
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Savings Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              💰 Monthly Savings Plan
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  ${totalMonthlySavings.toLocaleString()}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Total Recommended Monthly Savings
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                {recommendations.map((rec, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        border: 2,
                        borderColor: 'primary.light',
                        borderRadius: 2,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {rec.category}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          ${rec.amount ? rec.amount.toLocaleString() : 0}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {rec.rationale || 'No description available'}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        )}

        {/* Automation Techniques */}
        {automation_techniques && automation_techniques.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🤖 Automation Strategies
            </Typography>
            <List>
              {automation_techniques.map((technique, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main' }}>
                        <AutoMode />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {technique.name}
                        </Typography>
                      }
                      secondary={technique.description}
                    />
                  </ListItem>
                  {index < automation_techniques.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}

        {/* Savings Goals Progress */}
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            🎯 Savings Goals Progress
          </Typography>
          <Grid container spacing={3}>
            {/* Short-term Goals */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
                <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
                  <Security />
                </Avatar>
                <Typography variant="h6" fontWeight="bold" color="info.contrastText">
                  Emergency Fund
                </Typography>
                <Typography variant="body2" color="info.contrastText" sx={{ mb: 2 }}>
                  3-6 months expenses
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, emergencyFundProgress)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'white',
                    },
                  }}
                />
                <Typography variant="body2" color="info.contrastText" sx={{ mt: 1 }}>
                  {emergencyFundProgress.toFixed(1)}% Complete
                </Typography>
              </Paper>
            </Grid>

            {/* Medium-term Goals */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Typography variant="h6" fontWeight="bold" color="warning.contrastText">
                  Investment Fund
                </Typography>
                <Typography variant="body2" color="warning.contrastText" sx={{ mb: 2 }}>
                  Building wealth
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'white',
                    },
                  }}
                />
                <Typography variant="body2" color="warning.contrastText" sx={{ mt: 1 }}>
                  75% Complete
                </Typography>
              </Paper>
            </Grid>

            {/* Long-term Goals */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                  <AccountBalance />
                </Avatar>
                <Typography variant="h6" fontWeight="bold" color="success.contrastText">
                  Retirement
                </Typography>
                <Typography variant="body2" color="success.contrastText" sx={{ mb: 2 }}>
                  Long-term security
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={40}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'white',
                    },
                  }}
                />
                <Typography variant="body2" color="success.contrastText" sx={{ mt: 1 }}>
                  40% Complete
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Action Items */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            📋 Next Steps
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Set up automatic transfers"
                secondary="Automate your savings to ensure consistent progress"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Review and adjust monthly"
                secondary="Monitor your progress and adjust savings amounts as needed"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Optimize for high-yield accounts"
                secondary="Ensure your savings are earning competitive interest rates"
              />
            </ListItem>
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SavingsStrategyDisplay;
