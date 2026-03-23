from fastapi.testclient import TestClient
from app.main import app
import pytest

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Oravia Oracle API"}

def test_simulate_single():
    payload = {
        "project_name": "Test Project",
        "sector": "Tech",
        "initial_investment": 50000, # Lower investment
        "tma": 0.12,
        "monthly_sales": [40000, 40000, 40000, 40000], # Higher sales
        "monthly_costs": [10000, 10000, 10000, 10000]
    }
    response = client.post("/api/v1/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "vpl" in data
    assert "tir" in data
    assert "is_viable" in data
    assert data["is_viable"] == True

def test_simulate_multi():
    payload = {
        "project_name": "Multi Test",
        "sector": "Tech",
        "initial_investment": 100000,
        "tma": 0.12,
        "scenarios": {
            "pessimistic": {
                "monthly_sales": [10000, 10000, 10000, 10000],
                "monthly_costs": [15000, 15000, 15000, 15000]
            },
            "realistic": {
                "monthly_sales": [30000, 30000, 30000, 30000],
                "monthly_costs": [10000, 10000, 10000, 10000]
            },
            "optimistic": {
                "monthly_sales": [50000, 50000, 50000, 50000],
                "monthly_costs": [5000, 5000, 5000, 5000]
            }
        }
    }
    response = client.post("/api/v1/simulate/multi", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "scenarios" in data
    assert "monte_carlo" in data
    assert "realistic" in data["scenarios"]
    assert "pessimistic" in data["scenarios"]
    assert "optimistic" in data["scenarios"]
    assert data["monte_carlo"]["probability_of_success"] >= 0
