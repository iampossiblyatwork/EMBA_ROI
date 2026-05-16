import pytest

from backend.tax import LATEST_TAX_YEAR, SUPPORTED_TAX_YEARS, calculate_tax


def test_zero_and_negative_income():
    assert calculate_tax(0) == 0
    assert calculate_tax(-1000) == 0


def test_latest_year_is_2026():
    assert LATEST_TAX_YEAR == 2026
    assert 2024 in SUPPORTED_TAX_YEARS
    assert 2025 in SUPPORTED_TAX_YEARS
    assert 2026 in SUPPORTED_TAX_YEARS


def test_single_first_bracket():
    assert calculate_tax(10_000, "single") == pytest.approx(1_000.0)


def test_single_100k_2024():
    # 2024 single brackets: 11,600 / 47,150 / 100,525 / …
    expected = 11_600 * 0.10 + (47_150 - 11_600) * 0.12 + (100_000 - 47_150) * 0.22
    assert calculate_tax(100_000, "single", 2024) == pytest.approx(expected)


def test_single_100k_2026():
    # 2026 single brackets: 12,400 / 50,400 / 105,700 / …
    # 100,000 sits inside the 22% bracket, lower bound 50,400.
    expected = 12_400 * 0.10 + (50_400 - 12_400) * 0.12 + (100_000 - 50_400) * 0.22
    assert calculate_tax(100_000, "single", 2026) == pytest.approx(expected)


def test_brackets_increase_with_year():
    # Tax owed on a fixed income should drop slightly as brackets inflate.
    t24 = calculate_tax(150_000, "single", 2024)
    t26 = calculate_tax(150_000, "single", 2026)
    assert t26 < t24


def test_default_tax_year_is_latest():
    assert calculate_tax(100_000, "single") == calculate_tax(100_000, "single", LATEST_TAX_YEAR)


def test_mfj_lower_than_single_at_same_income():
    assert calculate_tax(100_000, "mfj") < calculate_tax(100_000, "single")


def test_top_bracket_2026():
    base = calculate_tax(640_600, "single", 2026)
    above = calculate_tax(740_600, "single", 2026)
    assert above - base == pytest.approx(100_000 * 0.37)


def test_unknown_status_raises():
    with pytest.raises(ValueError):
        calculate_tax(50_000, "bogus")


def test_future_year_clamps_to_latest():
    # Projections may pass tax_year=2040; we should still produce a number,
    # using the latest published brackets.
    assert calculate_tax(100_000, "single", 2040) == calculate_tax(100_000, "single", 2026)
