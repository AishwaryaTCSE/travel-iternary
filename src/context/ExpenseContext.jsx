import { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useLocalStorage('expenses', []);
  const [currentTripExpenses, setCurrentTripExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getExpensesByTrip = (tripId) => {
    return expenses.filter(expense => expense.tripId === tripId);
  };

  const addExpense = (expenseData) => {
    try {
      setLoading(true);
      const newExpense = {
        id: uuidv4(),
        ...expenseData,
        createdAt: new Date().toISOString(),
      };
      
      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = (expenseId, updates) => {
    try {
      setLoading(true);
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === expenseId 
            ? { ...expense, ...updates, updatedAt: new Date().toISOString() }
            : expense
        )
      );
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = (expenseId) => {
    try {
      setLoading(true);
      setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getExpensesByCategory = (tripId) => {
    const tripExpenses = getExpensesByTrip(tripId);
    return tripExpenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += parseFloat(expense.amount);
      return acc;
    }, {});
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        currentTripExpenses,
        loading,
        error,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpensesByTrip,
        getExpensesByCategory,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export default ExpenseContext;