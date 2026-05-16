export type FilingStatus = "single" | "mfj" | "hoh";

export interface ScenarioInput {
  start_year: number;
  age: number;
  retire_age: number;
  current_salary: number;
  expected_salary: number;
  salary_growth_pct: number;
  term_years: number;
  tuition: number;
  filing_status: FilingStatus;
  tax_year: number;
}

export interface YearRow {
  year: number;
  age: number;
  pre_mba_salary: number;
  post_mba_salary: number;
  pre_mba_after_tax: number;
  post_mba_after_tax: number;
  tuition_cost: number;
  delta: number;
  running_total: number;
}

export interface ScenarioResult {
  rows: YearRow[];
  break_even_year: number | null;
  break_even_age: number | null;
  lifelong_return: number;
  total_tuition: number;
  tax_year: number;
}

export interface ApiError {
  errors: Record<string, string>;
}

export const SUPPORTED_TAX_YEARS = [2024, 2025, 2026] as const;
export const LATEST_TAX_YEAR = 2026;

const CURRENT_YEAR = new Date().getFullYear();

export const DEFAULT_SCENARIO: ScenarioInput = {
  start_year: CURRENT_YEAR,
  age: 30,
  retire_age: 65,
  current_salary: 192000,
  expected_salary: 226000,
  salary_growth_pct: 3,
  term_years: 3,
  tuition: 89000,
  filing_status: "single",
  tax_year: LATEST_TAX_YEAR,
};

export const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: "Single",
  mfj: "Married Filing Jointly",
  hoh: "Head of Household",
};

export const FILING_STATUS_HELP: Record<FilingStatus, string> = {
  single: "Unmarried, divorced, or legally separated.",
  mfj: "Married couples combining income — typically the most favorable rate structure.",
  hoh: "Unmarried but supporting a qualifying dependent.",
};

export function noMbaBaseline(s: ScenarioInput): ScenarioInput {
  return {
    ...s,
    term_years: 0,
    tuition: 0,
    expected_salary: s.current_salary,
  };
}

export function clampScenario(s: ScenarioInput): ScenarioInput {
  const age = Math.max(16, Math.min(100, Math.round(s.age)));
  const retire_age = Math.max(age + 1, Math.min(100, Math.round(s.retire_age)));
  const working = retire_age - age;
  const term_years = Math.max(0, Math.min(working, Math.round(s.term_years)));
  return {
    ...s,
    age,
    retire_age,
    term_years,
    current_salary: Math.max(0, s.current_salary),
    expected_salary: Math.max(0, s.expected_salary),
    tuition: Math.max(0, s.tuition),
    salary_growth_pct: Math.max(0, Math.min(20, s.salary_growth_pct)),
    start_year: Math.max(2000, Math.min(2100, Math.round(s.start_year))),
  };
}
