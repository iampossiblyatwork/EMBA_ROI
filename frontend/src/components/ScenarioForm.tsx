import {
  FILING_STATUS_HELP,
  FILING_STATUS_LABELS,
  FilingStatus,
  ScenarioInput,
  SUPPORTED_TAX_YEARS,
} from "../types";
import { CurrencyField } from "./fields/CurrencyField";
import { SegmentedField } from "./fields/SegmentedField";
import { SelectField } from "./fields/SelectField";
import { SliderField } from "./fields/SliderField";
import { YearStepper } from "./fields/YearStepper";

interface Props {
  title: string;
  accent: "a" | "b";
  value: ScenarioInput;
  onChange: (next: ScenarioInput) => void;
  errors?: Record<string, string>;
  onRemove?: () => void;
}

const SALARY_PRESETS = (current: number) => [
  { label: "Same", value: Math.round(current) },
  { label: "+10%", value: Math.round(current * 1.1) },
  { label: "+20%", value: Math.round(current * 1.2) },
  { label: "+30%", value: Math.round(current * 1.3) },
  { label: "+50%", value: Math.round(current * 1.5) },
];

const TUITION_PRESETS = [
  { label: "MSU Broad EMBA ($89k)", value: 89000 },
  { label: "Ross EMBA ($200k)", value: 200000 },
  { label: "Wharton EMBA ($240k)", value: 240000 },
];

export function ScenarioForm({ title, accent, value, onChange, errors, onRemove }: Props) {
  const set = <K extends keyof ScenarioInput>(key: K, next: ScenarioInput[K]) => {
    onChange({ ...value, [key]: next });
  };

  const accentBg = accent === "a" ? "bg-spartan-green" : "bg-amber-600";
  const workingYears = Math.max(1, value.retire_age - value.age);

  return (
    <section className="card overflow-hidden">
      <div className={`flex items-center justify-between px-6 py-3 text-white ${accentBg}`}>
        <h2 className="text-sm font-semibold uppercase tracking-wider">{title}</h2>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold uppercase tracking-wider hover:bg-white/20"
          >
            Remove
          </button>
        )}
      </div>

      <div className="space-y-5 p-6">
        {/* Timing block */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <YearStepper
            id={`${accent}-start_year`}
            label="Enrollment Year"
            value={value.start_year}
            onChange={(n) => set("start_year", n)}
            min={2024}
            max={2030}
          />
          <SliderField
            id={`${accent}-age`}
            label="Age at Enrollment"
            value={value.age}
            onChange={(n) => set("age", n)}
            min={22}
            max={65}
            formatValue={(n) => `${n}`}
            ticks={[
              { value: 22, label: "22" },
              { value: 65, label: "65" },
            ]}
          />
          <SliderField
            id={`${accent}-retire_age`}
            label="Retirement Age"
            value={value.retire_age}
            onChange={(n) => set("retire_age", n)}
            min={Math.max(value.age + 1, 50)}
            max={80}
            formatValue={(n) => `${n}`}
            ticks={[
              { value: 50, label: "50" },
              { value: 80, label: "80" },
            ]}
          />
        </div>

        {/* Program block */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SegmentedField
            label="Program Length"
            value={value.term_years}
            onChange={(n) => set("term_years", n)}
            options={[
              { label: "1 yr", value: 1 },
              { label: "2 yrs", value: 2 },
              { label: "3 yrs", value: 3, sublabel: "MSU" },
            ]}
          />
          <CurrencyField
            id={`${accent}-tuition`}
            label="Total Tuition"
            value={value.tuition}
            onChange={(n) => set("tuition", n)}
            error={errors?.tuition}
            presets={TUITION_PRESETS}
            hint={
              <>
                MSU Broad tuition includes books, materials, and meals.{" "}
                <a
                  href="https://broad.msu.edu/masters/executive-mba/tuition/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-spartan-green underline underline-offset-2 hover:text-spartan-kelly"
                >
                  Source ↗
                </a>
              </>
            }
          />
        </div>

        {/* Salary block */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CurrencyField
            id={`${accent}-current_salary`}
            label="Current Salary"
            value={value.current_salary}
            onChange={(n) => set("current_salary", n)}
            error={errors?.current_salary}
          />
          <CurrencyField
            id={`${accent}-expected_salary`}
            label="Expected Post-MBA Salary"
            value={value.expected_salary}
            onChange={(n) => set("expected_salary", n)}
            error={errors?.expected_salary}
            presets={SALARY_PRESETS(value.current_salary)}
            hint="Pick a multiplier of your current salary, or type a target."
          />
        </div>

        <SliderField
          id={`${accent}-salary_growth_pct`}
          label="Annual Salary Growth"
          value={value.salary_growth_pct}
          onChange={(n) => set("salary_growth_pct", n)}
          min={0}
          max={10}
          step={0.25}
          formatValue={(n) => `${n.toFixed(2)}%`}
          ticks={[
            { value: 0, label: "0%" },
            { value: 10, label: "10%" },
          ]}
          hint={`Applied to both pre- and post-MBA salaries over ${workingYears} working years.`}
        />

        {/* Tax block */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField<FilingStatus>
            id={`${accent}-filing_status`}
            label="Filing Status"
            value={value.filing_status}
            onChange={(v) => set("filing_status", v)}
            options={(Object.keys(FILING_STATUS_LABELS) as FilingStatus[]).map((k) => ({
              label: FILING_STATUS_LABELS[k],
              value: k,
            }))}
            hint={FILING_STATUS_HELP[value.filing_status]}
            error={errors?.filing_status}
          />
          <SelectField<number>
            id={`${accent}-tax_year`}
            label="Tax Year"
            value={value.tax_year}
            onChange={(v) => set("tax_year", v)}
            options={SUPPORTED_TAX_YEARS.map((y) => ({
              label: `${y} brackets${y === Math.max(...SUPPORTED_TAX_YEARS) ? " (latest)" : ""}`,
              value: y,
            }))}
            hint="Federal brackets used for the after-tax calculation."
            error={errors?.tax_year}
          />
        </div>
      </div>
    </section>
  );
}
