// src/utils/packingUtils.js
export const generatePackingList = (tripDetails) => {
  const { duration, destination, season, activities = [] } = tripDetails;
  
  const baseCategories = [
    {
      id: 'clothing',
      name: 'Clothing',
      items: generateClothingItems(duration, season)
    },
    {
      id: 'toiletries',
      name: 'Toiletries',
      items: generateToiletries()
    },
    {
      id: 'documents',
      name: 'Documents',
      items: generateDocuments()
    },
    {
      id: 'electronics',
      name: 'Electronics',
      items: generateElectronics()
    }
  ];

  // Add activity-specific items
  const activityCategories = generateActivityItems(activities);
  
  return [...baseCategories, ...activityCategories];
};

const generateClothingItems = (duration, season) => {
  const baseItems = [
    { name: 'Underwear', quantity: Math.min(7, Math.ceil(duration / 2)), isPacked: false },
    { name: 'Socks', quantity: Math.min(7, Math.ceil(duration / 2)), isPacked: false },
    { name: 'T-shirts', quantity: Math.min(5, Math.ceil(duration / 2)), isPacked: false },
    { name: 'Pants/Jeans', quantity: Math.min(3, Math.ceil(duration / 4)), isPacked: false }
  ];

  if (['summer', 'spring'].includes(season)) {
    baseItems.push(
      { name: 'Shorts', quantity: 2, isPacked: false },
      { name: 'Sunglasses', quantity: 1, isPacked: false }
    );
  }

  if (['winter', 'autumn'].includes(season)) {
    baseItems.push(
      { name: 'Sweater/Jacket', quantity: 1, isPacked: false },
      { name: 'Warm hat', quantity: 1, isPacked: false },
      { name: 'Gloves', quantity: 1, isPacked: false }
    );
  }

  return baseItems;
};

const generateToiletries = () => {
  return [
    { name: 'Toothbrush', quantity: 1, isPacked: false },
    { name: 'Toothpaste', quantity: 1, isPacked: false },
    { name: 'Deodorant', quantity: 1, isPacked: false },
    { name: 'Shampoo', quantity: 1, isPacked: false },
    { name: 'Soap', quantity: 1, isPacked: false },
    { name: 'Razor', quantity: 1, isPacked: false },
    { name: 'Comb/Brush', quantity: 1, isPacked: false }
  ];
};

const generateDocuments = () => {
  return [
    { name: 'Passport/ID', quantity: 1, isPacked: false },
    { name: 'Travel Insurance', quantity: 1, isPacked: false },
    { name: 'Boarding Pass', quantity: 1, isPacked: false },
    { name: 'Hotel Reservations', quantity: 1, isPacked: false }
  ];
};

const generateElectronics = () => {
  return [
    { name: 'Phone', quantity: 1, isPacked: false },
    { name: 'Charger', quantity: 1, isPacked: false },
    { name: 'Power Bank', quantity: 1, isPacked: false },
    { name: 'Headphones', quantity: 1, isPacked: false }
  ];
};

const generateActivityItems = (activities) => {
  const activityItems = {
    beach: [
      { name: 'Swimsuit', quantity: 1, isPacked: false },
      { name: 'Beach Towel', quantity: 1, isPacked: false },
      { name: 'Sunscreen', quantity: 1, isPacked: false },
      { name: 'Flip Flops', quantity: 1, isPacked: false }
    ],
    hiking: [
      { name: 'Hiking Boots', quantity: 1, isPacked: false },
      { name: 'Backpack', quantity: 1, isPacked: false },
      { name: 'Water Bottle', quantity: 1, isPacked: false },
      { name: 'First Aid Kit', quantity: 1, isPacked: false }
    ],
    business: [
      { name: 'Business Attire', quantity: 2, isPacked: false },
      { name: 'Laptop', quantity: 1, isPacked: false },
      { name: 'Notebook', quantity: 1, isPacked: false },
      { name: 'Pens', quantity: 2, isPacked: false }
    ]
  };

  const categories = [];
  
  activities.forEach(activity => {
    if (activityItems[activity]) {
      categories.push({
        id: `activity-${activity}`,
        name: `${activity.charAt(0).toUpperCase() + activity.slice(1)} Gear`,
        items: [...activityItems[activity]]
      });
    }
  });

  return categories;
};

// Helper function to save/load from localStorage
export const savePackingList = (tripId, packingList) => {
  try {
    const savedLists = JSON.parse(localStorage.getItem('packingLists') || '{}');
    savedLists[tripId] = packingList;
    localStorage.setItem('packingLists', JSON.stringify(savedLists));
  } catch (error) {
    console.error('Error saving packing list:', error);
  }
};

export const loadPackingList = (tripId) => {
  try {
    const savedLists = JSON.parse(localStorage.getItem('packingLists') || '{}');
    return savedLists[tripId] || null;
  } catch (error) {
    console.error('Error loading packing list:', error);
    return null;
  }
};