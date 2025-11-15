import dayjs from "dayjs";

export function normalizeDate(v: string | Date | null | undefined, format = "YYYY-MM-DD"): string | undefined {
  if (!v) return undefined;

  const d = dayjs(v);
  if (!d.isValid()) return undefined;

  return d.format(format);
}