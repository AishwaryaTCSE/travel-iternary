// src/components/Hero.jsx
import { Box, Typography, Button, Container, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        position: 'relative',
        height: isMobile ? '60vh' : '80vh',
        backgroundImage: 'url(/images/hero-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Typography 
          variant={isMobile ? 'h3' : 'h2'} 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            mb: 3
          }}
        >
          {t('hero.title')}
        </Typography>
        <Typography 
          variant={isMobile ? 'h6' : 'h5'} 
          component="p" 
          sx={{ 
            mb: 4,
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
            maxWidth: isMobile ? '100%' : '70%',
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          {t('hero.subtitle')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/auth/register"
            variant="contained"
            color="primary"
            size="large"
            sx={{ 
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: 3,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6,
              },
              transition: 'all 0.3s ease',
            }}
          >
            {t('hero.ctaPrimary')}
          </Button>
          <Button
            component={Link}
            to="/about"
            variant="outlined"
            size="large"
            sx={{ 
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'white',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {t('hero.ctaSecondary')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;