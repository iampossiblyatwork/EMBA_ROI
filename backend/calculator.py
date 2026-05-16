from __future__ import annotations

from .schemas import ScenarioInput, ScenarioResult, YearRow
from .tax import calculate_tax


def growth_series(start: float, rate_pct: float, n: int) -> list[float]:
    if n <= 0:
        return []
    factor = 1.0 + rate_pct / 100.0
    return [round(start * (factor ** i), 2) for i in range(n)]


def exgrowth_series(
    pre_start: float,
    post_start: float,
    rate_pct: float,
    n: int,
    term: int,
) -> list[float]:
    term = max(0, min(term, n))
    pre = growth_series(pre_start, rate_pct, term)
    post = growth_series(post_start, rate_pct, n - term)
    return pre + post


def tuition_series(total_tuition: float, term: int, n: int) -> list[float]:
    if term <= 0 or total_tuition == 0:
        return [0.0] * n
    per_year = -float(total_tuition) / term
    out = [per_year] * min(term, n)
    out += [0.0] * (n - len(out))
    return out


def build_projection(inp: ScenarioInput) -> ScenarioResult:
    n = inp.retire_age + 1 - inp.age
    if n <= 0:
        return ScenarioResult()

    years = list(range(inp.start_year, inp.start_year + n))
    ages = list(range(inp.age, inp.retire_age + 1))

    pre = growth_series(inp.current_salary, inp.salary_growth_pct, n)
    post = exgrowth_series(
        inp.current_salary,
        inp.expected_salary,
        inp.salary_growth_pct,
        n,
        inp.term_years,
    )
    tuition = tuition_series(inp.tuition, inp.term_years, n)

    pre_after_tax = [round(s - calculate_tax(s, inp.filing_status), 2) for s in pre]
    post_after_tax = [round(s - calculate_tax(s, inp.filing_status), 2) for s in post]

    rows: list[YearRow] = []
    running = 0.0
    break_even_year: int | None = None
    break_even_age: int | None = None

    for i in range(n):
        delta = round(post_after_tax[i] - pre_after_tax[i] + tuition[i], 2)
        running = round(running + delta, 2)
        rows.append(
            YearRow(
                year=years[i],
                age=ages[i],
                pre_mba_salary=pre[i],
                post_mba_salary=post[i],
                pre_mba_after_tax=pre_after_tax[i],
                post_mba_after_tax=post_after_tax[i],
                tuition_cost=round(tuition[i], 2),
                delta=delta,
                running_total=running,
            )
        )
        if break_even_year is None and running >= 0 and i >= inp.term_years:
            break_even_year = years[i]
            break_even_age = ages[i]

    return ScenarioResult(
        rows=rows,
        break_even_year=break_even_year,
        break_even_age=break_even_age,
        lifelong_return=rows[-1].running_total if rows else 0.0,
        total_tuition=float(inp.tuition),
    )
