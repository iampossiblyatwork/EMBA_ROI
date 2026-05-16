import { ScenarioResult } from "../types";
import { formatCurrency, formatSignedCurrency } from "../format";

interface Props {
  resultA: ScenarioResult | null;
  resultB: ScenarioResult | null;
}

interface Metric {
  label: string;
  format: (r: ScenarioResult) => string;
  diff?: (a: ScenarioResult, b: ScenarioResult) => string | null;
}

const METRICS: Metric[] = [
  {
    label: "Break-even Year",
    format: (r) => (r.break_even_year ? String(r.break_even_year) : "Never"),
  },
  {
    label: "Break-even Age",
    format: (r) => (r.break_even_age ? String(r.break_even_age) : "—"),
  },
  {
    label: "Lifelong Return",
    format: (r) => formatCurrency(r.lifelong_return),
    diff: (a, b) => formatSignedCurrency(b.lifelong_return - a.lifelong_return),
  },
  {
    label: "Total Tuition",
    format: (r) => formatCurrency(r.total_tuition),
  },
];

export function SummaryCards({ resultA, resultB }: Props) {
  if (!resultA && !resultB) return null;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {METRICS.map((m) => (
        <div key={m.label} className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{m.label}</p>
          {resultA && (
            <p className="mt-2 text-2xl font-bold text-spartan-green">{m.format(resultA)}</p>
          )}
          {resultB && (
            <>
              <p className="mt-1 text-sm font-semibold text-amber-700">
                B: {m.format(resultB)}
              </p>
              {resultA && m.diff && (
                <p
                  className={`mt-1 text-xs font-semibold ${
                    resultB.lifelong_return - resultA.lifelong_return >= 0
                      ? "text-spartan-kelly"
                      : "text-red-600"
                  }`}
                >
                  Δ {m.diff(resultA, resultB)}
                </p>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
