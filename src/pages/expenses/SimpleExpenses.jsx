import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Paper, Button } from '@mui/material';

const SimpleExpenses = () => {
  const { tripId } = useParams();
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Expenses {tripId ? `for Trip #${tripId}` : ''}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" paragraph>
            This is a simplified expenses page. You can expand this with your actual implementation.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => alert('Add expense clicked!')}
          >
            Add Expense
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SimpleExpenses;
