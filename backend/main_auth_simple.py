from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import jwt
import hashlib
import time
from datetime import datetime, timedelta
import os

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
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class UserProfile(BaseModel):
    email: str
    full_name: str
    is_active: bool
    created_at: str

class FinancialData(BaseModel):
    monthly_income: float = Field(..., description="Monthly income in USD")
    monthly_expenses: float = Field(..., description="Monthly expenses in USD")
    current_savings: float = Field(default=0, description="Current savings in USD")
    debt_amount: float = Field(default=0, description="Total debt amount in USD")
    financial_goals: str = Field(..., description="Financial goals description")
    age: int = Field(..., description="Age of the user")
    risk_tolerance: str = Field(..., description="Risk tolerance: low, medium, or high")

# Utility functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return email
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def authenticate_user(email: str, password: str):
    user = USERS_DB.get(email)
    if not user:
        return False
    
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    if user["password_hash"] != password_hash:
        return False
    
    return user

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "AI Financial Coach API",
        "version": "2.0.0",
        "features": {
            "authentication": True,
            "ai_analysis": False,  # Will be True when AI service is connected
            "cors_enabled": True
        }
    }

# Authentication endpoints
@app.post("/auth/register", response_model=Dict[str, str])
async def register(user_data: RegisterRequest):
    """Register a new user"""
    if user_data.email in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    password_hash = hashlib.sha256(user_data.password.encode()).hexdigest()
    USERS_DB[user_data.email] = {
        "email": user_data.email,
        "password_hash": password_hash,
        "full_name": user_data.full_name,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat()
    }
    
    return {"message": "User registered successfully"}

@app.post("/auth/login", response_model=TokenResponse)
async def login(login_data: LoginRequest):
    """Authenticate user and return JWT token"""
    user = authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@app.get("/auth/profile", response_model=UserProfile)
async def get_profile(current_user_email: str = Depends(verify_token)):
    """Get current user profile"""
    user = USERS_DB.get(current_user_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserProfile(
        email=user["email"],
        full_name=user["full_name"],
        is_active=user["is_active"],
        created_at=user["created_at"]
    )

@app.post("/auth/logout")
async def logout(current_user_email: str = Depends(verify_token)):
    """Logout user (client should discard token)"""
    return {"message": "Successfully logged out"}

# Protected financial analysis endpoints
@app.post("/analyze")
async def analyze_finances(
    financial_data: FinancialData,
    current_user_email: str = Depends(verify_token)
):
    """Analyze financial data (protected endpoint)"""
    
    # Basic financial analysis without AI for now
    monthly_savings = financial_data.monthly_income - financial_data.monthly_expenses
    savings_rate = (monthly_savings / financial_data.monthly_income) * 100 if financial_data.monthly_income > 0 else 0
    
    # Simple analysis
    analysis = {
        "user_email": current_user_email,
        "timestamp": datetime.utcnow().isoformat(),
        "financial_summary": {
            "monthly_income": financial_data.monthly_income,
            "monthly_expenses": financial_data.monthly_expenses,
            "monthly_savings": monthly_savings,
            "savings_rate_percentage": round(savings_rate, 2),
            "current_savings": financial_data.current_savings,
            "debt_amount": financial_data.debt_amount,
            "net_worth": financial_data.current_savings - financial_data.debt_amount
        },
        "basic_recommendations": {
            "budget_analysis": "Good savings rate!" if savings_rate > 20 else "Try to increase your savings rate",
            "savings_strategy": "Emergency fund first" if financial_data.current_savings < financial_data.monthly_expenses * 6 else "Consider investing",
            "debt_reduction": "Focus on debt reduction" if financial_data.debt_amount > 0 else "Debt-free - great job!"
        },
        "ai_analysis_available": False,
        "note": "Full AI analysis will be available when AI service is connected"
    }
    
    return analysis

@app.get("/protected-test")
async def protected_test(current_user_email: str = Depends(verify_token)):
    """Test protected endpoint"""
    return {
        "message": "This is a protected endpoint",
        "user": current_user_email,
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
