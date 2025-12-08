import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardMedia, Chip, Tabs, Tab, Rating } from '@mui/material';
import { FiStar, FiMapPin, FiDollarSign, FiClock, FiHeart } from 'react-icons/fi';

const TripRecommendations = ({ destination, startDate, endDate }) => {
  const [activeTab, setActiveTab] = useState('attractions');
  const [recommendations, setRecommendations] = useState({ attractions: [], restaurants: [], hotels: [] });

  useEffect(() => {
    if (destination) {
      loadRecommendations();
    }
  }, [destination]);

  const loadRecommendations = () => {
    // Generate recommendations based on destination
    const attractions = generateRecommendations('attraction', destination);
    const restaurants = generateRecommendations('restaurant', destination);
    const hotels = generateRecommendations('hotel', destination);

    setRecommendations({ attractions, restaurants, hotels });
  };

  const generateRecommendations = (type, dest) => {
    const names = {
      attraction: ['Historic Museum', 'Art Gallery', 'City Park', 'Monument', 'Cathedral', 'Palace', 'Tower', 'Market'],
      restaurant: ['Fine Dining', 'Local Bistro', 'Seafood Restaurant', 'Traditional Café', 'Street Food Market', 'Rooftop Bar', 'Wine Bar', 'Bakery'],
      hotel: ['Boutique Hotel', 'Luxury Resort', 'City Center Hotel', 'Historic Inn', 'Beach Resort', 'Mountain Lodge', 'Business Hotel', 'Hostel']
    };

    return Array(6).fill().map((_, i) => ({
      id: `${type}-${i}`,
      name: `${names[type][i % names[type].length]} ${i + 1}`,
      type,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviewCount: Math.floor(Math.random() * 5000) + 100,
      price: Math.floor(Math.random() * 200) + 20,
      image: `https://source.unsplash.com/400x300/?${type},${dest},${i}`,
      description: `A wonderful ${type} in ${dest} with excellent reviews and great service.`,
      location: `${dest}`,
      tags: type === 'restaurant' ? ['Local Cuisine', 'Popular'] : type === 'hotel' ? ['4 Star', 'Central'] : ['Must See', 'Historic']
    }));
  };

  const RecommendationCard = ({ item }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={item.image}
        alt={item.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap>
          {item.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Rating value={parseFloat(item.rating)} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            {item.rating} ({item.reviewCount} reviews)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          {item.tags.map(tag => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <FiMapPin size={14} style={{ marginRight: 4, display: 'inline' }} />
          {item.location}
        </Typography>
        {item.price && (
          <Typography variant="body2" color="primary" fontWeight="bold">
            <FiDollarSign size={14} style={{ marginRight: 4, display: 'inline' }} />
            From ${item.price}/night
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const getCurrentRecommendations = () => {
    return recommendations[activeTab] || [];
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Recommendations for {destination}
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label={`Attractions (${recommendations.attractions.length})`} value="attractions" />
        <Tab label={`Restaurants (${recommendations.restaurants.length})`} value="restaurants" />
        <Tab label={`Hotels (${recommendations.hotels.length})`} value="hotels" />
      </Tabs>

      <Grid container spacing={3}>
        {getCurrentRecommendations().map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <RecommendationCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TripRecommendations;

