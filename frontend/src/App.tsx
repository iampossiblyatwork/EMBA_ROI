import { useEffect, useMemo, useRef, useState } from "react";
import { calculateScenario } from "./api";
import { Header } from "./components/Header";
import { ProjectionTable } from "./components/ProjectionTable";
import { RoiChart } from "./components/RoiChart";
import { ScenarioForm } from "./components/ScenarioForm";
import { ShareButton } from "./components/ShareButton";
import { SummaryCards } from "./components/SummaryCards";
import { ScenarioInput, ScenarioResult } from "./types";
import { decodeUrlState, encodeUrlState } from "./urlState";

function useDebouncedScenario(
  input: ScenarioInput | null,
  delayMs = 250
): { result: ScenarioResult | null; errors: Record<string, string>; loading: boolean } {
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!input) {
      setResult(null);
      setErrors({});
      return;
    }
    const handle = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      const outcome = await calculateScenario(input, controller.signal).catch((e) => {
        if (e?.name === "AbortError") return null;
        return { ok: false, errors: { _: "Network error" } } as const;
      });
      if (!outcome) return;
      if (outcome.ok) {
        setResult(outcome.data);
        setErrors({});
      } else {
        setErrors(outcome.errors);
      }
      setLoading(false);
    }, delayMs);
    return () => window.clearTimeout(handle);
  }, [input, delayMs]);

  return { result, errors, loading };
}

export default function App() {
  const initial = useMemo(() => decodeUrlState(window.location.search), []);
  const [scenarioA, setScenarioA] = useState<ScenarioInput>(initial.a);
  const [scenarioB, setScenarioB] = useState<ScenarioInput | null>(initial.b);

  const { result: resultA, errors: errorsA, loading: loadingA } = useDebouncedScenario(scenarioA);
  const { result: resultB, errors: errorsB } = useDebouncedScenario(scenarioB);

  useEffect(() => {
    const qs = encodeUrlState(scenarioA, scenarioB);
    window.history.replaceState(null, "", qs);
  }, [scenarioA, scenarioB]);

  const toggleB = () => {
    if (scenarioB) {
      setScenarioB(null);
    } else {
      setScenarioB({ ...scenarioA, tuition: Math.max(0, scenarioA.tuition - 30000) });
    }
  };

  const hasResult = resultA !== null;
  const globalError = errorsA._;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Tweak any input — results update automatically. Add a comparison scenario to weigh two
            options side-by-side.
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleB} className="btn-ghost">
              {scenarioB ? "Hide Scenario B" : "+ Compare a second scenario"}
            </button>
            <ShareButton />
          </div>
        </div>

        {globalError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {globalError}
          </div>
        )}

        <div className={`grid grid-cols-1 gap-6 ${scenarioB ? "lg:grid-cols-2" : ""}`}>
          <ScenarioForm
            title={scenarioB ? "Scenario A" : "Your Scenario"}
            accent="a"
            value={scenarioA}
            onChange={setScenarioA}
            errors={errorsA}
          />
          {scenarioB && (
            <ScenarioForm
              title="Scenario B"
              accent="b"
              value={scenarioB}
              onChange={setScenarioB}
              errors={errorsB}
              onRemove={() => setScenarioB(null)}
            />
          )}
        </div>

        {hasResult && (
          <>
            <SummaryCards resultA={resultA} resultB={resultB} />
            <RoiChart resultA={resultA} resultB={resultB} />
            <div className={`grid grid-cols-1 gap-6 ${scenarioB && resultB ? "xl:grid-cols-2" : ""}`}>
              <ProjectionTable
                result={resultA}
                title={scenarioB ? "Scenario A — Year-by-Year" : "Year-by-Year Projection"}
              />
              {scenarioB && resultB && (
                <ProjectionTable result={resultB} title="Scenario B — Year-by-Year" />
              )}
            </div>
          </>
        )}

        {!hasResult && loadingA && (
          <div className="card p-8 text-center text-sm text-slate-500">Calculating…</div>
        )}
      </main>
      <footer className="mt-8 border-t border-spartan-green/10 bg-white py-4">
        <p className="mx-auto max-w-7xl px-6 text-xs text-slate-500">
          Tax brackets use 2024 IRS rates. Estimates are illustrative — consult an advisor for
          financial decisions.
        </p>
      </footer>
    </div>
  );
}
