import React from 'react';
import { Modal, Box, Typography, IconButton, Card, CardContent } from '@mui/material';

// Define the style for the modal's outer container
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(300px, 90vw, 1142px)',
  maxHeight: '90vh',
  // Use a light grey background for the modal backdrop to make the inner card pop
  bgcolor: '#F0F0F0', 
  borderRadius: '12px',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
};

interface MuiModalWrapperProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const MuiModalWrapper: React.FC<MuiModalWrapperProps> = ({ open, onClose, title, children }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        {/* Modal Header */}
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="modal-title" variant="h6" component="h2" fontWeight="bold">
            {title}
          </Typography>
          <IconButton onClick={onClose} aria-label="close modal">
            
          </IconButton>
        </Box>
        
        {/* Modal Content Area */}
        {/* This Box provides padding around the inner card and handles scrolling */}
        <Box sx={{ flexGrow: 1, p: '0 24px 24px 24px', overflowY: 'auto' }}>
          {/* The content is now wrapped in a Card component */}
          <Card variant="outlined" sx={{ borderRadius: '8px', boxShadow:4 }}>
            <CardContent sx={{ p: '24px', backgroundColor: '#F0F0F0' }}>
              {children}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Modal>
  );
};

export default MuiModalWrapper;