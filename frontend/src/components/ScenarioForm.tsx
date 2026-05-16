import { FILING_STATUS_LABELS, FilingStatus, ScenarioInput } from "../types";

interface Props {
  title: string;
  accent: "a" | "b";
  value: ScenarioInput;
  onChange: (next: ScenarioInput) => void;
  errors?: Record<string, string>;
  onRemove?: () => void;
}

type NumericKey = Exclude<keyof ScenarioInput, "filing_status">;

interface FieldDef {
  key: NumericKey;
  label: string;
  step?: number;
  min?: number;
  max?: number;
  unit?: "$" | "%" | "yrs";
}

const FIELDS: FieldDef[] = [
  { key: "start_year", label: "Enrollment Year", min: 2000, max: 2100 },
  { key: "age", label: "Age at Enrollment", min: 16, max: 100 },
  { key: "retire_age", label: "Retirement Age", min: 16, max: 100 },
  { key: "current_salary", label: "Current Salary", min: 0, step: 1000, unit: "$" },
  { key: "expected_salary", label: "Expected Post-MBA Salary", min: 0, step: 1000, unit: "$" },
  { key: "salary_growth_pct", label: "Annual Salary Growth", min: 0, max: 100, step: 0.1, unit: "%" },
  { key: "term_years", label: "Program Length", min: 0, max: 10, unit: "yrs" },
  { key: "tuition", label: "Total Tuition", min: 0, step: 1000, unit: "$" },
];

export function ScenarioForm({ title, accent, value, onChange, errors, onRemove }: Props) {
  const setField = (key: NumericKey, raw: string) => {
    const num = raw === "" ? 0 : Number(raw);
    onChange({ ...value, [key]: Number.isFinite(num) ? num : 0 });
  };

  const setFiling = (raw: string) => {
    onChange({ ...value, filing_status: raw as FilingStatus });
  };

  const accentBg = accent === "a" ? "bg-spartan-green" : "bg-amber-600";

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
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label htmlFor={`${accent}-${f.key}`} className="field-label">
              {f.label}
              {f.unit ? <span className="ml-1 text-slate-400">({f.unit})</span> : null}
            </label>
            <input
              id={`${accent}-${f.key}`}
              type="number"
              className="field-input mt-1"
              value={value[f.key]}
              min={f.min}
              max={f.max}
              step={f.step ?? 1}
              onChange={(e) => setField(f.key, e.target.value)}
            />
            {errors?.[f.key] && <p className="field-error">{errors[f.key]}</p>}
          </div>
        ))}
        <div className="sm:col-span-2">
          <label htmlFor={`${accent}-filing_status`} className="field-label">
            Filing Status
          </label>
          <select
            id={`${accent}-filing_status`}
            className="field-input mt-1"
            value={value.filing_status}
            onChange={(e) => setFiling(e.target.value)}
          >
            {(Object.keys(FILING_STATUS_LABELS) as FilingStatus[]).map((k) => (
              <option key={k} value={k}>
                {FILING_STATUS_LABELS[k]}
              </option>
            ))}
          </select>
          {errors?.filing_status && <p className="field-error">{errors.filing_status}</p>}
        </div>
      </div>
    </section>
  );
}
