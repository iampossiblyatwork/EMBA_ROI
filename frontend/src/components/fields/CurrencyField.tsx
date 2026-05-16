import { useEffect, useState } from "react";

interface Props {
  id: string;
  label: string;
  value: number;
  onChange: (next: number) => void;
  error?: string;
  presets?: { label: string; value: number }[];
  hint?: string;
  min?: number;
  max?: number;
}

function formatDisplay(n: number): string {
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("en-US");
}

function parseRaw(raw: string): number | null {
  const stripped = raw.replace(/[,\s$]/g, "");
  if (stripped === "" || stripped === "-") return null;
  const n = Number(stripped);
  return Number.isFinite(n) ? n : null;
}

export function CurrencyField({
  id,
  label,
  value,
  onChange,
  error,
  presets,
  hint,
  min = 0,
  max,
}: Props) {
  // Local string state so the user can clear the field, type partial values,
  // and have thousands-separator formatting on blur without the parent
  // resetting them to 0 mid-edit.
  const [text, setText] = useState<string>(formatDisplay(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(formatDisplay(value));
  }, [value, focused]);

  const handleChange = (raw: string) => {
    setText(raw);
    const parsed = parseRaw(raw);
    if (parsed === null) return;
    let next = parsed;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    onChange(next);
  };

  const handleBlur = () => {
    setFocused(false);
    const parsed = parseRaw(text);
    if (parsed === null) {
      setText(formatDisplay(value));
    } else {
      let next = parsed;
      if (min !== undefined) next = Math.max(min, next);
      if (max !== undefined) next = Math.min(max, next);
      onChange(next);
      setText(formatDisplay(next));
    }
  };

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="relative mt-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
          $
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          className="field-input pl-7 tabular-nums"
          value={focused ? text : formatDisplay(value)}
          onFocus={(e) => {
            setFocused(true);
            // Show raw digits while editing so the user can position the cursor naturally.
            setText(String(value));
            window.setTimeout(() => e.target.select(), 0);
          }}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
        />
      </div>
      {presets && presets.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {presets.map((p) => {
            const active = p.value === value;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => onChange(p.value)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  active
                    ? "bg-spartan-green text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-spartan-green/10 hover:text-spartan-green"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
