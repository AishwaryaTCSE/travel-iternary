import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItinerary } from '../../context/ItineraryContext';
import { getRequiredDocuments } from '../../services/documents';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Chip,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { 
  FiArrowLeft, 
  FiCheck, 
  FiPlus, 
  FiTrash2,
  FiEdit2,
  FiSave,
  FiExternalLink,
  FiChevronDown,
  FiAlertTriangle
} from 'react-icons/fi';

const DocumentsPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, currentTrip } = useItinerary();
  const [documents, setDocuments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    type: 'Passport',
    name: '',
    number: '',
    issueDate: '',
    expiryDate: '',
    notes: ''
  });

  const documentTypes = [
    'Passport',
    'Visa',
    'ID Card',
    'Driver\'s License',
    'Travel Insurance',
    'Vaccination Certificate',
    'Hotel Reservation',
    'Flight Ticket',
    'Other'
  ];

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setIsLoading(true);
        const activeTripId = tripId || currentTrip?.id;
        
        if (!activeTripId) {
          setError('No trip selected');
          return;
        }

        // Try to get trip data from session storage first
        const tripData = JSON.parse(sessionStorage.getItem(`trip_${activeTripId}`));
        
        if (!tripData) {
          setError('Trip data not found');
          return;
        }

        let docs = [];
        
        // If documents are already in trip data, use them
        if (tripData.documents) {
          docs = tripData.documents;
        } 
        // Otherwise, get required documents based on destination
        else if (tripData.destination) {
          const requiredDocs = await getRequiredDocuments(tripData.destination);
          docs = requiredDocs.map(doc => ({
            ...doc,
            id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            required: true,
            status: 'not_uploaded'
          }));
          
          // Update trip data in session storage with documents
          const updatedTrip = { ...tripData, documents: docs };
          sessionStorage.setItem(`trip_${activeTripId}`, JSON.stringify(updatedTrip));
        }
        
        setDocuments(docs);
        
      } catch (err) {
        console.error('Error loading documents:', err);
        setError('Failed to load travel documents. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [tripId, currentTrip]);

  const handleAddDocument = () => {
    if (!newDocument.type || !newDocument.name) return;
    
    const doc = {
      ...newDocument,
      id: `custom_${Date.now()}`,
      required: false,
      status: 'not_uploaded',
      custom: true
    };
    
    setDocuments(prev => [...(prev || []), doc]);
    setNewDocument({
      type: 'Passport',
      name: '',
      number: '',
      issueDate: '',
      expiryDate: '',
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const updateDocument = (id, updates) => {
    setDocuments(prev => 
      prev.map(doc => (doc.id === id ? { ...doc, ...updates } : doc))
    );
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const saveDocuments = () => {
    const activeTripId = tripId || currentTrip?.id;
    if (!activeTripId) return;
    
    const tripData = JSON.parse(sessionStorage.getItem(`trip_${activeTripId}`)) || {};
    const updatedTrip = { ...tripData, documents };
    sessionStorage.setItem(`trip_${activeTripId}`, JSON.stringify(updatedTrip));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid': return 'success.main';
      case 'expired': return 'error.main';
      case 'expiring_soon': return 'warning.main';
      case 'not_uploaded': return 'text.secondary';
      default: return 'text.primary';
    }
  };

  const getStatusLabel = (doc) => {
    if (doc.status === 'expired') return 'Expired';
    if (doc.status === 'expiring_soon') return 'Expiring Soon';
    if (doc.status === 'valid') return 'Valid';
    return 'Not Uploaded';
  };

  const groupDocumentsByType = () => {
    if (!documents) return {};
    
    return documents.reduce((groups, doc) => {
      const type = doc.type || 'Other';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(doc);
      return groups;
    }, {});
  };

  const requiredDocsCount = documents?.filter(doc => doc.required).length || 0;
  const completedDocsCount = documents?.filter(doc => doc.status === 'valid').length || 0;
  const progress = requiredDocsCount > 0 ? Math.round((completedDocsCount / requiredDocsCount) * 100) : 0;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" gutterBottom>{error}</Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!tripId && !currentTrip?.id) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No trip selected
          </Typography>
          <Typography variant="body1" paragraph>
            Please select a trip to view its travel documents.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/itinerary')}
            startIcon={<FiArrowLeft />}
          >
            Back to Itineraries
          </Button>
        </Paper>
      </Container>
    );
  }

  const groupedDocuments = groupDocumentsByType();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<FiArrowLeft />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Travel Documents
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {completedDocsCount} of {requiredDocsCount} required documents ready
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<FiPlus />}
            onClick={() => setIsAddDialogOpen(true)}
          >
            Add Document
          </Button>
        </Box>
        
        {/* Progress Bar */}
        <Box sx={{ mb: 4, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
          <Box 
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'action.hover',
              overflow: 'hidden',
              mb: 2
            }}
          >
            <Box 
              sx={{
                height: '100%',
                width: `${progress}%`,
                bgcolor: progress < 50 ? 'error.main' : progress < 80 ? 'warning.main' : 'success.main',
                transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out'
              }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
              {progress}% complete
            </Typography>
            {progress < 100 && (
              <Typography variant="body2" color={progress < 50 ? 'error' : 'warning.main'}>
                {progress < 50 ? 'More documents needed' : 'Almost there!'}
              </Typography>
            )}
          </Box>
        </Box>
        
        {/* Documents List */}
        {Object.entries(groupedDocuments).map(([type, docs]) => (
          <Accordion key={type} defaultExpanded={true} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<FiChevronDown />}>
              <Box display="flex" alignItems="center" width="100%">
                <Typography variant="subtitle1" sx={{ flex: 1 }}>
                  {type}
                </Typography>
                <Chip 
                  label={`${docs.filter(d => d.status === 'valid').length}/${docs.length}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List disablePadding>
                {docs.map((doc) => (
                  <ListItem 
                    key={doc.id}
                    divider
                    sx={{
                      bgcolor: doc.required ? 'background.paper' : 'action.hover',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Checkbox
                        edge="start"
                        checked={doc.status === 'valid'}
                        onChange={(e) => 
                          updateDocument(doc.id, { 
                            status: e.target.checked ? 'valid' : 'not_uploaded' 
                          })
                        }
                        color="primary"
                      />
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: doc.required ? 'medium' : 'normal',
                              textDecoration: doc.status === 'expired' ? 'line-through' : 'none'
                            }}
                          >
                            {doc.name}
                          </Typography>
                          {doc.required && (
                            <Chip 
                              label="Required" 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                              sx={{ ml: 1, height: 20 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          {doc.number && (
                            <Typography variant="body2" component="span" display="block">
                              Number: {doc.number}
                            </Typography>
                          )}
                          {(doc.issueDate || doc.expiryDate) && (
                            <Typography variant="body2" component="span" display="block">
                              {doc.issueDate && `Issued: ${doc.issueDate}`}
                              {doc.expiryDate && ` • Expires: ${doc.expiryDate}`}
                            </Typography>
                          )}
                          <Typography 
                            variant="body2" 
                            component="span" 
                            sx={{ 
                              color: getStatusColor(doc.status),
                              fontWeight: 'medium'
                            }}
                          >
                            {getStatusLabel(doc)}
                          </Typography>
                        </>
                      }
                      sx={{ my: 0.5 }}
                    />
                    
                    <Box>
                      {doc.link && (
                        <IconButton 
                          size="small" 
                          component="a" 
                          href={doc.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ mr: 0.5 }}
                        >
                          <FiExternalLink size={16} />
                        </IconButton>
                      )}
                      {doc.custom && (
                        <IconButton 
                          size="small" 
                          onClick={() => deleteDocument(doc.id)}
                          color="error"
                        >
                          <FiTrash2 size={16} />
                        </IconButton>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
        
        {(!documents || documents.length === 0) && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              No travel documents added yet.
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<FiPlus />} 
              sx={{ mt: 2 }}
              onClick={() => setIsAddDialogOpen(true)}
            >
              Add Your First Document
            </Button>
          </Paper>
        )}
        
        {/* Add Document Dialog */}
        <Dialog 
          open={isAddDialogOpen} 
          onClose={() => setIsAddDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add New Document</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                select
                label="Document Type"
                value={newDocument.type}
                onChange={(e) => setNewDocument({...newDocument, type: e.target.value})}
                fullWidth
                margin="normal"
                SelectProps={{ native: true }}
              >
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </TextField>
              
              <TextField
                label="Document Name"
                value={newDocument.name}
                onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                fullWidth
                margin="normal"
                required
              />
              
              <TextField
                label="Document Number (Optional)"
                value={newDocument.number}
                onChange={(e) => setNewDocument({...newDocument, number: e.target.value})}
                fullWidth
                margin="normal"
              />
              
              <Box display="flex" gap={2}>
                <TextField
                  label="Issue Date (Optional)"
                  type="date"
                  value={newDocument.issueDate}
                  onChange={(e) => setNewDocument({...newDocument, issueDate: e.target.value})}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                
                <TextField
                  label="Expiry Date (Optional)"
                  type="date"
                  value={newDocument.expiryDate}
                  onChange={(e) => setNewDocument({...newDocument, expiryDate: e.target.value})}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              
              <TextField
                label="Notes (Optional)"
                value={newDocument.notes}
                onChange={(e) => setNewDocument({...newDocument, notes: e.target.value})}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddDocument} 
              variant="contained"
              disabled={!newDocument.name}
            >
              Add Document
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      
      {/* Save Button */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<FiSave />}
          onClick={saveDocuments}
          sx={{
            borderRadius: '50px',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6
            }
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};

export default DocumentsPage;
