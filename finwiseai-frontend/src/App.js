import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import './components/AnimatedBackground.css';
import ChatBox from './components/ChatBox';
import FinanceForm from './components/FinanceForm';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
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
    <div className="App">
      <AnimatedBackground />
      <div className="app-content">
        <header className="app-header glass-overlay">
          <div className="header-content">
            <h1>🤖 AI Financial Coach</h1>
            <p>Get personalized financial advice powered by advanced AI</p>
          </div>
        </header>

        <main className="main-content">
          <div className="content-grid">
            <div className="form-section">
              <div className="form-container glass-overlay">
                <h2>📊 Financial Analysis</h2>
                <FinanceForm 
                  onAnalysisComplete={handleAnalysisComplete}
                  onError={handleError}
                  onLoadingChange={handleLoadingChange}
                />
              </div>
            </div>

            <div className="chat-section">
              <div className="chat-container glass-overlay">
                <h2>💬 AI Financial Assistant</h2>
                <ChatBox 
                  analysisResult={analysisResult}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </div>
          </div>

          {analysisResult && (
            <div className="results-section">
              <div className="results-container glass-overlay">
                <h2>📈 Analysis Results</h2>
                <div className="analysis-summary">
                  <div className="summary-grid">
                    <div className="summary-card">
                      <h3>💰 Monthly Income</h3>
                      <p className="amount">${analysisResult.monthly_income?.toLocaleString()}</p>
                    </div>
                    <div className="summary-card">
                      <h3>💸 Total Expenses</h3>
                      <p className="amount">${analysisResult.total_expenses?.toLocaleString()}</p>
                    </div>
                    <div className="summary-card">
                      <h3>💳 Available Budget</h3>
                      <p className="amount positive">${(analysisResult.monthly_income - analysisResult.total_expenses)?.toLocaleString()}</p>
                    </div>
                    <div className="summary-card">
                      <h3>🎯 AI Powered</h3>
                      <p className="status">{analysisResult.ai_analysis_available ? '✅ Active' : '⚠️ Basic Mode'}</p>
                    </div>
                  </div>
                </div>

                {analysisResult.budget_analysis && (
                  <div className="detailed-analysis">
                    <h3>📊 Spending Categories</h3>
                    <div className="categories-grid">
                      {analysisResult.budget_analysis.spending_categories?.map((category, index) => (
                        <div key={index} className="category-card">
                          <h4>{category.category}</h4>
                          <p className="category-amount">${category.amount?.toLocaleString()}</p>
                          <p className="category-percentage">{category.percentage?.toFixed(1)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>Powered by Google Gemini AI & Advanced Financial Analysis</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
