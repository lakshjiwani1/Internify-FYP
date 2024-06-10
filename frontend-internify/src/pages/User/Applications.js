import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const internships = [
  {
    id: 1,
    title: 'Software Engineer Intern',
    company: 'Softech',
    city: 'Karachi',
  },
  {
    id: 2,
    title: 'Data Analyst Intern',
    company: 'DataSolutions',
    city: 'Karachi',
  },
  {
    id: 3,
    title: 'Web Developer Intern',
    company: 'Qordata',
    city: 'Karachi',
  },
];

const MyApplications = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: '80%', padding: '2rem', margin: '0 auto', marginTop: '3rem' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', marginBottom: '2rem' }}>
        My Internships
      </Typography>
      {internships.map((internship) => (
        <Box
          key={internship.id}
          sx={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h6">{internship.title}</Typography>
            <Typography variant="body2" color="textSecondary">{internship.company}</Typography>
            <Typography variant="body2" color="textSecondary">{internship.city}</Typography>
          </Box>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Track Application
          </Button>
        </Box>
      ))}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Application Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your application is under process.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyApplications;
