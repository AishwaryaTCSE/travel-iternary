import { format } from 'date-fns';

// Calculate total trip cost
export const calculateTotalCost = (expenses = []) => {
  return expenses.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);
};

// Group expenses by category
export const groupExpensesByCategory = (expenses = []) => {
  return expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(amount || 0);
    return acc;
  }, {});
};

// Get trip status based on dates
export const getTripStatus = (startDate, endDate) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (today < start) return 'upcoming';
  if (today > end) return 'completed';
  return 'in-progress';
};

// Generate a default packing list based on trip details
export const generateDefaultPackingList = (tripDetails) => {
  const { duration, destination, season } = tripDetails;
  const baseItems = [
    { id: 1, name: 'Passport', category: 'Travel Documents', isPacked: false },
    { id: 2, name: 'Phone charger', category: 'Electronics', isPacked: false },
    { id: 3, name: 'Toothbrush', category: 'Toiletries', isPacked: false },
  ];

  // Add items based on trip duration
  if (duration > 3) {
    baseItems.push(
      { id: 4, name: 'Extra socks', category: 'Clothing', isPacked: false }
    );
  }

  // Add items based on season
  if (season === 'winter') {
    baseItems.push(
      { id: 5, name: 'Winter jacket', category: 'Clothing', isPacked: false },
      { id: 6, name: 'Gloves', category: 'Accessories', isPacked: false }
    );
  } else if (season === 'summer') {
    baseItems.push(
      { id: 7, name: 'Sunscreen', category: 'Toiletries', isPacked: false },
      { id: 8, name: 'Sunglasses', category: 'Accessories', isPacked: false }
    );
  }

  return baseItems;
};