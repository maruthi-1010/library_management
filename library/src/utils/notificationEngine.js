/**
 * Utility functions for creating system notifications
 */

export const createNotification = ({ userId, message, type = 'system' }) => {
  return {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    message,
    type, // 'due', 'overdue', 'reservation', 'fine', 'system'
    date: new Date().toISOString(),
    read: false
  };
};
