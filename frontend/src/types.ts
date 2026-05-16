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
}

export interface ApiError {
  errors: Record<string, string>;
}

export const DEFAULT_SCENARIO: ScenarioInput = {
  start_year: 2024,
  age: 30,
  retire_age: 65,
  current_salary: 100000,
  expected_salary: 120000,
  salary_growth_pct: 3,
  term_years: 2,
  tuition: 90000,
  filing_status: "single",
};

export const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: "Single",
  mfj: "Married Filing Jointly",
  hoh: "Head of Household",
};
