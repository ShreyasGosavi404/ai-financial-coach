from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import pandas as pd
import json
import io
import os
from datetime import datetime, timedelta
import jwt
import hashlib

# Import AI service
from ai_service import ai_service

app = FastAPI(
    title="AI Financial Coach API",
    description="Professional financial analysis powered by Google ADK and Gemini AI",
    version="2.0.0"
)

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "https://ai-financial-coach-frontend.vercel.app",
        "https://*.vercel.app",
        "*"  # Remove this in production and specify exact domains
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Authentication setup
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

# Mock user database (replace with real database in production)
users_db = {
    "demo@aifinance.com": {
        "username": "demo",
        "email": "demo@aifinance.com",
        "hashed_password": hashlib.sha256("demo123".encode()).hexdigest(),
        "full_name": "Demo User"
    },
    "demo@example.com": {
        "username": "demo",
        "email": "demo@example.com",
        "hashed_password": hashlib.sha256("password123".encode()).hexdigest(),
        "full_name": "Demo User"
    }
}

class LoginRequest(BaseModel):
    email: str
    password: str

class UserProfile(BaseModel):
    username: str
    email: str
    full_name: str

class ChatMessage(BaseModel):
    message: str

class Debt(BaseModel):
    name: str
    amount: float
    interest_rate: float
    min_payment: Optional[float] = None

class FinancialData(BaseModel):
    monthly_income: float
    dependants: int
    transactions: Optional[List[Dict[str, Any]]] = None
    manual_expenses: Optional[Dict[str, float]] = None
    debts: Optional[List[Debt]] = None

# Authentication helper functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return email
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def authenticate_user(email: str, password: str):
    user = users_db.get(email)
    if not user:
        return False
    if user["hashed_password"] != hashlib.sha256(password.encode()).hexdigest():
        return False
    return user

# Authentication endpoints
@app.post("/auth/login")
async def login(login_data: LoginRequest):
    user = authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "username": user["username"],
            "email": user["email"],
            "full_name": user["full_name"]
        }
    }

@app.get("/auth/profile")
async def get_profile(current_user_email: str = Depends(verify_token)):
    user = users_db.get(current_user_email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "username": user["username"],
        "email": user["email"],
        "full_name": user["full_name"]
    }

def analyze_budget(data: Dict[str, Any]) -> Dict[str, Any]:
    """Simple budget analysis logic"""
    monthly_income = data.get("monthly_income", 0)
    dependants = data.get("dependants", 0)
    manual_expenses = data.get("manual_expenses", {})
    transactions = data.get("transactions", [])
    
    # Calculate expenses
    if transactions:
        # Group transactions by category
        expenses_by_category = {}
        for transaction in transactions:
            category = transaction.get("Category", "Other")
            amount = transaction.get("Amount", 0)
            expenses_by_category[category] = expenses_by_category.get(category, 0) + amount
    else:
        expenses_by_category = {k: v for k, v in manual_expenses.items() if v > 0}
    
    total_expenses = sum(expenses_by_category.values())
    
    # Create spending categories
    spending_categories = []
    for category, amount in expenses_by_category.items():
        percentage = (amount / total_expenses * 100) if total_expenses > 0 else 0
        spending_categories.append({
            "category": category,
            "amount": amount,
            "percentage": percentage
        })
    
    # Generate recommendations
    recommendations = []
    
    if total_expenses > monthly_income * 0.9:
        recommendations.append({
            "category": "General Spending",
            "recommendation": "Your expenses are very high relative to income. Consider reducing discretionary spending.",
            "potential_savings": total_expenses * 0.1
        })
    
    # Housing recommendation
    housing_amount = expenses_by_category.get("Housing", 0)
    if housing_amount > monthly_income * 0.35:
        recommendations.append({
            "category": "Housing",
            "recommendation": "Housing costs exceed 35% of income. Consider downsizing or finding roommates.",
            "potential_savings": housing_amount - (monthly_income * 0.30)
        })
    
    # Food recommendation
    food_amount = expenses_by_category.get("Food", 0)
    if food_amount > monthly_income * 0.15:
        recommendations.append({
            "category": "Food",
            "recommendation": "Food expenses are high. Try meal planning and cooking at home more often.",
            "potential_savings": food_amount * 0.2
        })
    
    # Entertainment recommendation
    entertainment_amount = expenses_by_category.get("Entertainment", 0)
    if entertainment_amount > monthly_income * 0.1:
        recommendations.append({
            "category": "Entertainment",
            "recommendation": "Entertainment spending is above 10% of income. Look for free activities.",
            "potential_savings": entertainment_amount * 0.3
        })
    
    return {
        "total_expenses": total_expenses,
        "monthly_income": monthly_income,
        "spending_categories": spending_categories,
        "recommendations": recommendations
    }

