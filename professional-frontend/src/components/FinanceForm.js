import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import { Analytics as AnalyticsIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';

const FinanceForm = ({ onAnalysisComplete, onError, onLoadingChange }) => {
  const [formData, setFormData] = useState({
    monthly_income: '',
    housing: '',
    transportation: '',
    food: '',
    utilities: '',
    healthcare: '',
    entertainment: '',
    other_expenses: '',
    debt_payments: '',
    goals: '',
    risk_tolerance: 'moderate'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const riskToleranceOptions = [
    { value: 'conservative', label: '🛡️ Conservative', description: 'Low risk, stable returns' },
    { value: 'moderate', label: '⚖️ Moderate', description: 'Balanced risk and return' },
    { value: 'aggressive', label: '🚀 Aggressive', description: 'High risk, high potential return' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'monthly_income', 'housing', 'transportation', 'food', 
      'utilities', 'healthcare', 'entertainment', 'other_expenses'
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || parseFloat(formData[field]) < 0) {
        newErrors[field] = 'This field is required and must be a positive number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotalExpenses = () => {
    const expenseFields = [
      'housing', 'transportation', 'food', 'utilities', 
      'healthcare', 'entertainment', 'other_expenses', 'debt_payments'
    ];
    
    return expenseFields.reduce((total, field) => {
      return total + (parseFloat(formData[field]) || 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      onError('Please fill in all required fields with valid numbers');
      return;
    }

    setLoading(true);
    onLoadingChange(true);

    try {
      // Prepare data for API - match backend expected format
      const analysisData = {
        monthly_income: parseFloat(formData.monthly_income),
        dependants: 0, // Default value
        manual_expenses: {
          Housing: parseFloat(formData.housing) || 0,
          Transportation: parseFloat(formData.transportation) || 0,
          Food: parseFloat(formData.food) || 0,
          Utilities: parseFloat(formData.utilities) || 0,
          Healthcare: parseFloat(formData.healthcare) || 0,
          Entertainment: parseFloat(formData.entertainment) || 0,
          Other: parseFloat(formData.other_expenses) || 0
        },
        debts: formData.debt_payments > 0 ? [{
          name: "General Debt",
          amount: parseFloat(formData.debt_payments),
          interest_rate: 15.0,
          min_payment: parseFloat(formData.debt_payments) * 0.03
        }] : [],
        goals: formData.goals || "",
        risk_tolerance: formData.risk_tolerance || "moderate"
      };

      console.log('Sending data to backend:', analysisData);

      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Backend response:', result);
      
      // Transform the backend response to match our frontend expectations
      const transformedResult = {
        monthly_income: analysisData.monthly_income,
        total_expenses: calculateTotalExpenses(),
        budget_analysis: result.budget_analysis || {},
        savings_strategy: result.savings_strategy || {},
        debt_reduction: result.debt_reduction || {},
        ai_analysis_available: result.analysis_metadata?.powered_by?.includes('AI') || false,
        recommendations: []
      };

      // Extract recommendations from budget analysis
      if (result.budget_analysis?.recommendations) {
        transformedResult.recommendations = result.budget_analysis.recommendations.map(rec => 
          typeof rec === 'string' ? rec : rec.recommendation || JSON.stringify(rec)
        );
      }
      
      onAnalysisComplete(transformedResult);
      onError(null);
      
    } catch (error) {
      console.error('Analysis error:', error);
      onError('Failed to analyze financial data. Please make sure the backend is running and try again.');
      onAnalysisComplete(null);
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  const totalExpenses = calculateTotalExpenses();
  const monthlyIncome = parseFloat(formData.monthly_income) || 0;
  const availableBudget = monthlyIncome - totalExpenses;

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
        📊 Financial Analysis Form
      </Typography>

      {/* Income Section */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <Typography variant="h6" gutterBottom color="success.main">
          💰 Income Information
        </Typography>
        <TextField
          fullWidth
          label="Monthly Income ($)"
          type="number"
          value={formData.monthly_income}
          onChange={(e) => handleInputChange('monthly_income', e.target.value)}
          error={!!errors.monthly_income}
          helperText={errors.monthly_income}
          required
          sx={{ mb: 2 }}
        />
      </Paper>

      {/* Expenses Section */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <Typography variant="h6" gutterBottom color="warning.main">
          💸 Monthly Expenses
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Housing & Rent ($)"
              type="number"
              value={formData.housing}
              onChange={(e) => handleInputChange('housing', e.target.value)}
              error={!!errors.housing}
              helperText={errors.housing}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Transportation ($)"
              type="number"
              value={formData.transportation}
              onChange={(e) => handleInputChange('transportation', e.target.value)}
              error={!!errors.transportation}
              helperText={errors.transportation}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Food & Groceries ($)"
              type="number"
              value={formData.food}
              onChange={(e) => handleInputChange('food', e.target.value)}
              error={!!errors.food}
              helperText={errors.food}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Utilities ($)"
              type="number"
              value={formData.utilities}
              onChange={(e) => handleInputChange('utilities', e.target.value)}
              error={!!errors.utilities}
              helperText={errors.utilities}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Healthcare ($)"
              type="number"
              value={formData.healthcare}
              onChange={(e) => handleInputChange('healthcare', e.target.value)}
              error={!!errors.healthcare}
              helperText={errors.healthcare}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Entertainment ($)"
              type="number"
              value={formData.entertainment}
              onChange={(e) => handleInputChange('entertainment', e.target.value)}
              error={!!errors.entertainment}
              helperText={errors.entertainment}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Other Expenses ($)"
              type="number"
              value={formData.other_expenses}
              onChange={(e) => handleInputChange('other_expenses', e.target.value)}
              error={!!errors.other_expenses}
              helperText={errors.other_expenses}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Debt Payments ($)"
              type="number"
              value={formData.debt_payments}
              onChange={(e) => handleInputChange('debt_payments', e.target.value)}
              helperText="Optional: Credit cards, loans, etc."
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Goals and Risk Tolerance */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <Typography variant="h6" gutterBottom color="info.main">
          🎯 Financial Goals & Preferences
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Financial Goals"
              multiline
              rows={3}
              value={formData.goals}
              onChange={(e) => handleInputChange('goals', e.target.value)}
              placeholder="e.g., Save for house down payment, build emergency fund, invest for retirement..."
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Risk Tolerance</InputLabel>
              <Select
                value={formData.risk_tolerance}
                label="Risk Tolerance"
                onChange={(e) => handleInputChange('risk_tolerance', e.target.value)}
              >
                {riskToleranceOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box>
                      <Typography variant="body1">{option.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Budget Summary */}
      {monthlyIncome > 0 && (
        <Paper sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Typography variant="h6" gutterBottom color="primary">
            📈 Budget Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Chip
                icon={<TrendingUpIcon />}
                label={`Income: $${monthlyIncome.toLocaleString()}`}
                color="success"
                variant="outlined"
                sx={{ width: '100%', justifyContent: 'flex-start' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Chip
                label={`Expenses: $${totalExpenses.toLocaleString()}`}
                color="warning"
                variant="outlined"
                sx={{ width: '100%', justifyContent: 'flex-start' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Chip
                label={`Available: $${availableBudget.toLocaleString()}`}
                color={availableBudget >= 0 ? 'success' : 'error'}
                variant="filled"
                sx={{ width: '100%', justifyContent: 'flex-start' }}
              />
            </Grid>
          </Grid>
          {availableBudget < 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              ⚠️ Your expenses exceed your income by ${Math.abs(availableBudget).toLocaleString()}. 
              Consider reviewing your budget to reduce expenses.
            </Alert>
          )}
        </Paper>
      )}

      <Divider sx={{ my: 3 }} />

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : <AnalyticsIcon />}
        sx={{ 
          py: 2,
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          boxShadow: '0 3px 15px 2px rgba(25, 118, 210, .3)',
        }}
      >
        {loading ? 'Analyzing Your Finances...' : 'Get AI Financial Analysis'}
      </Button>
    </Box>
  );
};

export default FinanceForm;
