/**
 * Date utility functions for timezone-aware date operations
 */

/**
 * Get the user's current timezone
 * @returns {string} The user's timezone (e.g., 'America/New_York', 'Europe/London')
 */
export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Get the current date in the user's timezone as YYYY-MM-DD string
 * @returns {string} Current date in YYYY-MM-DD format
 */
export function getCurrentDateInTimezone() {
  const now = new Date();
  return now.toLocaleDateString('en-CA', { timeZone: getUserTimezone() });
}

/**
 * Get a date string in the user's timezone as YYYY-MM-DD
 * @param {Date|string} date - The date to convert
 * @returns {string} Date in YYYY-MM-DD format in user's timezone
 */
export function getDateInTimezone(date) {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-CA', { timeZone: getUserTimezone() });
}

/**
 * Calculate the difference in days between two dates in the user's timezone
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Difference in days (positive if date1 is after date2)
 */
export function getDaysDifferenceInTimezone(date1, date2) {
  const date1Str = getDateInTimezone(date1);
  const date2Str = getDateInTimezone(date2);
  
  const date1Only = new Date(date1Str);
  const date2Only = new Date(date2Str);
  
  const diffTime = date1Only.getTime() - date2Only.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get relative date indicator (Today, Tomorrow, Yesterday, etc.) in user's timezone
 * @param {Date|string} dueDate - The due date
 * @returns {string} Relative indicator string
 */
export function getRelativeDateIndicator(dueDate) {
  const diffDays = getDaysDifferenceInTimezone(dueDate, new Date());
  
  if (diffDays === 0) {
    return ' (Today)';
  } else if (diffDays === 1) {
    return ' (Tomorrow)';
  } else if (diffDays === -1) {
    return ' (Yesterday)';
  } else if (diffDays < 0) {
    return ` (${Math.abs(diffDays)} days ago)`;
  } else if (diffDays <= 7) {
    return ` (in ${diffDays} days)`;
  }
  
  return '';
}

/**
 * Format a date for display with timezone-aware relative indicators
 * @param {Date|string} dueDate - The date to format
 * @returns {string} Formatted date string
 */
export function formatDateWithTimezone(dueDate) {
  if (!dueDate) return '—';
  
  try {
    const date = new Date(dueDate);
    const relativeIndicator = getRelativeDateIndicator(dueDate);
    
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      timeZone: getUserTimezone()
    }) + relativeIndicator;
  } catch (error) {
    console.warn('Invalid date format:', dueDate);
    return 'Invalid Date';
  }
}

/**
 * Get date ranges for task categorization in user's timezone
 * @returns {Object} Object with today, tomorrow, and weekEnd date strings
 */
export function getDateRangesInTimezone() {
  const now = new Date();
  const timezone = getUserTimezone();
  
  const today = now.toLocaleDateString('en-CA', { timeZone: timezone });
  
  // Calculate tomorrow in user's timezone
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toLocaleDateString('en-CA', { timeZone: timezone });
  
  // Calculate end of week (7 days from now) in user's timezone
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndStr = weekEnd.toLocaleDateString('en-CA', { timeZone: timezone });
  
  return { 
    today, 
    tomorrow: tomorrowStr, 
    weekEnd: weekEndStr,
    timezone // Include timezone for debugging
  };
}
