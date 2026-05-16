interface Option<T extends string | number> {
  label: string;
  value: T;
  sublabel?: string;
}

interface Props<T extends string | number> {
  label: string;
  value: T;
  onChange: (next: T) => void;
  options: Option<T>[];
  hint?: string;
  error?: string;
}

export function SegmentedField<T extends string | number>({
  label,
  value,
  onChange,
  options,
  hint,
  error,
}: Props<T>) {
  return (
    <div>
      <p className="field-label">{label}</p>
      <div className="mt-1 flex rounded-lg border border-slate-300 bg-slate-50 p-1">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              onClick={() => onChange(o.value)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-spartan-green text-white shadow-sm"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              <span>{o.label}</span>
              {o.sublabel && (
                <span
                  className={`ml-1 text-[10px] font-normal ${
                    active ? "text-spartan-cream/80" : "text-slate-400"
                  }`}
                >
                  {o.sublabel}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
