import React, { useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Checkbox, Chip, Alert } from '@mui/material';
import { FiCheckCircle, FiCircle, FiAlertCircle, FiFileText, FiCreditCard, FiShield } from 'react-icons/fi';

const DocumentChecklist = ({ destination, startDate, endDate }) => {
  const [checkedItems, setCheckedItems] = useState({});

  // Document requirements based on destination
  const getDocumentRequirements = (dest) => {
    const destLower = dest?.toLowerCase() || '';
    
    // Common documents for all destinations
    const baseDocuments = [
      { id: 'passport', name: 'Valid Passport', essential: true, description: 'Must be valid for at least 6 months from travel date' },
      { id: 'id', name: 'Government-issued ID', essential: true, description: 'Driver license or national ID card' },
      { id: 'tickets', name: 'Flight/Travel Tickets', essential: true, description: 'Printed or digital copies' },
      { id: 'reservations', name: 'Hotel/Accommodation Reservations', essential: true, description: 'Booking confirmations' },
      { id: 'insurance', name: 'Travel Insurance', essential: true, description: 'Medical and trip cancellation coverage' },
    ];

    const destinationSpecific = [];

    // Visa requirements (simplified - in production, use a visa API)
    const visaRequiredCountries = ['china', 'russia', 'india', 'brazil', 'australia', 'japan'];
    const visaFreeCountries = ['france', 'spain', 'italy', 'germany', 'uk', 'canada', 'mexico'];
    
    if (visaRequiredCountries.some(c => destLower.includes(c))) {
      destinationSpecific.push({
        id: 'visa',
        name: 'Visa',
        essential: true,
        description: 'Required for entry. Apply well in advance.',
        warning: true
      });
    } else if (visaFreeCountries.some(c => destLower.includes(c))) {
      destinationSpecific.push({
        id: 'visa',
        name: 'Visa',
        essential: false,
        description: 'Not required for short stays (check your nationality)',
        warning: false
      });
    }

    // Additional documents
    destinationSpecific.push(
      { id: 'vaccination', name: 'Vaccination Certificate', essential: false, description: 'Check destination requirements (e.g., Yellow Fever)' },
      { id: 'driver', name: 'International Driving Permit', essential: false, description: 'Required if planning to drive' },
      { id: 'credit', name: 'Credit/Debit Cards', essential: true, description: 'Notify bank of travel plans' },
      { id: 'emergency', name: 'Emergency Contact Information', essential: true, description: 'Contact details of family/friends' },
      { id: 'medical', name: 'Medical Prescriptions', essential: false, description: 'If taking medications, bring prescriptions' },
      { id: 'copies', name: 'Copies of Important Documents', essential: true, description: 'Keep separate from originals' }
    );

    return [...baseDocuments, ...destinationSpecific];
  };

  const documents = getDocumentRequirements(destination);

  const handleToggle = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const essentialCount = documents.filter(d => d.essential).length;
  const checkedEssentialCount = documents.filter(d => d.essential && checkedItems[d.id]).length;
  const allCheckedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Travel Documents Checklist for {destination}
        </Typography>
        <Chip 
          label={`${checkedEssentialCount}/${essentialCount} essential`} 
          color={checkedEssentialCount === essentialCount ? 'success' : 'warning'}
        />
      </Box>

      {checkedEssentialCount < essentialCount && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You have {essentialCount - checkedEssentialCount} essential document(s) remaining. Make sure to complete all essential items before your trip.
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
          Essential Documents ({essentialCount})
        </Typography>
        <List>
          {documents.filter(d => d.essential).map(doc => (
            <ListItem key={doc.id}>
              <ListItemIcon>
                <Checkbox
                  checked={checkedItems[doc.id] || false}
                  onChange={() => handleToggle(doc.id)}
                  icon={<FiCircle />}
                  checkedIcon={<FiCheckCircle color="primary" />}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {doc.name}
                    <Chip label="Essential" size="small" color="error" />
                    {doc.warning && (
                      <Chip 
                        icon={<FiAlertCircle />} 
                        label="Important" 
                        size="small" 
                        color="warning" 
                      />
                    )}
                  </Box>
                }
                secondary={doc.description}
              />
            </ListItem>
          ))}
        </List>

        <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mt: 3, mb: 2 }}>
          Additional Documents ({documents.filter(d => !d.essential).length})
        </Typography>
        <List>
          {documents.filter(d => !d.essential).map(doc => (
            <ListItem key={doc.id}>
              <ListItemIcon>
                <Checkbox
                  checked={checkedItems[doc.id] || false}
                  onChange={() => handleToggle(doc.id)}
                  icon={<FiCircle />}
                  checkedIcon={<FiCheckCircle />}
                />
              </ListItemIcon>
              <ListItemText
                primary={doc.name}
                secondary={doc.description}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 2, mt: 2, bgcolor: 'info.light' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <FiShield size={20} />
          <Typography variant="subtitle2" fontWeight="bold">
            Travel Tips
          </Typography>
        </Box>
        <Typography variant="body2" component="div">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Make digital copies of all documents and store them securely online</li>
            <li>Keep physical copies separate from originals</li>
            <li>Check destination-specific requirements well in advance</li>
            <li>Some countries require proof of onward travel</li>
            <li>Keep emergency contact information easily accessible</li>
          </ul>
        </Typography>
      </Paper>
    </Box>
  );
};

export default DocumentChecklist;

