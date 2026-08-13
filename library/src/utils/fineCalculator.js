import { getDaysDiff } from './dateUtils';

export const FINE_RATE_PER_DAY = 10; // ₹10 per day

/**
 * Calculates fine amount for a transaction based on due date and return date (or current date if not returned).
 * @param {string} dueDateStr - ISO date string of due date
 * @param {string} [returnDateStr] - Optional ISO date string of actual return date
 * @returns {{ fine: number, overdueDays: number, isOverdue: boolean }}
 */
export const calculateFine = (dueDateStr, returnDateStr = null) => {
  if (!dueDateStr) return { fine: 0, overdueDays: 0, isOverdue: false };

  // Use today if not returned yet
  const compareDateStr = returnDateStr || new Date().toISOString().split('T')[0];
  const overdueDays = getDaysDiff(dueDateStr, compareDateStr);

  if (overdueDays > 0) {
    return {
      fine: overdueDays * FINE_RATE_PER_DAY,
      overdueDays,
      isOverdue: true
    };
  }

  return {
    fine: 0,
    overdueDays: 0,
    isOverdue: false
  };
};
