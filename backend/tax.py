from __future__ import annotations

RATES: tuple[float, ...] = (0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37)

# Lower bound of each rate's bracket, by tax year and filing status.
# Source: IRS Rev. Proc. 2023-34 (2024), 2024-40 (2025), 2025-32 (2026).
BRACKETS_BY_YEAR: dict[int, dict[str, tuple[float, ...]]] = {
    2024: {
        "single": (11_600, 47_150, 100_525, 191_950, 243_725, 609_350),
        "mfj":    (23_200, 94_300, 201_050, 383_900, 487_450, 731_200),
        "hoh":    (16_550, 63_100, 100_500, 191_950, 243_700, 609_350),
    },
    2025: {
        "single": (11_925, 48_475, 103_350, 197_300, 250_525, 626_350),
        "mfj":    (23_850, 96_950, 206_700, 394_600, 501_050, 751_600),
        "hoh":    (17_000, 64_850, 103_350, 197_300, 250_500, 626_350),
    },
    2026: {
        "single": (12_400, 50_400, 105_700, 201_775, 256_225, 640_600),
        "mfj":    (24_800, 100_800, 211_400, 403_550, 512_450, 768_700),
        "hoh":    (17_700, 67_450, 105_700, 201_775, 256_200, 640_600),
    },
}

LATEST_TAX_YEAR = max(BRACKETS_BY_YEAR.keys())
SUPPORTED_TAX_YEARS = tuple(sorted(BRACKETS_BY_YEAR.keys()))
FILING_STATUSES = tuple(BRACKETS_BY_YEAR[LATEST_TAX_YEAR].keys())


def calculate_tax(
    income: float,
    filing_status: str = "single",
    tax_year: int = LATEST_TAX_YEAR,
) -> float:
    if income <= 0:
        return 0.0

    # Clamp to nearest supported year so projections past the latest published
    # brackets still produce a reasonable estimate.
    year = max(min(tax_year, LATEST_TAX_YEAR), min(SUPPORTED_TAX_YEARS))
    if filing_status not in BRACKETS_BY_YEAR[year]:
        raise ValueError(f"Unknown filing_status: {filing_status!r}")

    thresholds = BRACKETS_BY_YEAR[year][filing_status]
    tax = 0.0
    lower = 0.0
    for threshold, rate in zip(thresholds, RATES):
        if income <= threshold:
            tax += (income - lower) * rate
            return tax
        tax += (threshold - lower) * rate
        lower = threshold

    tax += (income - lower) * RATES[-1]
    return tax
