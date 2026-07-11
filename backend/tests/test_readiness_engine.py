from app.engines.readiness import calculate_readiness


def test_readiness_engine_returns_valid_scores():
    startup = {
        "problem_statement": (
            "Small businesses struggle to identify suitable "
            "funding opportunities efficiently and transparently."
        ),
        "solution_statement": (
            "The platform analyzes startup information and produces "
            "explainable funding readiness and investor compatibility."
        ),
        "business_model": (
            "The startup uses a subscription-based SaaS model "
            "with tiered access to funding intelligence."
        ),
        "competitive_advantage": (
            "The system combines explainable readiness scoring "
            "with structured investor compatibility analysis."
        ),
        "target_market": (
            "Early-stage startups and small businesses seeking "
            "structured funding guidance and investor discovery."
        ),
        "industry": "FinTech",
        "sub_industry": "Funding Intelligence",
        "headquarters_country": "India",
        "customer_count": 25,
        "revenue_status": "revenue_generating",
        "annual_revenue_usd": 50000,
        "traction_summary": (
            "The startup has acquired paying customers and "
            "validated demand through measurable adoption."
        ),
        "team_size": 5,
        "full_time_founders": 2,
        "target_raise_usd": 500000,
        "minimum_investment_usd": 25000,
        "funding_status": "bootstrapped",
        "total_funding_raised_usd": 0,
    }

    result = calculate_readiness(startup)

    assert 0 <= result["overall_score"] <= 100
    assert 0 <= result["business_clarity_score"] <= 100
    assert 0 <= result["market_readiness_score"] <= 100
    assert 0 <= result["traction_score"] <= 100
    assert 0 <= result["team_strength_score"] <= 100
    assert 0 <= result["funding_preparedness_score"] <= 100

    assert result["methodology_version"] == "1.0.0"
    assert isinstance(result["score_breakdown"], dict)
    assert isinstance(result["recommendations"], list)


def test_same_input_produces_same_result():
    startup = {
        "problem_statement": "A clearly described genuine problem.",
        "solution_statement": "A clearly described genuine solution.",
        "business_model": "A subscription business model.",
        "competitive_advantage": "A meaningful competitive advantage.",
        "target_market": "A defined target customer segment and geography.",
        "industry": "Technology",
        "sub_industry": "SaaS",
        "headquarters_country": "India",
        "customer_count": 0,
        "revenue_status": "pre_revenue",
        "annual_revenue_usd": None,
        "traction_summary": None,
        "team_size": 2,
        "full_time_founders": 1,
        "target_raise_usd": 100000,
        "minimum_investment_usd": 10000,
        "funding_status": "bootstrapped",
        "total_funding_raised_usd": 0,
    }

    first_result = calculate_readiness(startup)
    second_result = calculate_readiness(startup)

    assert first_result == second_result