def analyze_savings(data: Dict[str, Any], budget_analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Simple savings strategy logic"""
    monthly_income = data.get("monthly_income", 0)
    dependants = data.get("dependants", 0)
    total_expenses = budget_analysis.get("total_expenses", 0)
    
    # Emergency fund calculation
    emergency_months = 6 if dependants > 0 else 3
    recommended_emergency = total_expenses * emergency_months
    
    # Calculate available for savings
    available_for_savings = max(0, monthly_income - total_expenses)
    
    recommendations = []
    
    # Emergency fund first
    if available_for_savings > 0:
        emergency_allocation = min(available_for_savings * 0.5, total_expenses * 0.5)
        recommendations.append({
            "category": "Emergency Fund",
            "amount": emergency_allocation,
            "rationale": f"Build {emergency_months}-month emergency fund first"
        })
        
        # Retirement savings
        remaining = available_for_savings - emergency_allocation
        if remaining > 0:
            retirement_allocation = min(remaining * 0.8, monthly_income * 0.15)
            recommendations.append({
                "category": "Retirement",
                "amount": retirement_allocation,
                "rationale": "Long-term retirement savings (aim for 15% of income)"
            })
            
            # Other goals
            remaining -= retirement_allocation
            if remaining > 0:
                recommendations.append({
                    "category": "Other Goals",
                    "amount": remaining,
                    "rationale": "Vacation, home down payment, or other financial goals"
                })
    
    automation_techniques = [
        {
            "name": "Automatic Transfer",
            "description": "Set up automatic transfers on payday to savings accounts"
        },
        {
            "name": "Round-up Savings",
            "description": "Use apps that round up purchases and save the difference"
        },
        {
            "name": "Direct Deposit Split",
            "description": "Split direct deposit to automatically save a percentage"
        }
    ]
    
    return {
        "emergency_fund": {
            "recommended_amount": recommended_emergency,
            "current_amount": 0,
            "current_status": "Not started - begin building immediately"
        },
        "recommendations": recommendations,
        "automation_techniques": automation_techniques
    }

def analyze_debt_reduction(data: Dict[str, Any]) -> Dict[str, Any]:
    """Simple debt reduction analysis"""
    debts = data.get("debts", [])
    
    if not debts:
        return {
            "total_debt": 0,
            "debts": [],
            "payoff_plans": {
                "avalanche": {
                    "total_interest": 0,
                    "months_to_payoff": 0,
                    "monthly_payment": 0
                },
                "snowball": {
                    "total_interest": 0,
                    "months_to_payoff": 0,
                    "monthly_payment": 0
                }
            },
            "recommendations": []
        }
    
    total_debt = sum(debt.get("amount", 0) for debt in debts)
    total_min_payments = sum(debt.get("min_payment", debt.get("amount", 0) * 0.02) for debt in debts)
    
    # Simple calculation for demonstration
    avg_interest = sum(debt.get("interest_rate", 10) for debt in debts) / len(debts)
    
    # Avalanche method (highest interest first)
    avalanche_months = max(24, int(total_debt / (total_min_payments * 1.5)))
    avalanche_interest = total_debt * (avg_interest / 100) * (avalanche_months / 12) * 0.7
    
    # Snowball method (smallest balance first)
    snowball_months = max(24, int(total_debt / (total_min_payments * 1.3)))
    snowball_interest = total_debt * (avg_interest / 100) * (snowball_months / 12) * 0.8
    
    recommendations = []
    
    if total_debt > 0:
        recommendations.append({
            "title": "Increase Monthly Payments",
            "description": f"Pay more than the minimum to reduce interest. Even an extra $50/month helps significantly.",
            "impact": "Reduces total interest paid and time to debt freedom"
        })
        
        recommendations.append({
            "title": "Choose Your Strategy",
            "description": "Avalanche method saves more money, snowball method provides psychological wins",
            "impact": "Structured approach increases success rate"
        })
        
        if avg_interest > 15:
            recommendations.append({
                "title": "Consider Debt Consolidation",
                "description": "High interest rates detected. Look into balance transfers or personal loans with lower rates.",
                "impact": "Could reduce interest rates and simplify payments"
            })
    
    return {
        "total_debt": total_debt,
        "debts": debts,
        "payoff_plans": {
            "avalanche": {
                "total_interest": avalanche_interest,
                "months_to_payoff": avalanche_months,
                "monthly_payment": total_debt / avalanche_months + (total_min_payments * 0.5)
            },
            "snowball": {
                "total_interest": snowball_interest,
                "months_to_payoff": snowball_months,
                "monthly_payment": total_debt / snowball_months + (total_min_payments * 0.3)
            }
        },
        "recommendations": recommendations
    }

def parse_csv_transactions(file_content: bytes) -> Dict[str, Any]:
    """Parse CSV file content into a list of transactions"""
    try:
        # Read CSV content
        df = pd.read_csv(io.BytesIO(file_content))
        
        # Validate required columns
        required_columns = ['Date', 'Category', 'Amount']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")
        
        # Convert date strings to datetime and then to string format YYYY-MM-DD
        df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%Y-%m-%d')
        
        # Convert amount strings to float, handling currency symbols and commas
        df['Amount'] = df['Amount'].replace(r'[\$,]', '', regex=True).astype(float)
        
        # Convert to list of dictionaries
        transactions = df.to_dict('records')
        
        return {
            'transactions': transactions
        }
    except Exception as e:
        raise ValueError(f"Error parsing CSV file: {str(e)}")

@app.post("/analyze")
async def analyze_finances(data: FinancialData):
    """Standard analysis endpoint with AI when available"""
    try:
        data_dict = data.dict()
        
        # Try AI analysis first if available
        if ai_service.is_ai_available():
            try:
                results = await ai_service.analyze_finances_with_ai(data_dict)
                return results
            except Exception as ai_error:
                print(f"⚠️ AI analysis failed, falling back to rule-based: {ai_error}")
        
        # Fallback to rule-based analysis
        budget_analysis = analyze_budget(data_dict)
        savings_strategy = analyze_savings(data_dict, budget_analysis)
        debt_reduction = analyze_debt_reduction(data_dict)
        
        return {
            "budget_analysis": budget_analysis,
            "savings_strategy": savings_strategy,
            "debt_reduction": debt_reduction,
            "analysis_metadata": {
                "powered_by": "Rule-Based Logic (AI not available)",
                "timestamp": datetime.now().isoformat(),
                "fallback_reason": "AI service unavailable"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-ai")
async def analyze_finances_ai_only(data: FinancialData):
    """AI-only analysis endpoint"""
    try:
        if not ai_service.is_ai_available():
            raise HTTPException(
                status_code=503, 
                detail="AI analysis is not available. Please check Google API key configuration."
            )
        
        data_dict = data.dict()
        results = await ai_service.analyze_finances_with_ai(data_dict)
        return results
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-basic")
async def analyze_finances_basic(data: FinancialData):
    """Rule-based analysis endpoint"""
    try:
        data_dict = data.dict()
        
        # Analyze budget
        budget_analysis = analyze_budget(data_dict)
        
        # Analyze savings strategy
        savings_strategy = analyze_savings(data_dict, budget_analysis)
        
        # Analyze debt reduction
        debt_reduction = analyze_debt_reduction(data_dict)
        
        return {
            "budget_analysis": budget_analysis,
            "savings_strategy": savings_strategy,
            "debt_reduction": debt_reduction,
            "analysis_metadata": {
                "powered_by": "Rule-Based Logic",
                "timestamp": datetime.now().isoformat()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_endpoint(chat_data: ChatMessage):
    """Enhanced chat endpoint with AI status information."""
    ai_status = "AI-powered analysis" if ai_service.is_ai_available() else "rule-based analysis"
    
    return {
        "response": f"Hello! I'm your AI Financial Coach with {ai_status}. Please use the finance form above to get detailed analysis of your financial situation. I can provide budget analysis, savings strategies, and debt reduction plans. The interactive chat feature is coming soon!",
        "ai_available": ai_service.is_ai_available(),
        "capabilities": [
            "📊 Budget Analysis",
            "💰 Savings Strategy",
            "💳 Debt Reduction Planning",
            "📈 Financial Insights",
            "📤 CSV Transaction Analysis"
        ]
    }

@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...), monthly_income: float = Form(...), dependants: int = Form(0)):
    """Accept CSV file, parse, and analyze with AI when available."""
    try:
        content = await file.read()
        parsed = parse_csv_transactions(content)
        transactions = parsed['transactions']
        
        data = {
            "monthly_income": monthly_income,
            "dependants": dependants,
            "transactions": transactions,
            "manual_expenses": {},
            "debts": []
        }
        
        # Try AI analysis first if available
        if ai_service.is_ai_available():
            try:
                results = await ai_service.analyze_finances_with_ai(data)
                return results
            except Exception as ai_error:
                print(f"⚠️ AI analysis failed for CSV, falling back to rule-based: {ai_error}")
        
        # Fallback to rule-based analysis
        budget_analysis = analyze_budget(data)
        savings_strategy = analyze_savings(data, budget_analysis)
        debt_reduction = analyze_debt_reduction(data)
        
        return {
            "budget_analysis": budget_analysis,
            "savings_strategy": savings_strategy,
            "debt_reduction": debt_reduction,
            "analysis_metadata": {
                "powered_by": "Rule-Based Logic (CSV Upload)",
                "timestamp": datetime.now().isoformat(),
                "data_source": "CSV file"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    service_status = ai_service.get_service_status()
    return {
        "message": "AI Financial Coach Backend API", 
        "status": "running",
        "version": "2.0.0",
        "ai_status": service_status,
        "endpoints": {
            "analyze": "/analyze (AI + fallback)",
            "analyze_ai": "/analyze-ai (AI only)",
            "analyze_basic": "/analyze-basic (rule-based)",
            "upload_csv": "/upload-csv", 
            "chat": "/chat",
            "service_status": "/service-status",
            "docs": "/docs"
        }
    }

@app.get("/service-status")
async def service_status():
    """Get detailed service status"""
    return {
        "timestamp": datetime.now().isoformat(),
        "service": ai_service.get_service_status(),
        "endpoints_available": {
            "ai_analysis": ai_service.is_ai_available(),
            "basic_analysis": True,
            "csv_upload": True,
            "chat": True
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": "2025-01-24T12:00:00Z",
        "services": {
            "api": "operational",
            "analysis": "operational"
        }
    }

@app.get("/test")
async def test_analysis():
    """Test endpoint with sample data"""
    sample_data = {
        "monthly_income": 5000,
        "dependants": 1,
        "manual_expenses": {
            "Housing": 1500,
            "Food": 600,
            "Transportation": 400,
            "Entertainment": 300,
            "Utilities": 200
        },
        "debts": [
            {
                "name": "Credit Card",
                "amount": 3000,
                "interest_rate": 18.5,
                "min_payment": 100
            }
        ]
    }
    
    try:
        # Analyze budget
        budget_analysis = analyze_budget(sample_data)
        
        # Analyze savings strategy
        savings_strategy = analyze_savings(sample_data, budget_analysis)
        
        # Analyze debt reduction
        debt_reduction = analyze_debt_reduction(sample_data)
        
        return {
            "sample_data": sample_data,
            "analysis_results": {
                "budget_analysis": budget_analysis,
                "savings_strategy": savings_strategy,
                "debt_reduction": debt_reduction
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Starting AI Financial Coach Backend...")
    print("📡 API will be available at: http://localhost:8000")
    print("📋 API docs available at: http://localhost:8000/docs")
    
    # Get port from environment variable for deployment
    port = int(os.getenv("PORT", 8000))
    
    uvicorn.run(app, host="0.0.0.0", port=port)