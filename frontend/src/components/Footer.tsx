interface Source {
  topic: string;
  label: string;
  url: string;
}

const SOURCES: Source[] = [
  {
    topic: "Default salaries ($192k pre / $226k post, +17.5%)",
    label: "EMBAC 2025 Student Exit Survey",
    url: "https://embac.org/research-in-context.html",
  },
  {
    topic: "Default tuition ($89,000 over 3 years)",
    label: "MSU Broad — Executive MBA Tuition",
    url: "https://broad.msu.edu/masters/executive-mba/tuition/",
  },
  {
    topic: "MSU Broad salary outcomes (+17% / 6mo, +50% / 3yr)",
    label: "BusinessBecause — MSU Broad MBA Jobs & Salary",
    url: "https://www.businessbecause.com/news/mba-jobs-salary/8423/msu-broad-mba-jobs-salary",
  },
  {
    topic: "2026 federal tax brackets",
    label: "IRS Rev. Proc. 2025-32",
    url: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill",
  },
  {
    topic: "2025 federal tax brackets",
    label: "IRS Rev. Proc. 2024-40",
    url: "https://www.irs.gov/pub/irs-drop/rp-24-40.pdf",
  },
  {
    topic: "EMBA industry salary benchmarks",
    label: "FT 2025 EMBA Ranking summary",
    url: "https://www.humanresourcesonline.net/executive-mba-graduates-see-steady-salary-growth-in-ft-2025-ranking",
  },
];

interface Props {
  taxYearUsed: number;
}

export function Footer({ taxYearUsed }: Props) {
  return (
    <footer className="mt-8 border-t border-spartan-green/10 bg-white py-6">
      <div className="mx-auto max-w-7xl space-y-3 px-6 text-xs text-slate-500">
        <p>
          Calculated with {taxYearUsed} federal tax brackets. Estimates are illustrative — consult
          an advisor for financial decisions.
        </p>
        <details className="group rounded-lg border border-spartan-green/10 bg-spartan-cream/40 px-4 py-3">
          <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-wider text-spartan-green hover:text-spartan-kelly">
            <span className="mr-1 inline-block transition group-open:rotate-90">▶</span>
            Methodology &amp; Sources
          </summary>
          <ul className="mt-3 space-y-2">
            {SOURCES.map((s) => (
              <li key={s.url} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                <span className="font-medium text-slate-700">{s.topic}:</span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-spartan-green underline underline-offset-2 hover:text-spartan-kelly"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] italic text-slate-500">
            Salary projections use the annual growth slider to extrapolate forward from the
            current/expected salary inputs; tuition is divided evenly across the program years.
            Tax calculation uses federal marginal brackets only — state and FICA taxes are not
            modeled.
          </p>
        </details>
      </div>
    </footer>
  );
}
