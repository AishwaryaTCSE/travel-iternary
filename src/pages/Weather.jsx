import React from 'react';
import { useParams } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useTranslation } from 'react-i18next';
import WeatherCard from '../components/weather/WeatherCard';
import WeatherForecast from '../components/weather/WeatherForecast';
import PackingList from '../components/packing/PackingList';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

const Weather = () => {
  const { tripId } = useParams();
  const { trips } = useItinerary();
  const { t } = useTranslation();
  const trip = trips.find(t => t.id === tripId);

  if (!trip) {
    return <div className="p-6 text-center">{t('common.tripNotFound')}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {trip.destination} - {t('weather.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {new Date(trip.startDate).toLocaleDateString()} -{' '}
          {new Date(trip.endDate).toLocaleDateString()}
        </p>
      </div>

      <Tabs variant="enclosed" colorScheme="blue" className="mb-8">
        <TabList>
          <Tab>{t('weather.current')}</Tab>
          <Tab>{t('weather.forecast')}</Tab>
          <Tab>{t('packingList.title')}</Tab>
        </TabList>

        <TabPanels className="mt-4">
          <TabPanel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <WeatherCard 
                  date={new Date().toISOString()} 
                  location={trip.destination} 
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  {t('packingList.suggestedItems')}
                </h3>
                <PackingList />
              </div>
            </div>
          </TabPanel>
          
          <TabPanel>
            <WeatherForecast days={7} />
          </TabPanel>
          
          <TabPanel>
            <PackingList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Weather;