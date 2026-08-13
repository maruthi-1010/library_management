// Helper utilities for date manipulation and formatting

export const formatDate = (dateInput) => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateInput) => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;
  return date.toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const addDays = (dateInput, days) => {
  const date = new Date(dateInput);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const getDaysDiff = (startDateStr, endDateStr) => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  // Reset time to midnight for exact day diff calculation
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diffTime = end - start;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getDaysRemaining = (dueDateStr) => {
  const today = new Date().toISOString().split('T')[0];
  return getDaysDiff(today, dueDateStr);
};

export const isOverdue = (dueDateStr, returnDateStr = null) => {
  const compareDate = returnDateStr || new Date().toISOString().split('T')[0];
  return getDaysDiff(dueDateStr, compareDate) > 0;
};
