// src/components/reminders/Reminders.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiFilter, FiCheckCircle, FiClock, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
import ReminderList from './ReminderList';
import ReminderForm from './ReminderForm';
import ReminderFilter from './ReminderFilter';
import { getReminders, saveReminders } from '../../utils/reminderUtils';

const Reminders = ({ tripId }) => {
  const { t } = useTranslation();
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all'
  });

  useEffect(() => {
    const loadReminders = async () => {
      const savedReminders = await getReminders(tripId);
      setReminders(savedReminders);
    };
    loadReminders();
  }, [tripId]);

  const handleSave = async (reminder) => {
    let updatedReminders;
    if (editingReminder) {
      updatedReminders = reminders.map(r => 
        r.id === editingReminder.id ? { ...reminder, id: editingReminder.id } : r
      );
    } else {
      updatedReminders = [...reminders, { ...reminder, id: Date.now().toString() }];
    }
    await saveReminders(tripId, updatedReminders);
    setReminders(updatedReminders);
    setShowForm(false);
    setEditingReminder(null);
  };

  const handleDelete = async (id) => {
    const updatedReminders = reminders.filter(r => r.id !== id);
    await saveReminders(tripId, updatedReminders);
    setReminders(updatedReminders);
  };

  const handleToggleComplete = async (id) => {
    const updatedReminders = reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    await saveReminders(tripId, updatedReminders);
    setReminders(updatedReminders);
  };

  const filteredReminders = reminders.filter(reminder => {
    // Filter by status
    if (filters.status === 'completed' && !reminder.completed) return false;
    if (filters.status === 'pending' && reminder.completed) return false;
    
    // Filter by priority
    if (filters.priority !== 'all' && reminder.priority !== filters.priority) return false;
    
    // Filter by category
    if (filters.category !== 'all' && reminder.category !== filters.category) return false;
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('reminders.title')}
        </h2>
        <div className="flex space-x-2">
          <ReminderFilter 
            filters={filters} 
            onFilterChange={setFilters} 
          />
          <button
            onClick={() => {
              setEditingReminder(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2" />
            {t('reminders.addReminder')}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <ReminderForm
            reminder={editingReminder}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingReminder(null);
            }}
          />
        </div>
      )}

      <ReminderList
        reminders={filteredReminders}
        onEdit={(reminder) => {
          setEditingReminder(reminder);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
};

export default Reminders;