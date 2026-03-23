from app.engine import run_simulation

def test_luzvc_precision():
    # Test case from canvas_gerado (Section 8)
    investimento = 100000
    fluxos = [30000, 40000, 50000, 60000]
    # In my engine, sales - costs = fluxos. Let's mock it.
    sales = fluxos
    costs = [0, 0, 0, 0]
    tma = 0.12
    
    results = run_simulation(investimento, tma, sales, costs)
    
    print(f"Results: {results}")
    
    # Assertions
    assert round(results['vpl'], 2) == 30972.18
    assert round(results['tir'], 4) == 0.2489
    assert results['is_viable'] == True
    
    print("✅ Math precision test passed!")

if __name__ == "__main__":
    test_luzvc_precision()
