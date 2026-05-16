from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any

from .tax import FILING_STATUSES


@dataclass
class ScenarioInput:
    start_year: int
    age: int
    retire_age: int
    current_salary: float
    expected_salary: float
    salary_growth_pct: float
    term_years: int
    tuition: float
    filing_status: str = "single"

    @classmethod
    def from_payload(cls, payload: dict[str, Any]) -> "ScenarioInput":
        try:
            return cls(
                start_year=int(payload["start_year"]),
                age=int(payload["age"]),
                retire_age=int(payload["retire_age"]),
                current_salary=float(payload["current_salary"]),
                expected_salary=float(payload["expected_salary"]),
                salary_growth_pct=float(payload["salary_growth_pct"]),
                term_years=int(payload["term_years"]),
                tuition=float(payload["tuition"]),
                filing_status=str(payload.get("filing_status", "single")),
            )
        except (KeyError, TypeError, ValueError) as exc:
            raise ValueError(f"Invalid input payload: {exc}") from exc


def validate(inp: ScenarioInput) -> dict[str, str]:
    errors: dict[str, str] = {}
    if inp.filing_status not in FILING_STATUSES:
        errors["filing_status"] = f"Must be one of {', '.join(FILING_STATUSES)}."
    if inp.start_year < 1900 or inp.start_year > 2200:
        errors["start_year"] = "Year must be between 1900 and 2200."
    if inp.age < 16 or inp.age > 100:
        errors["age"] = "Age must be between 16 and 100."
    if inp.retire_age <= inp.age:
        errors["retire_age"] = "Retirement age must be greater than current age."
    if inp.retire_age > 100:
        errors["retire_age"] = "Retirement age must be 100 or less."
    if inp.current_salary < 0:
        errors["current_salary"] = "Salary cannot be negative."
    if inp.expected_salary < 0:
        errors["expected_salary"] = "Salary cannot be negative."
    if inp.salary_growth_pct < 0 or inp.salary_growth_pct > 100:
        errors["salary_growth_pct"] = "Growth rate must be between 0 and 100."
    if inp.term_years < 0:
        errors["term_years"] = "Program length cannot be negative."
    if inp.term_years > (inp.retire_age - inp.age):
        errors["term_years"] = "Program length cannot exceed working years."
    if inp.tuition < 0:
        errors["tuition"] = "Tuition cannot be negative."
    return errors


@dataclass
class YearRow:
    year: int
    age: int
    pre_mba_salary: float
    post_mba_salary: float
    pre_mba_after_tax: float
    post_mba_after_tax: float
    tuition_cost: float
    delta: float
    running_total: float


@dataclass
class ScenarioResult:
    rows: list[YearRow] = field(default_factory=list)
    break_even_year: int | None = None
    break_even_age: int | None = None
    lifelong_return: float = 0.0
    total_tuition: float = 0.0

    def to_dict(self) -> dict[str, Any]:
        return {
            "rows": [asdict(r) for r in self.rows],
            "break_even_year": self.break_even_year,
            "break_even_age": self.break_even_age,
            "lifelong_return": self.lifelong_return,
            "total_tuition": self.total_tuition,
        }
