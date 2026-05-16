interface Props {
  id: string;
  label: string;
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  step?: number;
  formatValue?: (n: number) => string;
  ticks?: { value: number; label: string }[];
  hint?: string;
}

export function SliderField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue = (n) => String(n),
  ticks,
  hint,
}: Props) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        <span className="text-sm font-semibold tabular-nums text-spartan-green">
          {formatValue(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input mt-2 w-full"
        style={{
          background: `linear-gradient(to right, #008208 0%, #008208 ${pct}%, #E2E8F0 ${pct}%, #E2E8F0 100%)`,
        }}
      />
      {ticks && (
        <div className="mt-1 flex justify-between text-[10px] font-medium text-slate-400">
          {ticks.map((t) => (
            <span key={t.value}>{t.label}</span>
          ))}
        </div>
      )}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
