import axios from 'axios';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storageUtils';

const EXCHANGE_RATE_API = import.meta.env.VITE_EXCHANGE_BASE_URL || 'https://api.exchangerate-api.com/v4/latest';
const LOCAL_STORAGE_KEY = 'travel_expenses';

// In-memory cache for exchange rates
let exchangeRates = null;
let lastUpdated = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Initialize expenses from localStorage
const getExpenses = (tripId) => {
  const allExpenses = getFromLocalStorage(LOCAL_STORAGE_KEY) || {};
  return allExpenses[tripId] || [];
};

// Save expenses to localStorage
const saveExpenses = (tripId, expenses) => {
  const allExpenses = getFromLocalStorage(LOCAL_STORAGE_KEY) || {};
  allExpenses[tripId] = expenses;
  saveToLocalStorage(LOCAL_STORAGE_KEY, allExpenses);
  return expenses;
};

// Fetch latest exchange rates
const fetchExchangeRates = async (baseCurrency = 'USD') => {
  const now = Date.now();
  
  // Return cached rates if still valid
  if (exchangeRates && lastUpdated && (now - lastUpdated) < CACHE_DURATION) {
    return exchangeRates;
  }

  try {
    const response = await axios.get(`${EXCHANGE_RATE_API}/${baseCurrency}`);
    exchangeRates = response.data.rates;
    lastUpdated = now;
    return exchangeRates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return cached rates even if expired as fallback
    return exchangeRates || { [baseCurrency]: 1 };
  }
};

// Convert amount from one currency to another
export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;
  
  const rates = await fetchExchangeRates(fromCurrency);
  const rate = rates[toCurrency];
  
  if (!rate) {
    throw new Error(`Unable to get exchange rate for ${fromCurrency} to ${toCurrency}`);
  }
  
  return amount * rate;
};

// Add a new expense
export const addExpense = (tripId, expense) => {
  const expenses = getExpenses(tripId);
  const newExpense = {
    ...expense,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const updatedExpenses = [...expenses, newExpense];
  return saveExpenses(tripId, updatedExpenses);
};

// Update an existing expense
export const updateExpense = (tripId, expenseId, updates) => {
  const expenses = getExpenses(tripId);
  const index = expenses.findIndex(exp => exp.id === expenseId);
  
  if (index === -1) throw new Error('Expense not found');
  
  const updatedExpenses = [...expenses];
  updatedExpenses[index] = { ...updatedExpenses[index], ...updates, updatedAt: new Date().toISOString() };
  
  return saveExpenses(tripId, updatedExpenses);
};

// Delete an expense
export const deleteExpense = (tripId, expenseId) => {
  const expenses = getExpenses(tripId);
  const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
  return saveExpenses(tripId, updatedExpenses);
};

// Get all expenses for a trip
export const getTripExpenses = (tripId) => {
  return getExpenses(tripId);
};

// Get expenses summary by category
export const getExpensesByCategory = (tripId) => {
  const expenses = getExpenses(tripId);
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
};

// Get total expenses in a specific currency
export const getTotalExpenses = async (tripId, targetCurrency = 'USD') => {
  const expenses = getExpenses(tripId);
  let total = 0;
  
  for (const expense of expenses) {
    if (expense.currency === targetCurrency) {
      total += expense.amount;
    } else {
      const convertedAmount = await convertCurrency(expense.amount, expense.currency, targetCurrency);
      total += convertedAmount;
    }
  }
  
  return {
    amount: parseFloat(total.toFixed(2)),
    currency: targetCurrency
  };
};

// Get expenses within a date range
export const getExpensesByDateRange = (tripId, startDate, endDate) => {
  const expenses = getExpenses(tripId);
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
  });
};

// Get expenses by payment method
export const getExpensesByPaymentMethod = (tripId) => {
  const expenses = getExpenses(tripId);
  return expenses.reduce((acc, expense) => {
    const method = expense.paymentMethod || 'Other';
    acc[method] = (acc[method] || 0) + expense.amount;
    return acc;
  }, {});
};

// Preload exchange rates when the app loads
export const preloadExchangeRates = async () => {
  await fetchExchangeRates('USD');
};

// Initialize with sample data if empty
const initializeWithSampleData = (tripId) => {
  const expenses = getExpenses(tripId);
  if (expenses.length === 0) {
    const sampleExpenses = [
      {
        id: '1',
        description: 'Hotel Booking',
        amount: 250,
        currency: 'USD',
        category: 'Accommodation',
        date: new Date().toISOString(),
        paymentMethod: 'Credit Card',
        notes: '3 nights at Grand Hotel',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        description: 'Dinner',
        amount: 45,
        currency: 'EUR',
        category: 'Food',
        date: new Date().toISOString(),
        paymentMethod: 'Cash',
        notes: 'Italian restaurant',
        createdAt: new Date().toISOString()
      }
    ];
    saveExpenses(tripId, sampleExpenses);
  }
};

const expenseApi = {
  getExpenses,
  saveExpenses,
  fetchExchangeRates,
  convertCurrency,
  addExpense,
  updateExpense,
  deleteExpense,
  getTripExpenses,
  getExpensesByCategory,
  getTotalExpenses,
  getExpensesByDateRange,
  getExpensesByPaymentMethod,
  preloadExchangeRates,
  initializeWithSampleData
};

export default expenseApi;