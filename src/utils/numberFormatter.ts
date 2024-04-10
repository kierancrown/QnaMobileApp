export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'm';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'k';
  } else {
    return num.toString();
  }
}
