import axios from 'axios';
import { env } from './env';

export async function getRequiredDocuments(trip, homeCountry = 'United States') {
  const docs = [
    { name: 'Passport', required: true },
    { name: 'Travel Insurance', required: false },
    { name: 'Flight Tickets', required: true },
    { name: 'Hotel Booking Confirmations', required: false }
  ];

  try {
    const destination = (trip?.destination || '').split(',').pop()?.trim() || trip?.destination;
    if (destination) {
      const { data } = await axios.get(`${env.countryApiUrl}/name/${encodeURIComponent(destination)}`);
      const country = Array.isArray(data) ? data[0] : null;
      if (country) {
        const destName = country.name?.common || destination;
        const needsVisa = destName && homeCountry && destName !== homeCountry;
        if (needsVisa) {
          docs.push({ name: 'Visa (check embassy requirements)', required: true });
        }
        if (country.idd) {
          docs.push({ name: 'International SIM or Roaming Plan', required: false });
        }
      }
    }
  } catch (err) {
    console.warn('Country data fetch failed, using heuristic documents');
  }

  return docs;
}

