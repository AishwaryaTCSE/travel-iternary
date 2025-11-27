// Format currency based on locale and currency code
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Convert amount from one currency to another
export const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
  if (!rates || !rates[fromCurrency] || !rates[toCurrency]) {
    console.error('Invalid currency rates provided');
    return amount;
  }
  
  // Convert to USD first, then to target currency
  const amountInUSD = amount / rates[fromCurrency];
  return amountInUSD * rates[toCurrency];
};

// Get currency symbol
export const getCurrencySymbol = (currencyCode) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'symbol'
  });
  
  const parts = formatter.formatToParts(0);
  const symbol = parts.find(part => part.type === 'currency').value;
  return symbol;
};

// Format amount with currency symbol
export const formatWithSymbol = (amount, currency = 'USD') => {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${parseFloat(amount).toFixed(2)}`;
};