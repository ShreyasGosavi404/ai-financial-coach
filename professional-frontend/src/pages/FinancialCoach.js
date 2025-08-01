import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import FinanceForm from '../components/FinanceForm';
import ChatBox from '../components/ChatBox';

const FinancialCoach = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setError(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setAnalysisResult(null);
  };

  const handleLoadingChange = (loading) => {
    setIsLoading(loading);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            🤖 AI Financial Coach
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Get personalized financial advice powered by advanced AI
          </Typography>
          <Chip 
            label="Powered by Google Gemini AI" 
            color="primary" 
            variant="outlined"
            sx={{ fontSize: '0.9rem', py: 2 }}
          />
        </Box>
      </motion.div>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Finance Form Section */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3
              }}
            >
              <FinanceForm 
                onAnalysisComplete={handleAnalysisComplete}
                onError={handleError}
                onLoadingChange={handleLoadingChange}
              />
            </Paper>
          </motion.div>
        </Grid>

        {/* Chat Section */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                height: '100%',
                minHeight: 600,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3
              }}
            >
              <ChatBox 
                analysisResult={analysisResult}
                isLoading={isLoading}
                error={error}
              />
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Analysis Results Section */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Box mt={4}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 4, 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3
              }}
            >
              <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
                📈 Analysis Results
              </Typography>
              
              {/* Summary Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h6">💰 Monthly Income</Typography>
                      <Typography variant="h4">
                        ${analysisResult.monthly_income?.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h6">💸 Total Expenses</Typography>
                      <Typography variant="h4">
                        ${analysisResult.total_expenses?.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: (analysisResult.monthly_income - analysisResult.total_expenses) >= 0 
                      ? 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)' 
                      : 'linear-gradient(135deg, #F44336 0%, #EF5350 100%)',
                    color: 'white' 
                  }}>
                    <CardContent>
                      <Typography variant="h6">💳 Available Budget</Typography>
                      <Typography variant="h4">
                        ${(analysisResult.monthly_income - analysisResult.total_expenses)?.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h6">🎯 AI Analysis</Typography>
                      <Typography variant="h6">
                        {analysisResult.ai_analysis_available ? '✅ Active' : '⚠️ Basic Mode'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Spending Categories */}
              {analysisResult.budget_analysis?.spending_categories && analysisResult.budget_analysis.spending_categories.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    📊 Spending Categories
                  </Typography>
                  <Grid container spacing={2}>
                    {analysisResult.budget_analysis.spending_categories.map((category, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" color="primary">
                              {category.category || 'Unknown Category'}
                            </Typography>
                            <Typography variant="h5" color="text.primary">
                              ${(category.amount || 0).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {(category.percentage || 0).toFixed(1)}% of total
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* AI Recommendations */}
              {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                <Box mt={4}>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom color="primary">
                    🎯 AI Recommendations
                  </Typography>
                  {analysisResult.recommendations.map((rec, index) => (
                    <Alert key={index} severity="info" sx={{ mb: 2 }}>
                      {typeof rec === 'string' ? rec : rec.recommendation || rec.description || JSON.stringify(rec)}
                    </Alert>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box mt={2}>
            <Alert severity="error">
              {error}
            </Alert>
          </Box>
        </motion.div>
      )}
    </Container>
  );
};

export default FinancialCoach;
