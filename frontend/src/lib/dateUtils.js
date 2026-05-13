/**
 * DateService
 * Standardizes date and time conversions between UTC (backend) and Local (browser).
 */
export class DateService {
  /**
   * Converts a UTC date string to a local Date object.
   * @param {string} utcDate - ISO string from backend (e.g., "2023-10-27T18:30:00Z")
   * @returns {Date|null}
   */
  static toLocal(utcDate) {
    if (!utcDate) return null;
    // Ensure the date string is treated as UTC if it doesn't have a timezone indicator
    const dateStr = (typeof utcDate === 'string' && !utcDate.endsWith('Z') && !utcDate.includes('+')) 
      ? `${utcDate}Z` 
      : utcDate;
    return new Date(dateStr);
  }

  /**
   * Converts a local Date object or string to a UTC ISO string for the backend.
   * @param {Date|string} localDate 
   * @returns {string|null}
   */
  static toUTC(localDate) {
    if (!localDate) return null;
    const date = new Date(localDate);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  }

  /**
   * Formats a UTC date string to a string suitable for HTML5 datetime-local inputs.
   * format: YYYY-MM-DDTHH:mm
   * @param {string} utcDate 
   * @returns {string}
   */
  static toInputFormat(utcDate) {
    const date = this.toLocal(utcDate);
    if (!date || isNaN(date.getTime())) return '';
    
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  }

  /**
   * Formats a UTC date string to a user-friendly local time string.
   * @param {string|Date} utcDate 
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string}
   */
  static formatTime(utcDate, options = { hour: '2-digit', minute: '2-digit', hour12: true }) {
    const date = this.toLocal(utcDate);
    if (!date || isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], options);
  }

  /**
   * Formats a UTC date string to a user-friendly local date string.
   * @param {string|Date} utcDate 
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string}
   */
  static formatDate(utcDate, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
    const date = this.toLocal(utcDate);
    if (!date || isNaN(date.getTime())) return '';
    return date.toLocaleDateString([], options);
  }

  /**
   * Gets the current local time in the format expected by datetime-local inputs.
   * @returns {string}
   */
  static getNowInputFormat() {
    return this.toInputFormat(new Date().toISOString());
  }
}
