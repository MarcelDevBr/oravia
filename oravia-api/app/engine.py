import numpy_financial as npf
import numpy as np
from typing import List, Dict, Any

def calculate_vpl(tma: float, cash_flows: List[float]) -> float:
    """Calculate Net Present Value (VPL)."""
    return float(npf.npv(tma, cash_flows))

def calculate_tir(cash_flows: List[float]) -> float:
    """Calculate Internal Rate of Return (TIR/IRR)."""
    try:
        # npf.irr can return nan or fail if no sign change
        res = npf.irr(cash_flows)
        return float(res) if not np.isnan(res) else 0.0
    except (ValueError, TypeError):
        return 0.0

def calculate_payback(initial_investment: float, monthly_cash_flows: List[float]) -> int:
    """Calculate Payback period in months."""
    cumulative_cash_flow = -initial_investment
    for month, flow in enumerate(monthly_cash_flows):
        cumulative_cash_flow += flow
        if cumulative_cash_flow >= 0:
            return month + 1
    return len(monthly_cash_flows) + 1

def run_simulation(initial_investment: float, tma: float, sales: List[float], costs: List[float]) -> Dict[str, Any]:
    """Run full financial simulation for a single scenario."""
    monthly_flows = [s - c for s, c in zip(sales, costs)]
    cash_flows_for_npv = [-initial_investment] + monthly_flows
    vpl = calculate_vpl(tma, cash_flows_for_npv)
    tir = calculate_tir(cash_flows_for_npv)
    payback = calculate_payback(initial_investment, monthly_flows)
    
    return {
        "vpl": round(vpl, 2),
        "tir": round(tir, 4),
        "payback_months": payback,
        "is_viable": vpl > 0
    }

def run_monte_carlo(
    initial_investment: float, 
    tma: float, 
    avg_sales: List[float], 
    avg_costs: List[float], 
    volatility: float = 0.2, 
    iterations: int = 1000
) -> Dict[str, Any]:
    """
    Run Monte Carlo simulation to assess risk.
    volatility: standard deviation as a percentage of the mean.
    """
    vpls = []
    successes = 0
    
    for _ in range(iterations):
        # Simulate sales and costs with normal distribution
        sim_sales = [max(0, np.random.normal(s, s * volatility)) for s in avg_sales]
        sim_costs = [max(0, np.random.normal(c, c * volatility)) for c in avg_costs]
        
        monthly_flows = [s - c for s, c in zip(sim_sales, sim_costs)]
        cash_flows = [-initial_investment] + monthly_flows
        vpl = calculate_vpl(tma, cash_flows)
        
        vpls.append(vpl)
        if vpl > 0:
            successes += 1
            
    vpls = np.array(vpls)
    return {
        "probability_of_success": round(successes / iterations, 4),
        "expected_vpl": round(float(np.mean(vpls)), 2),
        "vpl_std": round(float(np.std(vpls)), 2),
        "worst_case_vpl": round(float(np.min(vpls)), 2),
        "best_case_vpl": round(float(np.max(vpls)), 2)
    }
