import axios from 'axios';
import authService from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('🔴 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/';
    }
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      throw new Error('🔌 Backend server is not running. Please start the server and try again.');
    }
    
    if (error.response) {
      const message = error.response.data?.detail || error.response.data?.message || 'Server error occurred';
      throw new Error(`⚠️ ${message}`);
    }
    
    throw new Error('🌐 Network error occurred. Please check your connection.');
  }
);

// API Functions
export const analyzeFinances = async (financialData) => {
  try {
    // Use the main analyze endpoint which tries AI first, then falls back to basic
    const response = await api.post('/analyze', financialData);
    return response;
  } catch (error) {
    console.error('Analysis Error:', error);
    throw error;
  }
};

export const analyzeFinancesAI = async (financialData) => {
  try {
    // Use AI-only endpoint
    const response = await api.post('/analyze-ai', financialData);
    return response;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw error;
  }
};

export const analyzeFinancesBasic = async (financialData) => {
  try {
    // Use basic rule-based analysis only
    const response = await api.post('/analyze-basic', financialData);
    return response;
  } catch (error) {
    console.error('Basic Analysis Error:', error);
    throw error;
  }
};

export const uploadCSV = async (file, monthlyIncome, dependants) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('monthly_income', monthlyIncome.toString());
    formData.append('dependants', dependants.toString());

    const response = await api.post('/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('CSV Upload Error:', error);
    throw error;
  }
};

export const sendChatMessage = async (message) => {
  try {
    const response = await api.post('/chat', { message });
    return response;
  } catch (error) {
    console.error('Chat Error:', error);
    throw error;
  }
};

export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/');
    return { status: 'connected', message: response.message || 'Backend is running' };
  } catch (error) {
    console.error('Health Check Error:', error);
    return { status: 'disconnected', message: error.message };
  }
};

export const getFinancialInsights = async (timeframe = '1M') => {
  try {
    const response = await api.get(`/insights?timeframe=${timeframe}`);
    return response;
  } catch (error) {
    console.error('Insights Error:', error);
    throw error;
  }
};

export const saveFinancialGoal = async (goalData) => {
  try {
    const response = await api.post('/goals', goalData);
    return response;
  } catch (error) {
    console.error('Save Goal Error:', error);
    throw error;
  }
};

export const getFinancialGoals = async () => {
  try {
    const response = await api.get('/goals');
    return response;
  } catch (error) {
    console.error('Get Goals Error:', error);
    throw error;
  }
};

export const generateReport = async (reportType, dateRange) => {
  try {
    const response = await api.post('/reports', {
      type: reportType,
      date_range: dateRange,
    });
    return response;
  } catch (error) {
    console.error('Generate Report Error:', error);
    throw error;
  }
};

// Portfolio tracking functions
export const getPortfolioData = async () => {
  try {
    const response = await api.get('/portfolio');
    return response;
  } catch (error) {
    console.error('Portfolio Data Error:', error);
    throw error;
  }
};

export const updatePortfolioItem = async (itemId, data) => {
  try {
    const response = await api.put(`/portfolio/${itemId}`, data);
    return response;
  } catch (error) {
    console.error('Update Portfolio Error:', error);
    throw error;
  }
};

// Investment tracking
export const getInvestmentRecommendations = async (riskTolerance, timeHorizon) => {
  try {
    const response = await api.post('/investment-recommendations', {
      risk_tolerance: riskTolerance,
      time_horizon: timeHorizon,
    });
    return response;
  } catch (error) {
    console.error('Investment Recommendations Error:', error);
    throw error;
  }
};

// Budget tracking
export const saveBudget = async (budgetData) => {
  try {
    const response = await api.post('/budget', budgetData);
    return response;
  } catch (error) {
    console.error('Save Budget Error:', error);
    throw error;
  }
};

export const getBudgetTracking = async (month, year) => {
  try {
    const response = await api.get(`/budget/tracking?month=${month}&year=${year}`);
    return response;
  } catch (error) {
    console.error('Budget Tracking Error:', error);
    throw error;
  }
};

export default api;
