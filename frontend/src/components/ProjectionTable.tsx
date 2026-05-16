import { ScenarioResult } from "../types";
import { formatCurrency } from "../format";

interface Props {
  result: ScenarioResult | null;
  title?: string;
}

export function ProjectionTable({ result, title }: Props) {
  if (!result) return null;

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 bg-spartan-cream/60 px-5 py-3">
        <h3 className="text-base font-semibold text-spartan-green">
          {title ?? "Year-by-Year Projection"}
        </h3>
      </div>
      <div className="max-h-[28rem] overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-white shadow-sm">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-2">Year</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2 text-right">Pre-MBA</th>
              <th className="px-4 py-2 text-right">Post-MBA</th>
              <th className="px-4 py-2 text-right">Pre After-Tax</th>
              <th className="px-4 py-2 text-right">Post After-Tax</th>
              <th className="px-4 py-2 text-right">Tuition</th>
              <th className="px-4 py-2 text-right">Delta</th>
              <th className="px-4 py-2 text-right">Running Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {result.rows.map((row) => {
              const isBreakEven = result.break_even_year === row.year;
              return (
                <tr
                  key={row.year}
                  className={isBreakEven ? "bg-spartan-kelly/15 font-semibold" : "hover:bg-slate-50"}
                >
                  <td className="px-4 py-2 font-medium text-spartan-green">{row.year}</td>
                  <td className="px-4 py-2 text-slate-700">{row.age}</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {formatCurrency(row.pre_mba_salary)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {formatCurrency(row.post_mba_salary)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {formatCurrency(row.pre_mba_after_tax)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {formatCurrency(row.post_mba_after_tax)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-red-600">
                    {row.tuition_cost < 0 ? formatCurrency(row.tuition_cost) : "—"}
                  </td>
                  <td
                    className={`px-4 py-2 text-right tabular-nums ${
                      row.delta < 0 ? "text-red-600" : "text-spartan-kelly"
                    }`}
                  >
                    {formatCurrency(row.delta)}
                  </td>
                  <td
                    className={`px-4 py-2 text-right tabular-nums font-semibold ${
                      row.running_total < 0 ? "text-red-700" : "text-spartan-green"
                    }`}
                  >
                    {formatCurrency(row.running_total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
