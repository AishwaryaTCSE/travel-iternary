// src/utils/reminderUtils.js
export const getReminders = async (tripId) => {
  try {
    const savedReminders = localStorage.getItem(`trip_${tripId}_reminders`);
    return savedReminders ? JSON.parse(savedReminders) : [];
  } catch (error) {
    console.error('Error loading reminders:', error);
    return [];
  }
};

export const saveReminders = async (tripId, reminders) => {
  try {
    localStorage.setItem(`trip_${tripId}_reminders`, JSON.stringify(reminders));
    return true;
  } catch (error) {
    console.error('Error saving reminders:', error);
    return false;
  }
};

export const getUpcomingReminders = async (tripId, daysAhead = 7) => {
  try {
    const reminders = await getReminders(tripId);
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + daysAhead);
    
    return reminders.filter(reminder => {
      if (reminder.completed) return false;
      
      const dueDate = new Date(reminder.dueDate);
      return dueDate >= now && dueDate <= futureDate;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } catch (error) {
    console.error('Error getting upcoming reminders:', error);
    return [];
  }
};