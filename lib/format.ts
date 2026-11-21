// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// All money in the dashboard is shown in US dollars.
export const money = (n: number) => (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-US");
export const moneyCompact = (n: number) =>
  "$" + (n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : Math.round(n));
export const num = (n: number) => Math.round(n).toLocaleString("en-US");
export const pct = (n: number) => `${Math.round(n * 10) / 10}%`;
export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
