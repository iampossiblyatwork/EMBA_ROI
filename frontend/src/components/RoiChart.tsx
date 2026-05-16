import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ScenarioResult } from "../types";
import { formatCurrency } from "../format";

interface Props {
  resultA: ScenarioResult | null;
  resultB: ScenarioResult | null;
}

interface ChartPoint {
  year: number;
  a_running: number | null;
  a_pre: number | null;
  a_post: number | null;
  b_running: number | null;
  b_pre: number | null;
  b_post: number | null;
}

function mergeData(a: ScenarioResult | null, b: ScenarioResult | null): ChartPoint[] {
  const years = new Set<number>();
  a?.rows.forEach((r) => years.add(r.year));
  b?.rows.forEach((r) => years.add(r.year));
  const sorted = Array.from(years).sort((x, y) => x - y);

  const aByYear = new Map(a?.rows.map((r) => [r.year, r]));
  const bByYear = new Map(b?.rows.map((r) => [r.year, r]));

  return sorted.map((year) => {
    const ra = aByYear.get(year);
    const rb = bByYear.get(year);
    return {
      year,
      a_running: ra ? ra.running_total : null,
      a_pre: ra ? ra.pre_mba_after_tax : null,
      a_post: ra ? ra.post_mba_after_tax : null,
      b_running: rb ? rb.running_total : null,
      b_pre: rb ? rb.pre_mba_after_tax : null,
      b_post: rb ? rb.post_mba_after_tax : null,
    };
  });
}

export function RoiChart({ resultA, resultB }: Props) {
  if (!resultA && !resultB) return null;
  const data = mergeData(resultA, resultB);

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-spartan-green">ROI Over Time</h3>
        <p className="text-xs text-slate-500">After-tax salary curves and cumulative net return</p>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => formatCurrency(Number(v))}
              width={80}
            />
            <Tooltip
              formatter={(v) => formatCurrency(Number(v))}
              labelFormatter={(l) => `Year ${l}`}
              contentStyle={{
                background: "#18453B",
                border: "none",
                borderRadius: 8,
                color: "white",
              }}
              labelStyle={{ color: "#F5F0E1", fontWeight: 600 }}
              itemStyle={{ color: "white" }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine y={0} stroke="#94A3B8" strokeDasharray="4 4" />
            {resultA && (
              <>
                <Line
                  type="monotone"
                  dataKey="a_pre"
                  name="A: Pre-MBA (after tax)"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="a_post"
                  name="A: Post-MBA (after tax)"
                  stroke="#008208"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="a_running"
                  name="A: Cumulative ROI"
                  stroke="#18453B"
                  strokeWidth={3}
                  dot={false}
                />
                {resultA.break_even_year !== null && (
                  <ReferenceLine
                    x={resultA.break_even_year}
                    stroke="#18453B"
                    strokeDasharray="6 4"
                    label={{
                      value: `Break-even ${resultA.break_even_year}`,
                      position: "top",
                      fill: "#18453B",
                      fontSize: 11,
                    }}
                  />
                )}
              </>
            )}
            {resultB && (
              <>
                <Line
                  type="monotone"
                  dataKey="b_post"
                  name="B: Post-MBA (after tax)"
                  stroke="#D97706"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="b_running"
                  name="B: Cumulative ROI"
                  stroke="#92400E"
                  strokeWidth={3}
                  strokeDasharray="6 3"
                  dot={false}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
