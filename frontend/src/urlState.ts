import { DEFAULT_SCENARIO, FilingStatus, LATEST_TAX_YEAR, ScenarioInput } from "./types";

const KEY_MAP: Record<keyof ScenarioInput, string> = {
  start_year: "s",
  age: "a",
  retire_age: "r",
  current_salary: "cs",
  expected_salary: "es",
  salary_growth_pct: "g",
  term_years: "t",
  tuition: "tu",
  filing_status: "fs",
  tax_year: "ty",
};

const VALID_STATUSES: FilingStatus[] = ["single", "mfj", "hoh"];

function encodeScenario(prefix: string, s: ScenarioInput): Record<string, string> {
  return {
    [prefix + KEY_MAP.start_year]: String(s.start_year),
    [prefix + KEY_MAP.age]: String(s.age),
    [prefix + KEY_MAP.retire_age]: String(s.retire_age),
    [prefix + KEY_MAP.current_salary]: String(s.current_salary),
    [prefix + KEY_MAP.expected_salary]: String(s.expected_salary),
    [prefix + KEY_MAP.salary_growth_pct]: String(s.salary_growth_pct),
    [prefix + KEY_MAP.term_years]: String(s.term_years),
    [prefix + KEY_MAP.tuition]: String(s.tuition),
    [prefix + KEY_MAP.filing_status]: s.filing_status,
    [prefix + KEY_MAP.tax_year]: String(s.tax_year),
  };
}

function decodeScenario(prefix: string, params: URLSearchParams): ScenarioInput | null {
  const has = params.has(prefix + KEY_MAP.start_year);
  if (!has) return null;

  const num = (key: keyof ScenarioInput, fallback: number): number => {
    const raw = params.get(prefix + KEY_MAP[key]);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  const fsRaw = params.get(prefix + KEY_MAP.filing_status);
  const filing_status: FilingStatus =
    fsRaw && (VALID_STATUSES as string[]).includes(fsRaw) ? (fsRaw as FilingStatus) : "single";

  return {
    start_year: num("start_year", DEFAULT_SCENARIO.start_year),
    age: num("age", DEFAULT_SCENARIO.age),
    retire_age: num("retire_age", DEFAULT_SCENARIO.retire_age),
    current_salary: num("current_salary", DEFAULT_SCENARIO.current_salary),
    expected_salary: num("expected_salary", DEFAULT_SCENARIO.expected_salary),
    salary_growth_pct: num("salary_growth_pct", DEFAULT_SCENARIO.salary_growth_pct),
    term_years: num("term_years", DEFAULT_SCENARIO.term_years),
    tuition: num("tuition", DEFAULT_SCENARIO.tuition),
    filing_status,
    tax_year: num("tax_year", LATEST_TAX_YEAR),
  };
}

export function encodeUrlState(a: ScenarioInput, b: ScenarioInput | null): string {
  const entries: Record<string, string> = encodeScenario("", a);
  if (b) Object.assign(entries, encodeScenario("b.", b));
  const params = new URLSearchParams(entries);
  return "?" + params.toString();
}

export function decodeUrlState(search: string): { a: ScenarioInput; b: ScenarioInput | null } {
  const params = new URLSearchParams(search);
  const a = decodeScenario("", params) ?? DEFAULT_SCENARIO;
  const b = decodeScenario("b.", params);
  return { a, b };
}
