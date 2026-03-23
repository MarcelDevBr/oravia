import requests
import json

def test_multi_scenario_api():
    url = "http://localhost:8000/api/v1/simulate/multi"
    
    payload = {
        "project_name": "Oravia Expansion",
        "sector": "Fintech",
        "initial_investment": 200000,
        "tma": 0.12,
        "scenarios": {
            "pessimistic": {
                "project_name": "Pessimistic",
                "sector": "Fintech",
                "initial_investment": 200000,
                "monthly_sales": [10000, 15000, 20000, 25000],
                "monthly_costs": [12000, 12000, 12000, 12000]
            },
            "realistic": {
                "project_name": "Realistic",
                "sector": "Fintech",
                "initial_investment": 200000,
                "monthly_sales": [30000, 40000, 50000, 60000],
                "monthly_costs": [15000, 15000, 15000, 15000]
            },
            "optimistic": {
                "project_name": "Optimistic",
                "sector": "Fintech",
                "initial_investment": 200000,
                "monthly_sales": [50000, 70000, 90000, 110000],
                "monthly_costs": [20000, 20000, 20000, 20000]
            }
        }
    }
    
    # This requires the server to be running.
    # For now, let's just test the logic locally in engine.py
    from app.engine import run_simulation, run_monte_carlo
    
    print("Testing Multi-Scenario Logic...")
    for name, data in payload["scenarios"].items():
        res = run_simulation(payload["initial_investment"], payload["tma"], data["monthly_sales"], data["monthly_costs"])
        print(f"Scenario {name}: VPL={res['vpl']}, Viable={res['is_viable']}")
        
    print("\nTesting Monte Carlo Logic...")
    mc = run_monte_carlo(
        payload["initial_investment"], 
        payload["tma"], 
        payload["scenarios"]["realistic"]["monthly_sales"], 
        payload["scenarios"]["realistic"]["monthly_costs"]
    )
    print(f"Monte Carlo: Success Probability={mc['probability_of_success'] * 100}%")
    print(f"Expected VPL: {mc['expected_vpl']}")

if __name__ == "__main__":
    test_multi_scenario_api()
