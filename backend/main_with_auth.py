from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
import jwt
import hashlib
import time
from datetime import datetime, timedelta
import os
from ai_service import AIFinanceAdvisorService

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI(
    title="AI Financial Coach API",
    description="Advanced AI-powered financial analysis with authentication",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize AI service
ai_service = AIFinanceAdvisorService()

# Mock user database (in production, use a real database)
USERS_DB = {
    "demo@aifinance.com": {
        "email": "demo@aifinance.com",
        "password_hash": hashlib.sha256("demo123".encode()).hexdigest(),
        "full_name": "Demo User",
        "is_active": True,
        "created_at": "2024-01-01T00:00:00Z"
    },
    "user@example.com": {
        "email": "user@example.com", 
        "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
        "full_name": "Test User",
        "is_active": True,
        "created_at": "2024-01-01T00:00:00Z"
    }
}

# Pydantic models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class User(BaseModel):
    email: str
    full_name: str
    is_active: bool

class FinancialData(BaseModel):
    monthly_income: float
    dependants: int = 0
    transactions: Optional[list] = None
    manual_expenses: Optional[Dict[str, float]] = None
    debts: Optional[list] = None

# Utility functions
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
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return email
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(email: str = Depends(verify_token)):
    user = USERS_DB.get(email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

# Authentication endpoints
@app.post("/auth/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """Authenticate user and return access token"""
    user = USERS_DB.get(login_data.email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    password_hash = hashlib.sha256(login_data.password.encode()).hexdigest()
    if password_hash != user["password_hash"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    # Return token and user info
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user["email"],
            "full_name": user["full_name"],
            "is_active": user["is_active"]
        }
    }

@app.get("/auth/me", response_model=User)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return {
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "is_active": current_user["is_active"]
    }

@app.post("/auth/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout user (client should remove token)"""
    return {"message": "Successfully logged out"}

# Protected financial analysis endpoints
@app.post("/analyze")
async def analyze_finances(
    financial_data: FinancialData,
    current_user: dict = Depends(get_current_user)
):
    """Smart financial analysis with AI-first approach (Protected)"""
    try:
        # Add user context to analysis
        financial_data_dict = financial_data.dict()
        financial_data_dict["user_email"] = current_user["email"]
        financial_data_dict["user_name"] = current_user["full_name"]
        
        # Try AI analysis first
        if ai_service.is_available():
            print(f"🤖 AI analysis requested by user: {current_user['email']}")
            ai_result = ai_service.analyze_finances(financial_data_dict)
            ai_result["ai_analysis_available"] = True
            ai_result["analysis_type"] = "AI-Powered"
            ai_result["user_info"] = {
                "email": current_user["email"],
                "name": current_user["full_name"]
            }
            return ai_result
        else:
            print(f"⚠️ Fallback to basic analysis for user: {current_user['email']}")
            # Fallback to basic analysis
            return get_basic_analysis(financial_data_dict, current_user)
            
    except Exception as e:
        print(f"❌ Error in AI analysis for user {current_user['email']}: {str(e)}")
        return get_basic_analysis(financial_data_dict, current_user)

@app.post("/analyze-ai")
async def analyze_finances_ai_only(
    financial_data: FinancialData,
    current_user: dict = Depends(get_current_user)
):
    """AI-only financial analysis (Protected)"""
    if not ai_service.is_available():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI analysis service is currently unavailable"
        )
    
    try:
        financial_data_dict = financial_data.dict()
        financial_data_dict["user_email"] = current_user["email"]
        financial_data_dict["user_name"] = current_user["full_name"]
        
        print(f"🤖 AI-only analysis requested by user: {current_user['email']}")
        result = ai_service.analyze_finances(financial_data_dict)
        result["ai_analysis_available"] = True
        result["analysis_type"] = "AI-Only"
        result["user_info"] = {
            "email": current_user["email"],
            "name": current_user["full_name"]
        }
        return result
        
    except Exception as e:
        print(f"❌ AI analysis error for user {current_user['email']}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI analysis failed: {str(e)}"
        )

@app.post("/analyze-basic")
async def analyze_finances_basic(
    financial_data: FinancialData,
    current_user: dict = Depends(get_current_user)
):
    """Rule-based financial analysis (Protected)"""
    financial_data_dict = financial_data.dict()
    return get_basic_analysis(financial_data_dict, current_user)

def get_basic_analysis(financial_data: dict, user: dict):
    """Rule-based analysis fallback"""
    monthly_income = financial_data.get("monthly_income", 0)
    manual_expenses = financial_data.get("manual_expenses", {})
    debts = financial_data.get("debts", [])
    dependants = financial_data.get("dependants", 0)
    
    total_expenses = sum(manual_expenses.values()) if manual_expenses else 0
    remaining_budget = monthly_income - total_expenses
    
    # Basic recommendations
    recommendations = []
    if remaining_budget < monthly_income * 0.2:
        recommendations.append("Consider reducing discretionary spending")
    if not any("emergency" in str(expense).lower() for expense in manual_expenses.keys()):
        recommendations.append("Build an emergency fund")
    if debts:
        recommendations.append("Focus on high-interest debt repayment")
    
    return {
        "monthly_income": monthly_income,
        "total_expenses": total_expenses,
        "remaining_budget": remaining_budget,
        "budget_utilization": (total_expenses / monthly_income * 100) if monthly_income > 0 else 0,
        "recommendations": recommendations,
        "spending_categories": [
            {"category": k, "amount": v, "percentage": (v/total_expenses*100) if total_expenses > 0 else 0}
            for k, v in manual_expenses.items()
        ] if manual_expenses else [],
        "debt_summary": {
            "total_debt": sum(debt.get("amount", 0) for debt in debts),
            "monthly_payments": sum(debt.get("min_payment", 0) for debt in debts)
        } if debts else {"total_debt": 0, "monthly_payments": 0},
        "ai_analysis_available": False,
        "analysis_type": "Rule-Based",
        "user_info": {
            "email": user["email"],
            "name": user["full_name"]
        }
    }

# Public endpoints (no authentication required)
@app.get("/")
async def root():
    """Root endpoint with system information"""
    return {
        "message": "🤖 AI Financial Coach API",
        "version": "2.0.0",
        "features": [
            "🔐 JWT Authentication",
            "🤖 Google Gemini AI Integration", 
            "📊 Multi-Agent Financial Analysis",
            "💰 Smart Budget Optimization",
            "📈 Investment Insights",
            "🛡️ Secure User Management"
        ],
        "endpoints": {
            "auth": "/auth/login, /auth/me, /auth/logout",
            "analysis": "/analyze, /analyze-ai, /analyze-basic",
            "status": "/service-status, /health"
        }
    }

@app.get("/service-status")
async def service_status():
    """Get service status information"""
    return {
        "ai_available": ai_service.is_available(),
        "google_adk_installed": ai_service.google_adk_available,
        "api_key_configured": ai_service.api_key_configured,
        "service_type": "AI-Powered" if ai_service.is_available() else "Rule-Based",
        "timestamp": datetime.utcnow().isoformat(),
        "authentication": "JWT Bearer Token Required"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "uptime": time.time()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
