export function formatCurrencyMXN(value: number) {
  const fixed = Math.round((value + Number.EPSILON) * 100) / 100;
  return `$${fixed.toFixed(2)}`;
}

