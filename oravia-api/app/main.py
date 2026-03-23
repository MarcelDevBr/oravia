from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import FinancialInputs, FinancialResults, MultiScenarioInputs, SimulationFullOutput, MonteCarloResults
from app.engine import run_simulation, run_monte_carlo

app = FastAPI(title="Oravia API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Oravia Oracle API"}

@app.post("/api/v1/simulate/multi", response_model=SimulationFullOutput)
def simulate_multi(inputs: MultiScenarioInputs):
    """Run financial simulation for multiple scenarios and Monte Carlo."""
    try:
        scenarios_results = {}
        for name, scenario_input in inputs.scenarios.items():
            res = run_simulation(
                initial_investment=inputs.initial_investment,
                tma=inputs.tma,
                sales=scenario_input.monthly_sales,
                costs=scenario_input.monthly_costs
            )
            res["verdict"] = "Viável" if res["is_viable"] else "Risco Elevado"
            scenarios_results[name] = res
        
        # Run Monte Carlo on the "realistic" scenario if it exists
        mc_results = None
        if "realistic" in inputs.scenarios:
            realistic = inputs.scenarios["realistic"]
            mc_results = run_monte_carlo(
                initial_investment=inputs.initial_investment,
                tma=inputs.tma,
                avg_sales=realistic.monthly_sales,
                avg_costs=realistic.monthly_costs
            )
            
        return {
            "scenarios": scenarios_results,
            "monte_carlo": mc_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/simulate", response_model=FinancialResults)
def simulate(inputs: FinancialInputs):
    # Backward compatibility or simple single-run
    try:
        results = run_simulation(
            initial_investment=inputs.initial_investment,
            tma=inputs.tma,
            sales=inputs.monthly_sales,
            costs=inputs.monthly_costs
        )
        results["verdict"] = "Viável" if results["is_viable"] else "Risco Elevado"
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
