export function generatePackingList(trip, weather) {
  const items = [];
  const days = trip?.startDate && trip?.endDate
    ? Math.max(1, Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1)
    : 3;

  items.push({ name: 'T-Shirts', category: 'Clothing', quantity: Math.min(7, days), packed: 0 });
  items.push({ name: 'Pants/Shorts', category: 'Clothing', quantity: Math.ceil(days / 2), packed: 0 });
  items.push({ name: 'Underwear', category: 'Clothing', quantity: days, packed: 0 });
  items.push({ name: 'Toothbrush', category: 'Toiletries', quantity: 1, packed: 0 });
  items.push({ name: 'Phone Charger', category: 'Electronics', quantity: 1, packed: 0 });
  items.push({ name: 'Passport', category: 'Documents', quantity: 1, packed: 0 });

  const condition = weather?.current?.condition?.toLowerCase?.() || '';
  const temp = weather?.current?.temp;
  if (condition.includes('rain')) {
    items.push({ name: 'Umbrella', category: 'Accessories', quantity: 1, packed: 0 });
    items.push({ name: 'Rain Jacket', category: 'Clothing', quantity: 1, packed: 0 });
  }
  if (typeof temp === 'number') {
    if (temp < 10) {
      items.push({ name: 'Warm Jacket', category: 'Clothing', quantity: 1, packed: 0 });
      items.push({ name: 'Gloves', category: 'Accessories', quantity: 1, packed: 0 });
    } else if (temp > 26) {
      items.push({ name: 'Sunscreen', category: 'Toiletries', quantity: 1, packed: 0 });
      items.push({ name: 'Hat', category: 'Accessories', quantity: 1, packed: 0 });
    }
  }

  return items;
}

