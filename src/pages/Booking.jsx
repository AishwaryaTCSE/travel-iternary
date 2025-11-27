// src/pages/Booking.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
  const { destinationId } = useParams();
  const { user } = useAuth();

  // In a real app, you would fetch the destination details using the destinationId
  // For now, we'll use a placeholder
  const destination = {
    id: destinationId,
    name: "Sample Destination",
    price: 999,
    // Add other destination details here
  };

  const handleBooking = (e) => {
    e.preventDefault();
    // Handle booking logic here
    console.log('Booking submitted for:', destination.name);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Booking Details</h2>
        <div className="mb-6">
          <h3 className="text-lg font-medium">Destination: {destination.name}</h3>
          <p className="text-gray-600 dark:text-gray-300">Price: ${destination.price}</p>
        </div>
        
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              defaultValue={user?.name || ''}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              defaultValue={user?.email || ''}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Check-in Date
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Check-out Date
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Number of Guests
            </label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {[1, 2, 3, 4, 5, '6+'].map((num) => (
                <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;