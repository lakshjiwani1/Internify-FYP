import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Dialog, DialogActions, DialogContent, CircularProgress, Container,
  DialogTitle,
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserState } from '../../store/user/user-slice';

const MyApplications = () => {
  const [open, setOpen] = useState(false);
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const user = useSelector(selectUserState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/track_application/', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = response.data.internships.map((internship) => ({
          id: internship.id,
          title: internship.title,
          location: internship.location,
          start_date: internship.start_date,
          end_date: internship.end_date,
          required_skills: internship.required_skills,
          qualifications: internship.qualifications,
          application_deadline: internship.application_deadline,
          status: internship.status,
        }));

        setInternships(data);
      } catch (error) {
        console.error('Error fetching internships:', error);
        setInternships([]);
      } finally {
        setLoading(false);
      }
    };

    if (user.token) {
      fetchInternships();
    }
  }, [user.token]);

  const handleClickOpen = (internshipId) => {
    const internship = internships.find((i) => i.id === internshipId);
    setSelectedInternship(internship);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInternship(null);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'rgba(255, 215, 0, 0.3)'; // Yellow with 30% opacity
      case 'accepted':
        return 'rgba(76, 175, 80, 0.3)'; // Green with 30% opacity
      case 'rejected':
        return 'rgba(244, 67, 54, 0.3)'; // Red with 30% opacity
      default:
        return 'rgba(128, 128, 128, 0.3)'; // Grey with 30% opacity for unknown statuses
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem', width: '70%', textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ width: '80%', padding: '2rem', margin: '0 auto', marginTop: '3rem' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', marginBottom: '2rem' }}>
        My Internships
      </Typography>
      {internships.length > 0 ? (
        internships.map((internship) => (
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
              <Typography variant="body2" color="textSecondary">
                {internship.location}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {internship.application_deadline}
              </Typography>
            </Box>
            <Button variant="contained" color="primary" onClick={() => handleClickOpen(internship.id)}>
              Track Application
            </Button>
          </Box>
        ))
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '2rem' }}>
          No internships found.
        </Typography>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>Internship Details</DialogTitle>
        <DialogContent>
          {selectedInternship && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedInternship.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Start Date: {selectedInternship.start_date}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                End Date: {selectedInternship.end_date}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Location: {selectedInternship.location}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Required Skills: {selectedInternship.required_skills}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Qualifications: {selectedInternship.qualifications}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Application Deadline: {selectedInternship.application_deadline}
              </Typography>
              <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
                <Typography variant="h6" display="inline">
                  Application Status:
                </Typography>
                <Box
                  sx={{
                    display: 'inline-block',
                    backgroundColor: getStatusColor(selectedInternship.status),
                    padding: '0.5rem 1rem',
                    marginLeft: '1rem',
                    borderRadius: '4px',
                  }}
                >
                  {selectedInternship.status}
                </Box>
              </Box>
            </>
          )}
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
