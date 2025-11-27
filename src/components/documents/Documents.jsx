import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  useTheme,
  CircularProgress
} from '@mui/material';
import { 
  FiUpload, 
  FiDownload, 
  FiTrash2, 
  FiMoreVertical, 
  FiFile, 
  FiImage,
  FiFileText,
  FiFolder,
  FiPlus,
  FiSearch,
  FiX,
  FiCheck,
  FiFilePlus,
  FiFolderPlus
} from 'react-icons/fi';

// Sample document categories
const categories = [
  'All Documents',
  'Passport & ID',
  'Travel Tickets',
  'Hotel Bookings',
  'Itinerary',
  'Insurance',
  'Other'
];

// Sample documents data
const sampleDocuments = [
  {
    id: 1,
    name: 'Passport.pdf',
    type: 'pdf',
    size: '2.4 MB',
    category: 'Passport & ID',
    uploaded: '2023-10-15',
    url: '#',
    preview: null
  },
  {
    id: 2,
    name: 'Flight_Ticket.pdf',
    type: 'pdf',
    size: '1.8 MB',
    category: 'Travel Tickets',
    uploaded: '2023-11-10',
    url: '#',
    preview: null
  },
  {
    id: 3,
    name: 'Hotel_Booking.pdf',
    type: 'pdf',
    size: '1.2 MB',
    category: 'Hotel Bookings',
    uploaded: '2023-11-05',
    url: '#',
    preview: null
  },
  {
    id: 4,
    name: 'Travel_Itinerary.pdf',
    type: 'pdf',
    size: '0.8 MB',
    category: 'Itinerary',
    uploaded: '2023-11-12',
    url: '#',
    preview: null
  },
  {
    id: 5,
    name: 'Travel_Insurance.pdf',
    type: 'pdf',
    size: '1.5 MB',
    category: 'Insurance',
    uploaded: '2023-10-20',
    url: '#',
    preview: null
  },
  {
    id: 6,
    name: 'Visa_Approval.jpg',
    type: 'image',
    size: '3.2 MB',
    category: 'Other',
    uploaded: '2023-10-25',
    url: '#',
    preview: 'https://via.placeholder.com/200x150?text=Visa+Document'
  }
];

const Documents = () => {
  const { id } = useParams(); // Itinerary ID
  const theme = useTheme();
  const [documents, setDocuments] = useState(sampleDocuments);
  const [selectedCategory, setSelectedCategory] = useState('All Documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  
  // Filter documents by category and search query
  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'All Documents' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Handle menu open
  const handleMenuOpen = (event, doc) => {
    setAnchorEl(event.currentTarget);
    setSelectedDoc(doc);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDoc(null);
  };
  
  // Handle delete document
  const handleDelete = () => {
    if (selectedDoc) {
      setDocuments(documents.filter(doc => doc.id !== selectedDoc.id));
      setOpenDeleteDialog(false);
      handleMenuClose();
    }
  };
  
  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate file upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Add the new document
        const newDoc = {
          id: Date.now(),
          name: file.name,
          type: file.type.split('/')[1] || 'file',
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          category: 'Other', // Default category
          uploaded: new Date().toISOString().split('T')[0],
          url: '#',
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        };
        
        setDocuments([newDoc, ...documents]);
        setIsUploading(false);
        setUploadProgress(0);
        setOpenUploadDialog(false);
      } else {
        setUploadProgress(progress);
      }
    }, 200);
    
    // Reset file input
    event.target.value = null;
  };
  
  // Get file icon based on file type
  const getFileIcon = (type) => {
    if (type === 'pdf') return <FiFileText style={{ color: '#e74c3c' }} />;
    if (type === 'image') return <FiImage style={{ color: '#3498db' }} />;
    return <FiFile style={{ color: '#95a5a6' }} />;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" component="h1">Travel Documents</Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box component="form" onSubmit={(e) => { e.preventDefault(); }}>
              <TextField
                size="small"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiSearch />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchQuery('')}
                      >
                        <FiX />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 250 }}
              />
            </Box>
            
            <Button 
              variant="contained" 
              startIcon={<FiUpload />}
              onClick={() => fileInputRef.current.click()}
            >
              Upload
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </Button>
            
            <Button 
              variant="outlined" 
              startIcon={<FiFolderPlus />}
              onClick={() => setOpenUploadDialog(true)}
            >
              New Folder
            </Button>
          </Box>
        </Box>
        
        {/* Categories */}
        <Box sx={{ mb: 3, overflowX: 'auto', whiteSpace: 'nowrap', py: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
              color={selectedCategory === category ? 'primary' : 'default'}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
        
        {/* Documents Grid */}
        {filteredDocuments.length > 0 ? (
          <Grid container spacing={2}>
            {filteredDocuments.map((doc) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Box sx={{ fontSize: '3rem', mb: 2 }}>
                      {getFileIcon(doc.type)}
                    </Box>
                    <Typography variant="subtitle1" noWrap title={doc.name}>
                      {doc.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {doc.size} • {formatDate(doc.uploaded)}
                    </Typography>
                    <Chip 
                      label={doc.category} 
                      size="small" 
                      variant="outlined" 
                      sx={{ mt: 1 }} 
                    />
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                    <Button 
                      size="small" 
                      startIcon={<FiDownload />}
                      onClick={() => console.log('Download:', doc.name)}
                    >
                      Download
                    </Button>
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleMenuOpen(e, doc)}
                    >
                      <FiMoreVertical />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2, opacity: 0.5 }}>
              <FiFileText />
            </Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No documents found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery 
                ? 'Try a different search term' 
                : selectedCategory === 'All Documents' 
                  ? 'Upload your first document to get started' 
                  : `No documents in ${selectedCategory} category`}
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<FiUpload />}
              onClick={() => fileInputRef.current.click()}
            >
              Upload Document
            </Button>
          </Paper>
        )}
      </Box>
      
      {/* Document Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { console.log('View:', selectedDoc?.name); handleMenuClose(); }}>
          <ListItemIcon>
            <FiFileText />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { console.log('Download:', selectedDoc?.name); handleMenuClose(); }}>
          <ListItemIcon>
            <FiDownload />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { console.log('Rename:', selectedDoc?.name); handleMenuClose(); }}>
          <ListItemIcon>
            <FiEdit2 />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setOpenDeleteDialog(true); handleMenuClose(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <FiTrash2 />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedDoc?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Upload Progress Dialog */}
      <Dialog open={isUploading} maxWidth="sm" fullWidth>
        <DialogTitle>Uploading Document</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CircularProgress variant="determinate" value={uploadProgress} />
            <Box>
              <Typography variant="body1">Uploading {fileInputRef.current?.files[0]?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(uploadProgress)}% complete
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* New Folder Dialog */}
      <Dialog 
        open={openUploadDialog} 
        onClose={() => setOpenUploadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            type="text"
            fullWidth
            variant="outlined"
            placeholder="e.g., Hotel Bookings, Flight Tickets"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
          <Button onClick={() => setOpenUploadDialog(false)} variant="contained">
            Create Folder
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Documents;
