from __future__ import annotations

RATES: tuple[float, ...] = (0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37)

BRACKETS: dict[str, tuple[float, ...]] = {
    "single": (11_600, 47_150, 100_525, 191_950, 243_725, 609_350),
    "mfj":    (23_200, 94_300, 201_050, 383_900, 487_450, 731_200),
    "hoh":    (16_550, 63_100, 100_500, 191_950, 243_700, 609_350),
}

FILING_STATUSES = tuple(BRACKETS.keys())


def calculate_tax(income: float, filing_status: str = "single") -> float:
    if income <= 0:
        return 0.0
    if filing_status not in BRACKETS:
        raise ValueError(f"Unknown filing_status: {filing_status!r}")

    thresholds = BRACKETS[filing_status]
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
