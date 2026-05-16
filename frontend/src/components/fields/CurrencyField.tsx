import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  id: string;
  label: string;
  value: number;
  onChange: (next: number) => void;
  error?: string;
  presets?: { label: string; value: number }[];
  hint?: ReactNode;
  min?: number;
  max?: number;
}

function formatDisplay(n: number): string {
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("en-US");
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
  // Local text buffer so the user can clear the field mid-edit without the
  // parent snapping the value to 0. Stays in sync with `value` whenever the
  // field isn't focused (resets, presets, scenario loads).
  const [text, setText] = useState<string>(formatDisplay(value));
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!focused) setText(formatDisplay(value));
  }, [value, focused]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const rawValue = el.value;
    const caret = el.selectionStart ?? rawValue.length;
    // Number of digits the user wants to keep to the left of the caret.
    const digitsBeforeCaret = rawValue.slice(0, caret).replace(/[^\d]/g, "").length;

    const digitsOnly = rawValue.replace(/[^\d]/g, "");
    if (digitsOnly === "") {
      setText("");
      return;
    }

    let n = Number(digitsOnly);
    if (!Number.isFinite(n)) return;
    if (min !== undefined) n = Math.max(min, n);
    if (max !== undefined) n = Math.min(max, n);

    const formatted = formatDisplay(n);
    setText(formatted);
    onChange(n);

    // Restore caret to "after the Nth digit" in the freshly-formatted string
    // so live comma insertion doesn't jump the cursor to the end.
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;
      let pos = formatted.length;
      let count = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (count === digitsBeforeCaret) {
          pos = i;
          break;
        }
        if (/\d/.test(formatted[i])) count++;
      }
      input.setSelectionRange(pos, pos);
    });
  };

  const handleBlur = () => {
    setFocused(false);
    if (text.trim() === "") {
      setText(formatDisplay(value));
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    setText(formatDisplay(value));
    window.setTimeout(() => e.target.select(), 0);
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
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          className="field-input pl-7 tabular-nums"
          value={text}
          onFocus={handleFocus}
          onChange={handleChange}
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
