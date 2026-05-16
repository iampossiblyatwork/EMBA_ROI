interface Option<T extends string | number> {
  label: string;
  value: T;
}

interface Props<T extends string | number> {
  id: string;
  label: string;
  value: T;
  onChange: (next: T) => void;
  options: Option<T>[];
  hint?: string;
  error?: string;
}

export function SelectField<T extends string | number>({
  id,
  label,
  value,
  onChange,
  options,
  hint,
  error,
}: Props<T>) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <select
        id={id}
        className="field-input mt-1"
        value={String(value)}
        onChange={(e) => {
          const raw = e.target.value;
          const match = options.find((o) => String(o.value) === raw);
          if (match) onChange(match.value);
        }}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
