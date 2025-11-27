import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useTranslation } from 'react-i18next';
import { FiStar, FiUser, FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi';

const Reviews = () => {
  const { tripId } = useParams();
  const { trips, updateTrip } = useItinerary();
  const { t } = useTranslation();
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [editingId, setEditingId] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);

  const trip = trips.find(t => t.id === tripId);
  const reviews = trip?.reviews || [];

  const handleRatingClick = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleHoverRating = (rating) => {
    setHoverRating(rating);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.rating || !newReview.title.trim()) return;

    if (editingId) {
      // Update existing review
      updateTrip(tripId, {
        reviews: reviews.map(review =>
          review.id === editingId
            ? { ...newReview, id: editingId }
            : review
        )
      });
      setEditingId(null);
    } else {
      // Add new review
      const review = {
        id: Date.now().toString(),
        ...newReview,
        author: 'You', // In a real app, this would come from user auth
        date: new Date().toISOString()
      };
      updateTrip(tripId, {
        reviews: [...reviews, review]
      });
    }

    // Reset form
    setNewReview({
      rating: 0,
      title: '',
      comment: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const startEditing = (review) => {
    setEditingId(review.id);
    setNewReview({
      rating: review.rating,
      title: review.title,
      comment: review.comment || '',
      date: review.date.split('T')[0]
    });
  };

  const deleteReview = (id) => {
    if (window.confirm(t('reviews.confirmDelete'))) {
      updateTrip(tripId, {
        reviews: reviews.filter(review => review.id !== id)
      });
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => Math.round(r.rating) === stars).length,
    percent: (reviews.filter(r => Math.round(r.rating) === stars).length / reviews.length) * 100 || 0
  }));

  if (!trip) {
    return <div className="p-6 text-center">{t('common.tripNotFound')}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('reviews.title')} - {trip.destination}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('reviews.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-4">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold mb-2">{averageRating}</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`h-6 w-6 ${
                      star <= Math.round(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {reviews.length} {t('reviews.reviewCount', { count: reviews.length })}
              </p>
            </div>

            <div className="space-y-2">
              {ratingCounts.map(({ stars, count, percent }) => (
                <div key={stars} className="flex items-center">
                  <div className="w-10 text-sm font-medium text-gray-900 dark:text-white">
                    {stars} <FiStar className="inline text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 mx-2 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-2.5 bg-yellow-400 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Add/Edit Review Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? t('reviews.editReview') : t('reviews.addReview')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('reviews.rating')} *
                </label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => handleHoverRating(star)}
                      onMouseLeave={() => handleHoverRating(0)}
                      className="focus:outline-none"
                    >
                      <FiStar
                        className={`h-8 w-8 ${
                          (hoverRating || newReview.rating) >= star
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('reviews.title')} *
                </label>
                <input
                  type="text"
                  id="title"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('reviews.comment')}
                </label>
                <textarea
                  id="comment"
                  rows="3"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setNewReview({
                        rating: 0,
                        title: '',
                        comment: '',
                        date: new Date().toISOString().split('T')[0]
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {t('common.cancel')}
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {editingId ? t('common.update') : t('reviews.submit')}
                </button>
              </div>
            </form>
          </div>

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {t('reviews.allReviews')} ({reviews.length})
                </h2>
                <div className="relative">
                  <select className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-4 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>{t('reviews.sort.newest')}</option>
                    <option>{t('reviews.sort.highest')}</option>
                    <option>{t('reviews.sort.lowest')}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold">{review.title}</h3>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <FiUser className="mr-1" size={14} />
                          <span>{review.author}</span>
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="mr-1" size={12} />
                          <span>{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {review.comment && (
                      <p className="mt-3 text-gray-700 dark:text-gray-300">
                        {review.comment}
                      </p>
                    )}

                    {review.author === 'You' && (
                      <div className="flex justify-end mt-4 space-x-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                        <button
                          onClick={() => startEditing(review)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center"
                        >
                          <FiEdit2 className="mr-1" size={14} />
                          {t('common.edit')}
                        </button>
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium flex items-center"
                        >
                          <FiTrash2 className="mr-1" size={14} />
                          {t('common.delete')}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                {t('reviews.noReviews')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {t('reviews.beTheFirst')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;