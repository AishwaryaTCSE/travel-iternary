import React from 'react';
import { useParams } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useTranslation } from 'react-i18next';
import PackingListComponent from '../components/packing/PackingList';

const PackingListPage = () => {
  const { tripId } = useParams();
  const { trips } = useItinerary();
  const { t } = useTranslation();

  const trip = trips.find(t => t.id === tripId);

  if (!trip) {
    return <div className="p-6 text-center">{t('common.tripNotFound')}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('packingList.title')} - {trip.destination}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('packingList.subtitle')}
        </p>
      </div>

      <PackingListComponent />
    </div>
  );
};

export default PackingListPage;