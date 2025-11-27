import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiTrash2, FiEdit2, FiDollarSign, FiTag, FiCalendar } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Expenses = () => {
  const { tripId } = useParams();
  const { trips, updateTrip } = useItinerary();
  const { t } = useTranslation();
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  });
  const [editingId, setEditingId] = useState(null);
  const [editExpense, setEditExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: ''
  });

  const trip = trips.find(t => t.id === tripId);
  const expenses = trip?.expenses || [];

  const categories = [
    { value: 'food', label: t('expenses.categories.food') },
    { value: 'accommodation', label: t('expenses.categories.accommodation') },
    { value: 'transportation', label: t('expenses.categories.transportation') },
    { value: 'activities', label: t('expenses.categories.activities') },
    { value: 'shopping', label: t('expenses.categories.shopping') },
    { value: 'other', label: t('expenses.categories.other') }
  ];

  const addExpense = (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;

    const expense = {
      id: Date.now().toString(),
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date || new Date().toISOString()
    };

    updateTrip(tripId, {
      expenses: [...expenses, expense]
    });

    setNewExpense({
      description: '',
      amount: '',
      category: 'food',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const startEditing = (expense) => {
    setEditingId(expense.id);
    setEditExpense({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date.split('T')[0]
    });
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editExpense.description || !editExpense.amount) return;

    updateTrip(tripId, {
      expenses: expenses.map(exp => 
        exp.id === editingId
          ? {
              ...exp,
              description: editExpense.description,
              amount: parseFloat(editExpense.amount),
              category: editExpense.category,
              date: editExpense.date
            }
          : exp
      )
    });

    setEditingId(null);
  };

  const deleteExpense = (id) => {
    updateTrip(tripId, {
      expenses: expenses.filter(exp => exp.id !== id)
    });
  };

  const categoryData = categories.map(cat => {
    const total = expenses
      .filter(exp => exp.category === cat.value)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { name: cat.label, value: total, category: cat.value };
  }).filter(item => item.value > 0);

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const dailyAverage = trip?.startDate && trip?.endDate 
    ? totalSpent / Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24) + 1)
    : 0;

  if (!trip) {
    return <div className="p-6 text-center">{t('common.tripNotFound')}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('expenses.title')} - {trip.destination}
        </h1>
        <div className="flex flex-wrap gap-6 mt-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex-1 min-w-[200px]">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {t('expenses.totalSpent')}
            </h3>
            <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex-1 min-w-[200px]">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {t('expenses.dailyAverage')}
            </h3>
            <p className="text-2xl font-bold">${dailyAverage.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex-1 min-w-[200px]">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {t('expenses.expenseCount')}
            </h3>
            <p className="text-2xl font-bold">{expenses.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('expenses.addExpense')}
              </h2>
              <form onSubmit={addExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('expenses.description')} *
                  </label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('expenses.amount')} *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('expenses.category')} *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiTag className="text-gray-400" />
                      </div>
                      <select
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('expenses.date')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {t('expenses.addExpenseButton')}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('expenses.recentExpenses')}
              </h2>
              
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t('expenses.noExpenses')}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t('expenses.description')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t('expenses.category')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t('expenses.date')}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t('expenses.amount')}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t('common.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {expenses
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((expense) => (
                          <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingId === expense.id ? (
                                <input
                                  type="text"
                                  value={editExpense.description}
                                  onChange={(e) => setEditExpense({...editExpense, description: e.target.value})}
                                  className="w-full px-2 py-1 border rounded"
                                />
                              ) : (
                                <div className="font-medium">{expense.description}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingId === expense.id ? (
                                <select
                                  value={editExpense.category}
                                  onChange={(e) => setEditExpense({...editExpense, category: e.target.value})}
                                  className="w-full px-2 py-1 border rounded"
                                >
                                  {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                      {cat.label}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  {categories.find(c => c.value === expense.category)?.label || expense.category}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {editingId === expense.id ? (
                                <input
                                  type="date"
                                  value={editExpense.date}
                                  onChange={(e) => setEditExpense({...editExpense, date: e.target.value})}
                                  className="w-full px-2 py-1 border rounded"
                                />
                              ) : (
                                new Date(expense.date).toLocaleDateString()
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {editingId === expense.id ? (
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiDollarSign className="text-gray-400" />
                                  </div>
                                  <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={editExpense.amount}
                                    onChange={(e) => setEditExpense({...editExpense, amount: e.target.value})}
                                    className="w-full pl-8 pr-2 py-1 border rounded"
                                  />
                                </div>
                              ) : (
                                `$${expense.amount.toFixed(2)}`
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {editingId === expense.id ? (
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={saveEdit}
                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                  >
                                    {t('common.save')}
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                                  >
                                    {t('common.cancel')}
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-end space-x-3">
                                  <button
                                    onClick={() => startEditing(expense)}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    <FiEdit2 size={18} />
                                  </button>
                                  <button
                                    onClick={() => deleteExpense(expense.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <FiTrash2 size={18} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden sticky top-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('expenses.spendingByCategory')}
              </h2>
              
              {categoryData.length > 0 ? (
                <div className="space-y-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {categoryData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => 
                            [`$${value.toFixed(2)}`, props.payload.name]
                          } 
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-2">
                    {categoryData.map((category, index) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span>{category.name}</span>
                        </div>
                        <span className="font-medium">
                          ${category.value.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t('expenses.noCategoryData')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;