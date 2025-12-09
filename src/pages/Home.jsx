import React, { useState, useEffect } from 'react';
import { useItinerary } from '../context/ItineraryContext';
import { geocodeAddress, searchNearbyPlaces, searchWikipediaText } from '../api/mapsApi';
import { searchPlaces as searchFsq } from '../api/placesApi';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { 
  FiPlus, FiMapPin, FiCalendar, FiSun, FiPackage, FiStar, FiHeart, 
  FiSearch, FiUsers, FiGlobe, FiAward, FiShield, FiClock, FiDollarSign,
  FiNavigation, FiCamera, FiHome, FiBriefcase, FiUmbrella, FiActivity,
  FiCoffee, FiShoppingBag, FiMusic, FiFilm, FiBook, FiAnchor, FiCameraOff,
  FiChevronRight, FiChevronLeft, FiCheck, FiX, FiMenu, FiUser, FiMail,
  FiLock, FiPhone, FiMap, FiCompass, FiTruck, FiWifi, FiWifiOff, FiAlertCircle,
  FiMessageSquare
} from 'react-icons/fi';

// Dummy data generation functions
const generateTestimonials = (count) => {
  const names = ['Alex Johnson', 'Sarah Williams', 'Michael Brown', 'Emily Davis', 'David Wilson', 'Jennifer Lee'];
  const cities = ['New York', 'Paris', 'Tokyo', 'London', 'Sydney', 'Dubai'];
  const countries = ['USA', 'France', 'Japan', 'UK', 'Australia', 'UAE'];
  const texts = [
    'Amazing experience! The trip was perfectly planned and executed.',
    'Best travel planner I\'ve ever used. Highly recommended!',
    'Made our vacation stress-free and enjoyable.',
    'The itinerary was well-structured with the perfect balance of activities and free time.',
    'Professional service with attention to every detail.',
    'Exceeded all our expectations!' 
  ];
  
  return Array(count).fill().map((_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    location: `${cities[i % cities.length]}, ${countries[i % countries.length]}`,
    rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
    text: texts[i % texts.length],
    date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    avatar: `https://i.pravatar.cc/150?img=${i % 70 + 1}`
  }));
};

const generateDestinations = (count) => {
  const cities = [
    { name: 'Paris', country: 'France', image: 'https://source.unsplash.com/random/800x600/?paris' },
    { name: 'Tokyo', country: 'Japan', image: 'https://source.unsplash.com/random/800x600/?tokyo' },
    { name: 'New York', country: 'USA', image: 'https://source.unsplash.com/random/800x600/?new-york' },
    { name: 'Rome', country: 'Italy', image: 'https://source.unsplash.com/random/800x600/?rome' },
    { name: 'Sydney', country: 'Australia', image: 'https://source.unsplash.com/random/800x600/?sydney' },
    { name: 'Bali', country: 'Indonesia', image: 'https://source.unsplash.com/random/800x600/?bali' },
    { name: 'Cape Town', country: 'South Africa', image: 'https://source.unsplash.com/random/800x600/?cape-town' },
    { name: 'Rio de Janeiro', country: 'Brazil', image: 'https://source.unsplash.com/random/800x600/?rio' },
    { name: 'Bangkok', country: 'Thailand', image: 'https://source.unsplash.com/random/800x600/?bangkok' },
    { name: 'Barcelona', country: 'Spain', image: 'https://source.unsplash.com/random/800x600/?barcelona' },
    { name: 'Dubai', country: 'UAE', image: 'https://source.unsplash.com/random/800x600/?dubai' },
    { name: 'Santorini', country: 'Greece', image: 'https://source.unsplash.com/random/800x600/?santorini' },
  ];
  
  return Array(count).fill().map((_, i) => {
    const city = cities[i % cities.length];
    return {
      id: i + 1,
      name: city.name,
      country: city.country,
      image: city.image,
      price: Math.floor(Math.random() * 2000) + 500,
      rating: (Math.random() * 1 + 4).toFixed(1),
      reviews: Math.floor(Math.random() * 1000) + 50,
      days: Math.floor(Math.random() * 7) + 3,
      isFeatured: i < 3,
      isPopular: i % 3 === 0,
      isSpecialOffer: i % 5 === 0,
      tags: (() => {
        const tags = [];
        if (i % 2 === 0) tags.push('Beach');
        if (i % 3 === 0) tags.push('Adventure');
        if (i % 4 === 0) tags.push('Romantic');
        if (i % 5 === 0) tags.push('Family');
        if (tags.length === 0) tags.push('City Break');
        return tags;
      })()
    };
  });
};

