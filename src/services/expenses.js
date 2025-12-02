import { differenceInCalendarDays } from 'date-fns';

export function estimateExpenses(trip, currency = 'USD') {
  if (!trip) return { currency, total: 0, breakdown: {} };

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const days = Math.max(1, differenceInCalendarDays(end, start) + 1);
  const people = Number(trip.travelers || 1);

  const base = trip.budget ? Number(trip.budget) / days : 0;

  const perDay = {
    accommodation: base > 0 ? base * 0.4 : 100 * people,
    food: base > 0 ? base * 0.25 : 40 * people,
    transportation: base > 0 ? base * 0.15 : 30 * people,
    activities: base > 0 ? base * 0.15 : 50 * people,
    shopping: base > 0 ? base * 0.05 : 25 * people
  };

  const breakdown = Object.fromEntries(
    Object.entries(perDay).map(([k, v]) => [k, Math.round(v * days)])
  );
  const total = Object.values(breakdown).reduce((s, n) => s + n, 0);

  return { currency, total, breakdown, days };
}

