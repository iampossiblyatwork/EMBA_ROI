import type { ScenarioInput, ScenarioResult } from "./types";

export interface ApiFailure {
  ok: false;
  errors: Record<string, string>;
}

export interface ApiSuccess {
  ok: true;
  data: ScenarioResult;
}

export type ApiOutcome = ApiSuccess | ApiFailure;

export async function calculateScenario(input: ScenarioInput, signal?: AbortSignal): Promise<ApiOutcome> {
  const resp = await fetch("/api/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });
  if (!resp.ok) {
    let errors: Record<string, string> = { _: `Server returned ${resp.status}` };
    try {
      const body = await resp.json();
      if (body && typeof body === "object" && body.errors) errors = body.errors;
    } catch {
      // ignore
    }
    return { ok: false, errors };
  }
  const data = (await resp.json()) as ScenarioResult;
  return { ok: true, data };
}
