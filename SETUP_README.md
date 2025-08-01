# 🚀 AI Financial Coach - Complete Setup Guide

## 📋 Overview
This project includes:
- **Backend**: FastAPI server providing financial analysis APIs
- **Frontend**: React application with Material-UI interface
- **Streamlit Alternative**: Standalone Streamlit application

## 🛠️ Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

## 🏃‍♂️ Quick Start

### Option 1: Automated Setup (Windows)
1. **Run the startup script**:
   ```powershell
   # In PowerShell (as Administrator if needed)
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   .\start.ps1
   ```

2. **Or use the batch file**:
   ```cmd
   start.bat
   ```

### Option 2: Manual Setup

#### Backend Setup
1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install fastapi uvicorn pandas python-dotenv
   ```

3. **Start the backend server**:
   ```bash
   python main.py
   ```
   The backend will be available at: http://localhost:8000

#### Frontend Setup
1. **Navigate to frontend directory**:
   ```bash
   cd finwiseai-frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm start
   ```
   The frontend will be available at: http://localhost:3000

### Option 3: Streamlit Version (Alternative)
1. **Install Streamlit dependencies**:
   ```bash
   pip install streamlit pandas plotly python-dotenv
   ```

2. **Run the Streamlit app**:
   ```bash
   streamlit run ai_financial_coach_agent.py
   ```

## 🔧 Configuration

### API Key Setup (for Streamlit version)
1. Create a `.env` file in the root directory
2. Add your Google API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

### Environment Variables
- **Frontend**: Uses `REACT_APP_API_URL` (defaults to http://localhost:8000)
- **Backend**: No special configuration needed for basic setup

## 📁 Project Structure
```
ai_financial_coach_agent/
├── backend/                 # FastAPI backend
│   ├── main.py             # Updated backend without ADK dependency
│   ├── simple_main.py      # Alternative backend implementation
│   └── requirements.txt    # Python dependencies
├── finwiseai-frontend/     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── FinanceForm.js
│   │   │   ├── ChatBox.js
│   │   │   └── ResultsDisplay.js
│   │   ├── api.js
│   │   └── App.js
│   ├── package.json
│   └── .env
├── frontend/               # Alternative Vite frontend
├── ai_financial_coach_agent.py  # Streamlit version
├── start.ps1              # PowerShell startup script
├── start.bat              # Batch startup script
└── README.md
```

## 🎯 Features

### 💰 Budget Analysis
- Spending categorization and breakdown
- Income vs. expenses comparison
- Personalized recommendations for cost reduction
- Visual spending analysis with charts

### 📈 Savings Strategy
- Emergency fund recommendations
- Savings allocation strategies
- Automation techniques
- Goal-based saving plans

### 💳 Debt Management
- Multiple debt tracking
- Avalanche vs. Snowball method comparison
- Payoff timeline calculations
- Interest savings analysis

### 📊 Data Input Options
- **Manual Entry**: Direct input of expenses by category
- **CSV Upload**: Upload transaction files with Date, Category, Amount columns
- **Interactive Forms**: User-friendly input with validation

## 🔍 API Endpoints

### Backend API (http://localhost:8000)
- `POST /analyze` - Analyze financial data
- `POST /upload-csv` - Upload and analyze CSV transactions
- `POST /chat` - Chat endpoint (placeholder)
- `GET /` - Health check
- `GET /docs` - Interactive API documentation

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**:
   - Ensure Python dependencies are installed: `pip install fastapi uvicorn pandas`
   - Check if port 8000 is available
   - Try running `python main.py` directly in the backend folder

2. **Frontend won't start**:
   - Install dependencies: `npm install`
   - Check if port 3000 is available
   - Clear npm cache: `npm cache clean --force`

3. **CSV Upload Issues**:
   - Ensure CSV has columns: Date, Category, Amount
   - Check date format is readable (YYYY-MM-DD preferred)
   - Remove special characters from amount fields

4. **API Connection Issues**:
   - Verify backend is running on port 8000
   - Check CORS settings if accessing from different domain
   - Ensure firewall isn't blocking connections

### Dependencies Issues
If you encounter Pydantic compatibility issues:
```bash
pip install pydantic==1.10.17
# or
pip install --upgrade pydantic
```

## 📱 Usage Guide

1. **Start both services** using one of the startup methods above
2. **Open your browser** to http://localhost:3000
3. **Enter financial information**:
   - Monthly income and dependants
   - Choose manual entry or CSV upload for expenses
   - Add any debts with interest rates
4. **Click "Analyze My Finances"** to get comprehensive analysis
5. **Review results** in the detailed breakdown sections

## 🚀 Production Deployment

### Backend
- Use a production ASGI server like Gunicorn
- Set up environment variables
- Configure proper CORS settings
- Add authentication if needed

### Frontend
- Build for production: `npm run build`
- Serve static files with nginx or similar
- Update API_URL to production backend

## 📝 CSV File Format

Your CSV file should have these columns:
```csv
Date,Category,Amount
2024-01-01,Housing,1200.00
2024-01-02,Food,150.50
2024-01-03,Transportation,45.00
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the awesome-llm-apps repository.
