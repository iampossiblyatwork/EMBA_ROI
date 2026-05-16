import pytest

from backend import create_app


@pytest.fixture()
def client():
    app = create_app()
    app.testing = True
    return app.test_client()


def _payload(**overrides):
    base = dict(
        start_year=2024,
        age=30,
        retire_age=65,
        current_salary=100_000,
        expected_salary=120_000,
        salary_growth_pct=3,
        term_years=2,
        tuition=90_000,
        filing_status="single",
    )
    base.update(overrides)
    return base


def test_healthz(client):
    resp = client.get("/healthz")
    assert resp.status_code == 200
    assert resp.get_json() == {"status": "ok"}


def test_calculate_happy_path(client):
    resp = client.post("/api/calculate", json=_payload())
    assert resp.status_code == 200
    body = resp.get_json()
    assert "rows" in body
    assert len(body["rows"]) == 36
    assert body["total_tuition"] == 90_000
    assert body["break_even_year"] is not None


def test_calculate_validation_error(client):
    resp = client.post("/api/calculate", json=_payload(retire_age=25))
    assert resp.status_code == 400
    body = resp.get_json()
    assert "errors" in body
    assert "retire_age" in body["errors"]


def test_calculate_rejects_non_json(client):
    resp = client.post("/api/calculate", data="not-json", content_type="text/plain")
    assert resp.status_code == 400


def test_calculate_unknown_filing_status(client):
    resp = client.post("/api/calculate", json=_payload(filing_status="bogus"))
    assert resp.status_code == 400
    assert "filing_status" in resp.get_json()["errors"]
