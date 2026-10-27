import { HOTEL_TZ, LIMITS } from "./config";
import { addMonths, nights, todayIn } from "./dates";

/** Business rules for a stay. Returns a guest-facing message, or null when valid. */
export function stayProblem(checkIn: string, checkOut: string): string | null {
  const today = todayIn(HOTEL_TZ);
  if (checkIn < today) return "Check-in can't be in the past.";
  if (checkOut <= checkIn) return "Check-out must be after check-in.";
  const n = nights(checkIn, checkOut);
  if (n > LIMITS.maxNights) return `For stays longer than ${LIMITS.maxNights} nights, please contact us directly.`;
  if (checkIn > addMonths(today, LIMITS.maxMonthsAhead)) return `We take bookings up to ${LIMITS.maxMonthsAhead} months ahead.`;
  return null;
}
