import pytest

from backend.calculator import (
    build_projection,
    exgrowth_series,
    growth_series,
    tuition_series,
)
from backend.schemas import ScenarioInput


def test_growth_series_length_and_endpoints():
    s = growth_series(100, 10, 5)
    assert len(s) == 5
    assert s[0] == pytest.approx(100)
    assert s[-1] == pytest.approx(100 * 1.1 ** 4, rel=1e-4)


def test_growth_series_zero_length():
    assert growth_series(100, 5, 0) == []


def test_exgrowth_pre_then_post():
    out = exgrowth_series(pre_start=100, post_start=200, rate_pct=0, n=5, term=2)
    assert out[:2] == [100.0, 100.0]
    assert out[2:] == [200.0, 200.0, 200.0]


def test_tuition_series_sums_to_negative_total():
    out = tuition_series(90_000, term=2, n=5)
    assert sum(out) == pytest.approx(-90_000)
    assert out[2:] == [0.0, 0.0, 0.0]


def test_tuition_series_zero_term():
    assert tuition_series(90_000, term=0, n=5) == [0.0] * 5


def _default_scenario(**overrides):
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
    return ScenarioInput(**base)


def test_projection_shape_and_total_tuition():
    result = build_projection(_default_scenario())
    assert len(result.rows) == 36
    assert result.total_tuition == pytest.approx(90_000)
    assert result.rows[0].year == 2024
    assert result.rows[0].age == 30
    assert result.rows[-1].age == 65
    # Tuition only during program years.
    assert result.rows[0].tuition_cost < 0
    assert result.rows[1].tuition_cost < 0
    assert result.rows[2].tuition_cost == 0


def test_projection_break_even_present_with_higher_expected_salary():
    result = build_projection(_default_scenario())
    assert result.break_even_year is not None
    assert result.break_even_age is not None


def test_projection_no_break_even_when_post_less_than_pre():
    result = build_projection(_default_scenario(expected_salary=50_000))
    assert result.break_even_year is None
    assert result.lifelong_return < 0
