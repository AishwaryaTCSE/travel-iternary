// Save data to localStorage
export const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Get data from localStorage
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const serializedData = localStorage.getItem(key);
    return serializedData ? JSON.parse(serializedData) : defaultValue;
  } catch (error) {
    console.error('Error getting data from localStorage:', error);
    return defaultValue;
  }
};

// Remove data from localStorage
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing data from localStorage:', error);
    return false;
  }
};

// Clear all app-related data from localStorage
export const clearAppStorage = () => {
  const appPrefix = 'travel_planner_';
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(appPrefix)) {
      localStorage.removeItem(key);
    }
  });
};