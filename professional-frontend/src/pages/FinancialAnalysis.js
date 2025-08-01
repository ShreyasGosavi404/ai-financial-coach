import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Alert,
  LinearProgress,
  IconButton,
  Chip,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore,
  Add,
  Delete,
  Upload,
  Analytics,
  TrendingUp,
  Assessment,
  AccountBalance,
  Savings,
  CreditCard,
  Info,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeFinances, uploadCSV } from '../services/api';

// Professional Results Display Components
import BudgetAnalysisDisplay from '../components/Analysis/BudgetAnalysisDisplay';
import SavingsStrategyDisplay from '../components/Analysis/SavingsStrategyDisplay';
import DebtReductionDisplay from '../components/Analysis/DebtReductionDisplay';

const steps = [
  'Basic Information',
  'Income & Expenses',
  'Debt Information',
  'Analysis Results',
];

const FinancialAnalysis = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  
  // Form data
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [dependants, setDependants] = useState('');
  const [expenses, setExpenses] = useState({
    Housing: '',
    Food: '',
    Transportation: '',
    Entertainment: '',
    Utilities: '',
    Healthcare: '',
    Shopping: '',
    Insurance: '',
    Other: '',
  });
  const [debts, setDebts] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [analysisMethod, setAnalysisMethod] = useState('manual'); // 'manual' or 'csv'

  // Handle expense changes
  const handleExpenseChange = (category, value) => {
    setExpenses(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  // Handle debt management
  const addDebt = () => {
    setDebts(prev => [...prev, {
      name: '',
      amount: '',
      interest_rate: '',
      min_payment: '',
    }]);
  };

  const updateDebt = (index, field, value) => {
    setDebts(prev => prev.map((debt, i) => 
      i === index ? { ...debt, [field]: value } : debt
    ));
  };

  const removeDebt = (index) => {
    setDebts(prev => prev.filter((_, i) => i !== index));
  };

  // Handle CSV file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setError('');
    } else {
      setError('Please upload a valid CSV file');
    }
  };

  // Validate current step
  const validateStep = (step) => {
    switch (step) {
      case 0:
        return monthlyIncome && parseFloat(monthlyIncome) > 0;
      case 1:
        if (analysisMethod === 'csv') {
          return csvFile !== null;
        } else {
          return Object.values(expenses).some(value => value && parseFloat(value) > 0);
        }
      case 2:
        return true; // Debts are optional
      default:
        return true;
    }
  };

  // Handle step navigation
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      setError('');
    } else {
      setError('Please fill in the required information before proceeding');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  // Handle analysis
  const handleAnalyze = async () => {
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (analysisMethod === 'csv' && csvFile) {
        result = await uploadCSV(csvFile, parseFloat(monthlyIncome), parseInt(dependants) || 0);
      } else {
        // Process manual expenses
        const manual_expenses = {};
        Object.entries(expenses).forEach(([key, value]) => {
          if (value && parseFloat(value) > 0) {
            manual_expenses[key] = parseFloat(value);
          }
        });

        // Process debts
        const processedDebts = debts
          .filter(debt => debt.name && debt.amount && debt.interest_rate)
          .map(debt => ({
            ...debt,
            amount: parseFloat(debt.amount),
            interest_rate: parseFloat(debt.interest_rate),
            min_payment: debt.min_payment ? parseFloat(debt.min_payment) : null,
          }));

        const data = {
          monthly_income: parseFloat(monthlyIncome),
          dependants: parseInt(dependants) || 0,
          manual_expenses,
          debts: processedDebts,
        };

        result = await analyzeFinances(data);
      }

      setAnalysisResults(result);
      setActiveStep(3);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                💰 Basic Financial Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Monthly Income (After Tax)</InputLabel>
                    <OutlinedInput
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      startAdornment={<InputAdornment position="start">$</InputAdornment>}
                      label="Monthly Income (After Tax)"
                      type="number"
                      inputProps={{ min: 0, step: 100 }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Number of Dependants"
                    type="number"
                    value={dependants}
                    onChange={(e) => setDependants(e.target.value)}
                    inputProps={{ min: 0, max: 20 }}
                  />
                </Grid>
              </Grid>
              
              {monthlyIncome && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                  <Typography variant="body2" color="primary.contrastText">
                    💡 <strong>Tip:</strong> Enter your take-home pay after taxes, insurance, and other deductions.
                  </Typography>
                </Box>
              )}
            </Paper>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Analysis Method Selection */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                📊 Expense Data Entry Method
              </Typography>
              <Box display="flex" gap={2} sx={{ mb: 3 }}>
                <Button
                  variant={analysisMethod === 'manual' ? 'contained' : 'outlined'}
                  onClick={() => setAnalysisMethod('manual')}
                  startIcon={<Analytics />}
                >
                  Manual Entry
                </Button>
                <Button
                  variant={analysisMethod === 'csv' ? 'contained' : 'outlined'}
                  onClick={() => setAnalysisMethod('csv')}
                  startIcon={<Upload />}
                >
                  CSV Upload
                </Button>
              </Box>

              {analysisMethod === 'csv' ? (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    Upload your transaction CSV file (Date, Category, Amount)
                  </Typography>
                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: csvFile ? 'success.main' : 'grey.400',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      bgcolor: csvFile ? 'success.light' : 'grey.50',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.light',
                      },
                    }}
                    component="label"
                  >
                    <input
                      type="file"
                      hidden
                      accept=".csv"
                      onChange={handleFileUpload}
                    />
                    <Upload sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      {csvFile ? csvFile.name : 'Click to upload CSV file'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Supports CSV files with Date, Category, and Amount columns
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    Enter your monthly expenses by category
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(expenses).map(([category, value]) => (
                      <Grid item xs={12} md={6} lg={4} key={category}>
                        <FormControl fullWidth>
                          <InputLabel>{category}</InputLabel>
                          <OutlinedInput
                            value={value}
                            onChange={(e) => handleExpenseChange(category, e.target.value)}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label={category}
                            type="number"
                            inputProps={{ min: 0, step: 10 }}
                          />
                        </FormControl>
                      </Grid>
                    ))}
                  </Grid>
                  
                  {/* Expense Summary */}
                  {Object.values(expenses).some(v => v && parseFloat(v) > 0) && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                      <Typography variant="body2" color="info.contrastText">
                        <strong>Total Monthly Expenses:</strong> $
                        {Object.values(expenses)
                          .filter(v => v && parseFloat(v) > 0)
                          .reduce((sum, v) => sum + parseFloat(v), 0)
                          .toLocaleString()}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6">
                  🏦 Debt Information (Optional)
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={addDebt}
                  size="small"
                >
                  Add Debt
                </Button>
              </Box>

              {debts.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    bgcolor: 'grey.50',
                  }}
                >
                  <CreditCard sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No debts added yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add your debts to get personalized payoff strategies
                  </Typography>
                  <Button variant="outlined" startIcon={<Add />} onClick={addDebt}>
                    Add Your First Debt
                  </Button>
                </Box>
              ) : (
                <Box>
                  {debts.map((debt, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          mb: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            Debt #{index + 1}
                          </Typography>
                          <IconButton
                            color="error"
                            onClick={() => removeDebt(index)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Debt Name"
                              value={debt.name}
                              onChange={(e) => updateDebt(index, 'name', e.target.value)}
                              placeholder="e.g., Credit Card, Student Loan"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                              <InputLabel>Current Balance</InputLabel>
                              <OutlinedInput
                                value={debt.amount}
                                onChange={(e) => updateDebt(index, 'amount', e.target.value)}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Current Balance"
                                type="number"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                              <InputLabel>Interest Rate</InputLabel>
                              <OutlinedInput
                                value={debt.interest_rate}
                                onChange={(e) => updateDebt(index, 'interest_rate', e.target.value)}
                                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                label="Interest Rate"
                                type="number"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                              <InputLabel>Min Payment</InputLabel>
                              <OutlinedInput
                                value={debt.min_payment}
                                onChange={(e) => updateDebt(index, 'min_payment', e.target.value)}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Min Payment"
                                type="number"
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Paper>
                    </motion.div>
                  ))}
                </Box>
              )}
            </Paper>
          </motion.div>
        );

      case 3:
        return analysisResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <BudgetAnalysisDisplay analysis={analysisResults.budget_analysis} />
              </Grid>
              <Grid item xs={12}>
                <SavingsStrategyDisplay strategy={analysisResults.savings_strategy} />
              </Grid>
              {analysisResults.debt_reduction && (
                <Grid item xs={12}>
                  <DebtReductionDisplay reduction={analysisResults.debt_reduction} />
                </Grid>
              )}
            </Grid>
          </motion.div>
        );

      default:
        return null;
    }
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
              background: 'linear-gradient(45deg, #81d4fa 30%, #b3e5fc 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Financial Analysis 📊
          </Typography>
          <Typography 
            variant="h6" 
            sx={{
              color: '#4fc3f7', // Light blue
              fontWeight: '500',
              fontSize: '1.2rem'
            }}
          >
            Get personalized insights and recommendations for your financial health
          </Typography>
        </Box>
      </motion.div>

      {/* Progress Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} orientation="horizontal">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            🤖 AI agents are analyzing your financial data...
          </Typography>
        </Box>
      )}

      {/* Step Content */}
      <Box sx={{ mb: 3 }}>
        {renderStepContent(activeStep)}
      </Box>

      {/* Navigation */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>

        <Box display="flex" gap={2}>
          {activeStep < 2 && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!validateStep(activeStep)}
            >
              Next
            </Button>
          )}
          
          {activeStep === 2 && (
            <Button
              variant="contained"
              onClick={handleAnalyze}
              disabled={loading || !monthlyIncome}
              startIcon={<Assessment />}
              size="large"
            >
              {loading ? 'Analyzing...' : 'Analyze My Finances'}
            </Button>
          )}

          {activeStep === 3 && (
            <Button
              variant="outlined"
              onClick={() => {
                setActiveStep(0);
                setAnalysisResults(null);
                setError('');
              }}
            >
              Start New Analysis
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FinancialAnalysis;
