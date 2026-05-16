import pytest

from backend.tax import calculate_tax


def test_zero_and_negative_income():
    assert calculate_tax(0) == 0
    assert calculate_tax(-1000) == 0


def test_single_first_bracket():
    # 10% on the whole amount when it sits inside the first bracket.
    assert calculate_tax(10_000, "single") == pytest.approx(1_000.0)


def test_single_100k():
    # 1160 + (47150-11600)*.12 + (100000-47150)*.22
    expected = 11_600 * 0.10 + (47_150 - 11_600) * 0.12 + (100_000 - 47_150) * 0.22
    assert calculate_tax(100_000, "single") == pytest.approx(expected)


def test_mfj_100k_lower_than_single():
    assert calculate_tax(100_000, "mfj") < calculate_tax(100_000, "single")


def test_top_bracket():
    # Income above 609,350 single uses 37% on the marginal slice.
    base = calculate_tax(609_350, "single")
    above = calculate_tax(709_350, "single")
    assert above - base == pytest.approx(100_000 * 0.37)


def test_unknown_status_raises():
    with pytest.raises(ValueError):
        calculate_tax(50_000, "bogus")
