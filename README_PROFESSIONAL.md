# AI Financial Coach - Professional Application

## 🏗️ Architecture Overview

This is a complete professional AI Financial Coach application with:
- **FastAPI Backend**: Modern Python API with financial analysis
- **React Professional Frontend**: Material-UI based professional interface  
- **AI Integration**: Google ADK agents for financial insights

## 📁 Project Structure

```
ai_financial_coach_agent/
├── backend/                          # FastAPI Backend
│   ├── main.py                      # Main API server
│   └── requirements.txt             # Backend dependencies
├── professional-frontend/           # React Professional Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Analysis/           # Analysis display components
│   │   │   └── Layout/             # Layout components
│   │   ├── pages/                  # Main application pages
│   │   ├── services/               # API integration
│   │   └── App.js                  # Main application
│   └── package.json                # Frontend dependencies
├── ai_financial_coach_agent.py     # Original Streamlit app
├── start_backend.ps1               # Backend startup script
├── start_frontend.ps1              # Frontend startup script
└── start_all.ps1                   # Complete system startup
```

## 🚀 Quick Start

### Option 1: Start Everything (Recommended)
```powershell
# From project root directory
.\start_all.ps1
```

### Option 2: Start Services Separately

**Backend (Terminal 1):**
```powershell
.\start_backend.ps1
```

**Frontend (Terminal 2):**
```powershell  
.\start_frontend.ps1
```

### Option 3: Manual Setup

**Backend Setup:**
```powershell
# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
cd backend
pip install -r requirements.txt

# Start server
python main.py
```

**Frontend Setup:**
```powershell
# Install dependencies
cd professional-frontend
npm install

# Start development server
npm start
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 💻 Frontend Features

### 📊 Dashboard
- Financial health overview
- Portfolio tracking
- Quick action cards
- Interactive charts and metrics

### 📈 Financial Analysis
- Multi-step analysis wizard
- Manual data entry or CSV upload
- Budget analysis with recommendations
- Savings strategy planning
- Debt reduction strategies (Avalanche vs Snowball)

### 💼 Portfolio Tracking
- Investment overview
- Asset allocation
- Performance metrics

### 📋 Reports
- Comprehensive financial reports
- Export capabilities
- Historical data analysis

## 🔧 Backend API Endpoints

- `POST /analyze` - Complete financial analysis
- `POST /upload-csv` - Upload transaction CSV file
- `POST /chat` - AI chat interface
- `GET /health` - Health check
- `GET /test` - Test endpoint with sample data

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern React with hooks
- **Material-UI 5.14.17** - Professional UI components
- **Recharts 2.8.0** - Data visualization
- **Framer Motion 10.16.4** - Smooth animations
- **Axios 1.6.0** - API communication
- **React Router 6.18.0** - Navigation

### Backend
- **FastAPI 0.115.0** - Modern Python web framework
- **Uvicorn 0.32.0** - ASGI server
- **Pandas 2.2.3** - Data processing
- **Pydantic 2.8.2** - Data validation

## 🔍 Integration Status

✅ **Complete Integration Achieved:**
- Frontend-Backend API communication
- Data model compatibility
- Error handling and validation
- CORS configuration
- Professional UI components
- Responsive design

## 🎯 Usage Instructions

1. **Start the application** using `.\start_all.ps1`
2. **Wait for both servers** to fully initialize
3. **Open browser** to http://localhost:3000
4. **Navigate to Financial Analysis** page
5. **Enter your financial data** or upload a CSV file
6. **Review comprehensive analysis** with AI recommendations

## 🚨 Troubleshooting

### Common Issues:
- **Port conflicts**: Ensure ports 3000 and 8000 are available
- **Dependencies**: Run `npm install` in frontend directory
- **Python environment**: Ensure Python 3.8+ is installed
- **CORS errors**: Restart backend if frontend can't connect

### Manual Debugging:
- Check backend logs in terminal
- Verify API endpoints at http://localhost:8000/docs
- Check browser console for frontend errors

## 📝 Development Notes

- Backend uses modern FastAPI with automatic API documentation
- Frontend follows React best practices with functional components
- Professional UI design with Material-UI components
- Comprehensive error handling and user feedback
- Mobile-responsive design
- Professional animations and transitions

## 🔮 Future Enhancements

- Real-time data synchronization
- Advanced portfolio analytics
- Machine learning recommendations
- Mobile application
- Multi-user support
- Bank integration APIs
