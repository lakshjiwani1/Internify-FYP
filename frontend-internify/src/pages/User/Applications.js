import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserState } from '../../store/user/user-slice';

const MyApplications = () => {
  const [open, setOpen] = useState(false);
  const [internships, setInternships] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedInternshipId, setSelectedInternshipId] = useState(null);
  const user = useSelector(selectUserState);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/track_application/', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        setInternships(response.data);
      } catch (error) {
        console.error('Error fetching internships:', error);
      }
    };

    fetchInternships();
  }, [user.token]);

  const handleClickOpen = async (internshipId) => {
    setSelectedInternshipId(internshipId);
    setOpen(true);

    try {
      const response = await axios.get(`http://127.0.0.1:8000/track_application/${internshipId}/`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      setStatus(response.data.status);
    } catch (error) {
      console.error('Error fetching application status:', error);
      setStatus('Error fetching application status');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStatus('');
    setSelectedInternshipId(null);
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
          <Button variant="contained" color="primary" onClick={() => handleClickOpen(internship.id)}>
            Track Application
          </Button>
        </Box>
      ))}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Application Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {status || 'Your application is under process.'}
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
