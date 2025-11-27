import { format, addDays, differenceInDays, parseISO } from 'date-fns';

// Format date to readable string (e.g., "Jan 1, 2023")
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  return format(new Date(date), formatStr);
};

// Get trip duration in days
export const getTripDuration = (startDate, endDate) => {
  return differenceInDays(new Date(endDate), new Date(startDate)) + 1;
};

// Generate array of dates for the trip
export const getTripDates = (startDate, endDate) => {
  const days = getTripDuration(startDate, endDate);
  return Array.from({ length: days }, (_, i) => 
    format(addDays(new Date(startDate), i), 'yyyy-MM-dd')
  );
};

// Check if a date is between two dates
export const isDateInRange = (date, startDate, endDate) => {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
};

// Format time from 24h to 12h format
export const formatTime = (timeString) => {
  return format(parseISO(`2000-01-01T${timeString}`), 'h:mm a');
};