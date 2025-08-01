from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import pandas as pd
import json
import io

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
            "debt_reduction": debt_reduction
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_endpoint(chat_data: ChatMessage):
    """Simple chat endpoint - currently returns a placeholder response."""
    return {
        "response": "Hello! I'm your AI Financial Coach. Please use the finance form above to get detailed analysis of your financial situation. The interactive chat feature is coming soon!"
    }

@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...), monthly_income: float = Form(...), dependants: int = Form(0)):
    """Accept CSV file, parse, and analyze."""
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
        
        # Analyze budget
        budget_analysis = analyze_budget(data)
        
        # Analyze savings strategy
        savings_strategy = analyze_savings(data, budget_analysis)
        
        # Analyze debt reduction
        debt_reduction = analyze_debt_reduction(data)
        
        return {
            "budget_analysis": budget_analysis,
            "savings_strategy": savings_strategy,
            "debt_reduction": debt_reduction
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "AI Financial Coach Backend API", "status": "running"}

if __name__ == "__main__":
    print("🚀 Starting AI Financial Coach Backend...")
    print("📡 API will be available at: http://localhost:8000")
    print("📋 API docs available at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