const generateBlogPosts = (count) => {
  const titles = [
    'Top 10 Hidden Gems in Europe',
    'Ultimate Guide to Solo Travel',
    'Best Street Food Cities in Asia',
    'Luxury Resorts for Your Next Getaway',
    'Travel Hacks: Save Money on Flights',
    'Adventure Travel: Best Destinations',
    'Cultural Experiences Around the World',
    'Travel Photography Tips for Beginners',
    'Sustainable Travel: How to Be a Responsible Tourist',
    'Road Trip Essentials You Shouldn\'t Forget'
  ];
  
  const authors = ['Travel Explorer', 'Wanderlust Diaries', 'Globe Trotter', 'Nomadic Soul', 'Adventure Seeker'];
  
  return Array(count).fill().map((_, i) => ({
    id: i + 1,
    title: titles[i % titles.length],
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    author: authors[i % authors.length],
    image: `https://source.unsplash.com/random/800x600/?travel,${i}`,
    readTime: `${Math.floor(Math.random() * 10) + 5} min read`,
    category: ['Destinations', 'Tips', 'Culture', 'Food', 'Adventure'][i % 5],
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    tags: ['Travel', 'Adventure', 'Tips', 'Guide', 'Explore', 'Discover'].sort(() => 0.5 - Math.random()).slice(0, 3)
  }));
};

