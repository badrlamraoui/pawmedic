import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string,
  locale: string = "fr-FR",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(d);
}

export function formatRelativeDate(
  date: Date | string,
  locale: string = "fr-FR"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return locale.startsWith("fr") ? "Aujourd'hui" : "Today";
  if (diffDays === 1) return locale.startsWith("fr") ? "Hier" : "Yesterday";
  if (diffDays < 7) {
    return locale.startsWith("fr") ? `Il y a ${diffDays} jours` : `${diffDays} days ago`;
  }
  return formatDate(d, locale);
}

export interface AnimalAge {
  years: number;
  months: number;
  weeks: number;
  totalDays: number;
}

export function calculateAge(birthDate: Date | string): AnimalAge {
  const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  const now = new Date();

  const totalMs = now.getTime() - birth.getTime();
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (now.getDate() < birth.getDate()) {
    months -= 1;
    if (months < 0) {
      years -= 1;
      months += 12;
    }
  }

  const weeks = Math.floor(totalDays / 7);

  return { years, months, weeks, totalDays };
}

export function formatAge(
  birthDate: Date | string,
  t: (key: string, values?: Record<string, number>) => string
): string {
  const age = calculateAge(birthDate);
  if (age.years >= 1) {
    return t("animals.age.years", { count: age.years });
  }
  if (age.months >= 1) {
    return t("animals.age.months", { count: age.months });
  }
  return t("animals.age.weeks", { count: age.weeks });
}

export function getDaysUntil(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
