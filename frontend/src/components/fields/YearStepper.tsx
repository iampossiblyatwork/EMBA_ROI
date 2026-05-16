interface Props {
  id: string;
  label: string;
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  hint?: string;
}

export function YearStepper({ id, label, value, onChange, min, max, hint }: Props) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="mt-1 flex items-center rounded-lg border border-slate-300 bg-white">
        <button
          type="button"
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= min}
          className="px-3 py-2 text-lg font-semibold text-spartan-green transition hover:bg-spartan-green/10 disabled:cursor-not-allowed disabled:text-slate-300"
          aria-label="Decrease"
        >
          −
        </button>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          className="flex-1 border-x border-slate-200 px-3 py-2 text-center text-sm font-semibold tabular-nums text-spartan-green focus:outline-none"
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value.replace(/\D/g, ""));
            if (Number.isFinite(n) && n > 0) onChange(clamp(n));
          }}
        />
        <button
          type="button"
          onClick={() => onChange(clamp(value + 1))}
          disabled={value >= max}
          className="px-3 py-2 text-lg font-semibold text-spartan-green transition hover:bg-spartan-green/10 disabled:cursor-not-allowed disabled:text-slate-300"
          aria-label="Increase"
        >
          +
        </button>
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
