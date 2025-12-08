import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { 
  FiDollarSign, 
  FiRefreshCw,
  FiArrowRight,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';
import { convertCurrency } from '../../api/expenseApi';

const CurrencyConverter = ({ destination, baseCurrency = 'USD' }) => {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState(baseCurrency);
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popularCurrencies, setPopularCurrencies] = useState([]);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' }
  ];

  // Map destination to likely currency
  const destinationCurrencyMap = {
    'paris': 'EUR',
    'france': 'EUR',
    'london': 'GBP',
    'uk': 'GBP',
    'tokyo': 'JPY',
    'japan': 'JPY',
    'sydney': 'AUD',
    'australia': 'AUD',
    'dubai': 'AED',
    'uae': 'AED',
    'bangkok': 'THB',
    'thailand': 'THB',
    'singapore': 'SGD',
    'india': 'INR',
    'mumbai': 'INR',
    'delhi': 'INR',
    'mexico': 'MXN',
    'brazil': 'BRL',
    'south africa': 'ZAR'
  };

  useEffect(() => {
    if (destination) {
      const destLower = destination.toLowerCase();
      const matchedCurrency = Object.keys(destinationCurrencyMap).find(
        key => destLower.includes(key)
      );
      if (matchedCurrency) {
        setToCurrency(destinationCurrencyMap[matchedCurrency]);
      }
    }
  }, [destination]);

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      handleConvert();
    }
  }, [amount, fromCurrency, toCurrency]);

  const handleConvert = async () => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
      setExchangeRate(1);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await convertCurrency(amount, fromCurrency, toCurrency);
      setConvertedAmount(result);
      setExchangeRate(result / amount);
    } catch (err) {
      setError('Failed to convert currency. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const formatCurrency = (value, currencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode);
    const symbol = currency?.symbol || currencyCode;
    return `${symbol} ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Currency Converter
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: (
                  <InputLabel sx={{ mr: 1 }}>
                    {currencies.find(c => c.code === fromCurrency)?.symbol || '$'}
                  </InputLabel>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>From</InputLabel>
              <Select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                label="From"
              >
                {currencies.map(currency => (
                  <MenuItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={1} sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={swapCurrencies}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <FiArrowRight />
            </Button>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>To</InputLabel>
              <Select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                label="To"
              >
                {currencies.map(currency => (
                  <MenuItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} /> : <FiRefreshCw />}
              onClick={handleConvert}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Converting...' : 'Convert'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {convertedAmount !== null && !loading && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {formatCurrency(convertedAmount, toCurrency)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Exchange Rate: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Quick Convert Buttons */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Quick Convert
        </Typography>
        <Grid container spacing={1}>
          {[50, 100, 200, 500, 1000].map(value => (
            <Grid item key={value}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setAmount(value);
                  handleConvert();
                }}
              >
                {formatCurrency(value, fromCurrency)}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Popular Currency Rates */}
      {exchangeRate && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Popular Exchange Rates
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={2}>
            {['EUR', 'GBP', 'JPY', 'AUD', 'CAD'].filter(c => c !== fromCurrency).map(currency => (
              <Grid item xs={6} sm={4} md={2.4} key={currency}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {fromCurrency}/{currency}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {(() => {
                      // This would normally fetch from API
                      const mockRate = (Math.random() * 2 + 0.5).toFixed(4);
                      return mockRate;
                    })()}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default CurrencyConverter;