const Home = () => {
  const { t } = useTranslation();
  const { currentTrip, updateTrip, createTrip, addActivity } = useItinerary();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchResults, setSearchResults] = useState({ attractions: [], hotels: [], places: [] });
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [addedKeys, setAddedKeys] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = generateTestimonials(12);
  const destinations = generateDestinations(50);
  const blogPosts = generateBlogPosts(12);
  
  const featuredDestinations = destinations.filter(dest => dest.isFeatured);
  const popularDestinations = destinations.filter(dest => dest.isPopular);
  const specialOffers = destinations.filter(dest => dest.isSpecialOffer);
  
  const filteredDestinations = activeTab === 'all' 
    ? destinations 
    : destinations.filter(dest => dest.tags.some(tag => tag.toLowerCase() === activeTab));
    
  const searchedDestinations = searchQuery 
    ? filteredDestinations.filter(dest => 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filteredDestinations;
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === featuredDestinations.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? featuredDestinations.length - 1 : prev - 1));
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  const renderStars = (rating) => {
    return Array(5).fill().map((_, i) => (
      <FiStar 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };
  
  const renderFeatures = () => {
    const features = [
      { icon: <FiMapPin className="w-8 h-8 mb-4 text-blue-500" />, title: '1000+ Destinations', description: 'Explore our vast collection of destinations worldwide' },
      { icon: <FiAward className="w-8 h-8 mb-4 text-blue-500" />, title: 'Best Price Guarantee', description: 'We guarantee the best prices for all our travel packages' },
      { icon: <FiUsers className="w-8 h-8 mb-4 text-blue-500" />, title: '24/7 Support', description: 'Our travel experts are available round the clock' },
      { icon: <FiShield className="w-8 h-8 mb-4 text-blue-500" />, title: 'Safe Travels', description: 'Your safety and comfort are our top priority' },
    ];
    
    return features.map((feature, index) => (
      <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="text-center">
          {feature.icon}
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
        </div>
      </div>
    ));
  };
  
  const renderDestinationCard = (destination) => (
    <div key={destination.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={destination.image} 
          alt={`${destination.name}, ${destination.country}`}
          className="w-full h-48 object-cover"
        />
        {destination.isSpecialOffer && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Special Offer
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {destination.days} days
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">{destination.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{destination.country}</p>
          </div>
          <div className="flex items-center">
            <FiStar className="text-yellow-400 fill-current mr-1" />
            <span>{destination.rating}</span>
            <span className="text-gray-500 text-xs ml-1">({destination.reviews})</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {destination.tags.map((tag, i) => (
            <span key={i} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">From</span>
            <p className="text-xl font-bold">${destination.price}</p>
          </div>
          <Link 
            to={`/dashboard/booking/${destination.id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 inline-block"
          >
            View Deal
          </Link>
        </div>
      </div>
    </div>
  );
  

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Your Perfect Getaway</h1>
            <p className="text-xl mb-8">Find and book amazing travel experiences at the best prices</p>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white dark:bg-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button onClick={async () => {
                  if (!searchQuery.trim()) return;
                  setSearchLoading(true);
                  setSearchError('');
                  let loc = null;
                  try {
                    loc = await geocodeAddress(searchQuery.trim());
                    setSearchedLocation(loc);
                  } catch {
                    setSearchedLocation({ address: searchQuery.trim(), lat: null, lng: null });
                  }
                  let attractions = [];
                  let hotels = [];
                  let places = [];
                  if (loc?.lat && loc?.lng) {
                    try { attractions = await searchNearbyPlaces(loc, 10000, 'tourist_attraction'); } catch {}
                    try { hotels = await searchNearbyPlaces(loc, 10000, 'lodging'); } catch {}
                    try { places = await searchNearbyPlaces(loc, 10000, 'point_of_interest'); } catch {}
                    if (hasFoursquare) {
                      try {
                        const fsqAttr = await searchFsq(searchQuery.trim(), { lat: loc.lat, lng: loc.lng, radius: 10000, categories: '16000', limit: 10 });
                        const fsqHotels = await searchFsq(searchQuery.trim(), { lat: loc.lat, lng: loc.lng, radius: 10000, categories: '19014', limit: 10 });
                        const fsqPlaces = await searchFsq(searchQuery.trim(), { lat: loc.lat, lng: loc.lng, radius: 10000, limit: 10 });
                        const mapFsq = (arr) => (arr?.results || []).map((r) => ({
                          name: r.name,
                          lat: r.geocodes?.main?.latitude,
                          lng: r.geocodes?.main?.longitude,
                          address: r.location?.formatted_address,
                          source: 'fsq',
                        }));
                        const aF = mapFsq(fsqAttr);
                        const hF = mapFsq(fsqHotels);
                        const pF = mapFsq(fsqPlaces);
                        attractions = [...aF, ...attractions];
                        hotels = [...hF, ...hotels];
                        places = [...pF, ...places];
                      } catch {}
                    }
                  }
                  if (attractions.length === 0) {
                    try { attractions = await searchWikipediaText(searchQuery.trim(), 'tourist_attraction', 10); } catch {}
                  }
                  if (hotels.length === 0) {
                    try { hotels = await searchWikipediaText(searchQuery.trim(), 'lodging', 10); } catch {}
                  }
                  if (places.length === 0) {
                    try { places = await searchWikipediaText(searchQuery.trim(), 'point_of_interest', 10); } catch {}
                  }
                  setSearchResults({ attractions, hotels, places });
                  if (loc?.address) {
                    if (currentTrip) {
                      updateTrip(currentTrip.id, { destination: loc.address, location: loc.lat && loc.lng ? { lat: loc.lat, lng: loc.lng } : undefined });
                    } else {
                      createTrip({ destination: loc.address, location: loc.lat && loc.lng ? { lat: loc.lat, lng: loc.lng } : undefined });
                    }
                  }
                  if (attractions.length === 0 && hotels.length === 0 && places.length === 0) {
                    setSearchError('Failed to fetch places for the location');
                  }
                  setSearchLoading(false);
                }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                  {searchLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {searchedLocation && (
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">Results for {searchedLocation.address}</h2>
            {searchError && (
              <div className="text-red-600 mb-4">{searchError}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Attractions</h3>
                {searchResults.attractions.length === 0 ? (
                  <p className="text-gray-500">No attractions found</p>
                ) : (
                  <ul className="space-y-2">
                    {searchResults.attractions.slice(0, 10).map((p, i) => {
                      const key = `attraction:${p.name || p.place_id || i}`;
                      const disabled = !!addedKeys[key];
                      return (
                        <li key={i} className="p-2 bg-white dark:bg-gray-700 rounded flex items-center justify-between">
                          <span>{p.name || p.place_id}</span>
                          <button
                            className="text-sm px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-60"
                            disabled={disabled}
                            onClick={() => {
                              const dest = searchedLocation?.address || searchQuery.trim();
                              try {
                                const activity = {
                                  title: p.name || 'Attraction',
                                  type: 'attraction',
                                  location: p.lat && p.lng ? { lat: p.lat, lng: p.lng } : undefined,
                                  notes: `Found near ${dest}`,
                                };
                                let tripId = currentTrip?.id;
                                if (!tripId) {
                                  const trip = createTrip({ destination: dest });
                                  tripId = trip.id;
                                }
                                addActivity(tripId, activity);
                                setAddedKeys(prev => ({ ...prev, [key]: true }));
                                toast.success('Added attraction to itinerary');
                                navigate(`/itinerary/${tripId}`);
                              } catch (err) {
                                toast.error('Failed to add to itinerary');
                              }
                            }}
                          >{disabled ? 'Added' : 'Add'}</button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Hotels</h3>
                {searchResults.hotels.length === 0 ? (
                  <p className="text-gray-500">No hotels found</p>
                ) : (
                  <ul className="space-y-2">
                    {searchResults.hotels.slice(0, 10).map((p, i) => {
                      const key = `lodging:${p.name || p.place_id || i}`;
                      const disabled = !!addedKeys[key];
                      return (
                        <li key={i} className="p-2 bg-white dark:bg-gray-700 rounded flex items-center justify-between">
                          <span>{p.name || p.place_id}</span>
                          <button
                            className="text-sm px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-60"
                            disabled={disabled}
                            onClick={() => {
                              const dest = searchedLocation?.address || searchQuery.trim();
                              try {
                                const activity = {
                                  title: p.name || 'Hotel',
                                  type: 'lodging',
                                  location: p.lat && p.lng ? { lat: p.lat, lng: p.lng } : undefined,
                                  notes: `Found near ${dest}`,
                                };
                                let tripId = currentTrip?.id;
                                if (!tripId) {
                                  const trip = createTrip({ destination: dest });
                                  tripId = trip.id;
                                }
                                addActivity(tripId, activity);
                                setAddedKeys(prev => ({ ...prev, [key]: true }));
                                toast.success('Added hotel to itinerary');
                                navigate(`/itinerary/${tripId}`);
                              } catch (err) {
                                toast.error('Failed to add to itinerary');
                              }
                            }}
                          >{disabled ? 'Added' : 'Add'}</button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Famous Places</h3>
                {searchResults.places.length === 0 ? (
                  <p className="text-gray-500">No places found</p>
                ) : (
                  <ul className="space-y-2">
                    {searchResults.places.slice(0, 10).map((p, i) => {
                      const key = `poi:${p.name || p.place_id || i}`;
                      const disabled = !!addedKeys[key];
                      return (
                        <li key={i} className="p-2 bg-white dark:bg-gray-700 rounded flex items-center justify-between">
                          <span>{p.name || p.place_id}</span>
                          <button
                            className="text-sm px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-60"
                            disabled={disabled}
                            onClick={() => {
                              const dest = searchedLocation?.address || searchQuery.trim();
                              try {
                                const activity = {
                                  title: p.name || 'Place',
                                  type: 'poi',
                                  location: p.lat && p.lng ? { lat: p.lat, lng: p.lng } : undefined,
                                  notes: `Found near ${dest}`,
                                };
                                let tripId = currentTrip?.id;
                                if (!tripId) {
                                  const trip = createTrip({ destination: dest });
                                  tripId = trip.id;
                                }
                                addActivity(tripId, activity);
                                setAddedKeys(prev => ({ ...prev, [key]: true }));
                                toast.success('Added place to itinerary');
                                navigate(`/itinerary/${tripId}`);
                              } catch (err) {
                                toast.error('Failed to add to itinerary');
                              }
                            }}
                          >{disabled ? 'Added' : 'Add'}</button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderFeatures()}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Destinations</h2>
            <div className="flex space-x-2">
              <button 
                onClick={prevSlide}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                aria-label="Previous slide"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                aria-label="Next slide"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredDestinations.map((destination) => (
                <div key={destination.id} className="w-full flex-shrink-0 relative">
                  <div className="relative h-96">
                    <img 
                      src={destination.image} 
                      alt={`${destination.name}, ${destination.country}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <div className="flex items-center mb-2">
                        {renderStars(destination.rating)}
                        <span className="ml-2">{destination.rating} ({destination.reviews} reviews)</span>
                      </div>
                      <h3 className="text-3xl font-bold mb-2">{destination.name}, {destination.country}</h3>
                      <p className="text-lg mb-4">From ${destination.price} per person</p>
                      <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-colors duration-300">
                        Explore Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-4 space-x-2">
            {featuredDestinations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Destinations</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our most popular travel destinations that our customers love
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['All', 'Beach', 'Mountain', 'City', 'Adventure', 'Luxury'].map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category.toLowerCase())}
                className={`px-4 py-2 rounded-full ${
                  activeTab === category.toLowerCase() 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-colors duration-300`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchedDestinations.slice(0, 8).map(destination => renderDestinationCard(destination))}
          </div>
          
          <div className="text-center mt-10">
            <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors duration-300">
              View All Destinations
            </button>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-blue-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Don't miss out on these exclusive travel deals and discounts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialOffers.slice(0, 3).map((offer) => (
              <div key={offer.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="relative">
                  <img 
                    src={offer.image} 
                    alt={`${offer.name}, ${offer.country}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-bl-lg">
                    -20% OFF
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{offer.name}, {offer.country}</h3>
                      <div className="flex items-center mt-1">
                        <FiMapPin className="text-blue-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{offer.days} days / {offer.days - 1} nights</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 line-through">${Math.round(offer.price * 1.25)}</span>
                      <p className="text-2xl font-bold text-blue-600">${offer.price}</p>
                      <span className="text-xs text-gray-500">per person</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Experience the beauty of {offer.name} with our exclusive package. Includes flights, accommodation, and guided tours.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FiStar className="text-yellow-400 fill-current mr-1" />
                      <span>{offer.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">({offer.reviews})</span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                      Book Now
                    </button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-1" />
                      <span>Offer ends in: 2 days 14:32:15</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Travelers Say</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our customers have to say about their experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.text}"</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">{testimonial.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Tips & Blog */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Travel Tips & Guides</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get inspired with our travel guides, tips, and stories from around the world
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{post.category}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
                      <span className="text-sm">{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FiHeart className="mr-1" /> {post.likes}
                      </span>
                      <span className="flex items-center">
                        <FiMessageSquare className="mr-1" /> {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-300">
              Read More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get Travel Deals & Updates</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and receive exclusive offers, travel inspiration, and more
          </p>
          
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none text-gray-800"
            />
            <button className="bg-blue-800 hover:bg-blue-900 px-6 py-3 rounded-r-lg font-medium transition-colors duration-300">
              Subscribe
            </button>
          </div>
          <p className="text-sm mt-3 text-blue-100">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

    </div>
  );
};

export default Home;
  const hasFoursquare = !!import.meta.env.VITE_FOURSQUARE_API_KEY;
  const hasGoogle = !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
