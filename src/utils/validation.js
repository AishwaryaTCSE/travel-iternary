// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Password validation (min 8 chars, 1 number, 1 letter)
export const validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
};

// Required field validation
export const required = (value) => {
  return value ? undefined : 'This field is required';
};

// Minimum length validation
export const minLength = (min) => (value) => {
  return value && value.length < min 
    ? `Must be at least ${min} characters` 
    : undefined;
};

// Date validation (future date)
export const futureDate = (value) => {
  if (!value) return 'Please select a date';
  return new Date(value) < new Date() ? 'Date must be in the future' : undefined;
};

// Validate trip dates (end date after start date)
export const validateTripDates = (startDate, endDate) => {
  if (!startDate || !endDate) return 'Both dates are required';
  return new Date(endDate) >= new Date(startDate) 
    ? undefined 
    : 'End date must be after start date';
};