import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';

const EXPENSES_KEY = 'travel_itinerary_expenses';

const useExpenses = (tripId) => {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useLocalStorage(EXPENSES_KEY, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter expenses for the current trip
  const tripExpenses = expenses.filter(expense => expense.tripId === tripId);

  // Calculate total expenses
  const totalExpenses = tripExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  // Calculate expenses by category
  const expensesByCategory = tripExpenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += parseFloat(expense.amount);
    return acc;
  }, {});

  // Add a new expense
  const addExpense = useCallback(async (expenseData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, you would make an API call here
      // const response = await expensesApi.addExpense(tripId, expenseData);
      
      const newExpense = {
        id: uuidv4(),
        tripId,
        ...expenseData,
        amount: parseFloat(expenseData.amount),
        date: expenseData.date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };
      
      setExpenses(prev => [...prev, newExpense]);
      toast.success(t('expenses.addSuccess'));
      return newExpense;
    } catch (error) {
      console.error('Error adding expense:', error);
      setError(error);
      toast.error(t('expenses.addError'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [tripId, setExpenses, t]);

  // Update an existing expense
  const updateExpense = useCallback(async (expenseId, updates) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, you would make an API call here
      // const response = await expensesApi.updateExpense(expenseId, updates);
      
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === expenseId 
            ? { ...expense, ...updates, amount: parseFloat(updates.amount || expense.amount) }
            : expense
        )
      );
      
      toast.success(t('expenses.updateSuccess'));
    } catch (error) {
      console.error('Error updating expense:', error);
      setError(error);
      toast.error(t('expenses.updateError'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setExpenses, t]);

  // Delete an expense
  const deleteExpense = useCallback(async (expenseId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, you would make an API call here
      // await expensesApi.deleteExpense(expenseId);
      
      setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
      toast.success(t('expenses.deleteSuccess'));
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError(error);
      toast.error(t('expenses.deleteError'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setExpenses, t]);

  // Get expenses by date range
  const getExpensesByDateRange = useCallback((startDate, endDate) => {
    return tripExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    });
  }, [tripExpenses]);

  // Get expenses by category
  const getExpensesByCategory = useCallback((category) => {
    return tripExpenses.filter(expense => expense.category === category);
  }, [tripExpenses]);

  return {
    expenses: tripExpenses,
    totalExpenses,
    expensesByCategory,
    isLoading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesByDateRange,
    getExpensesByCategory,
  };
};

export default useExpenses;