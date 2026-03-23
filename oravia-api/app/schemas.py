from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class FinancialInputs(BaseModel):
    project_name: str = Field(..., example="My New Business")
    sector: str = Field(..., example="Technology")
    initial_investment: float = Field(..., example=100000.0)
    tma: float = Field(default=0.12, description="Taxa Mínima de Atratividade (Discount Rate)")
    months: int = Field(default=12, description="Duration of projection in months")
    
    # Projections
    monthly_sales: List[float] = Field(..., description="Estimated sales per month")
    monthly_costs: List[float] = Field(..., description="Estimated costs per month")
    
class FinancialResults(BaseModel):
    vpl: float
    tir: float
    payback_months: int
    is_viable: bool
    verdict: Optional[str] = None

class MonteCarloResults(BaseModel):
    probability_of_success: float
    expected_vpl: float
    vpl_std: float
    worst_case_vpl: float
    best_case_vpl: float

class ScenarioInput(BaseModel):
    monthly_sales: List[float]
    monthly_costs: List[float]

class MultiScenarioInputs(BaseModel):
    project_name: str
    sector: str
    initial_investment: float
    tma: float
    scenarios: Dict[str, ScenarioInput]  # e.g., {"realistic": ..., "optimistic": ...}

class SimulationFullOutput(BaseModel):
    scenarios: Dict[str, FinancialResults]
    monte_carlo: Optional[MonteCarloResults] = None
