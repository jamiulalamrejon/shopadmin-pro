// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Phone validation shared by the browser and the server.
// Accepts international numbers (+14155550123) and Bangladeshi local numbers (01712345678).

export function normalizePhone(input: string): string | null {
  const v = input.replace(/[\s()-]/g, "");
  const bd = v.match(/^(01[3-9]\d{8})$/);
  if (bd) return "88" + bd[1];
  const intl = v.match(/^\+?([1-9]\d{7,14})$/);
  return intl ? intl[1] : null; // digits only, no "+"
}

export const isValidPhone = (input: string) => normalizePhone(input) !== null;
