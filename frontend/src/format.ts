const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencyFmtCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number, withCents = false): string {
  if (!Number.isFinite(value)) return "—";
  return (withCents ? currencyFmtCents : currencyFmt).format(value);
}

export function formatSignedCurrency(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const formatted = currencyFmt.format(Math.abs(value));
  if (value > 0) return "+" + formatted;
  if (value < 0) return "−" + formatted;
  return formatted;
}
