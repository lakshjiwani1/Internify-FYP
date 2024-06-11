import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserState } from '../../store/user/user-slice';

const Internship = () => {
  const [internships, setInternships] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const user = useSelector(selectUserState);

  const handleSearch = () => {
    const filtered = internships.filter((internship) =>
      internship.fields.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredInternships(filtered);
  };

  const handleClickOpen = (internship) => {
    setSelectedInternship(internship);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInternship(null);
  };

  const handleApply = async () => {
    if (!selectedInternship) return;

    const csrfToken = user.token;
    if (!csrfToken) {
      setAlertMessage('CSRF token not found');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/apply_to_internship/${selectedInternship.pk}/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );
      console.log('Response', response.data);
      console.log('Selected internship', selectedInternship.pk);
      if (response.status === 200 && response.data.success) {
        setAlertMessage('Applied to Internship Successfully');
        setAlertSeverity('success');
      } else {
        setAlertMessage(response.data.message || 'Failed to apply to internship');
        setAlertSeverity('error');
      }
    } catch (error) {
      console.error('Error applying for internship:', error.response ? error.response.data : error.message);
      setAlertMessage(error.response ? error.response.data.message : error.message);
      setAlertSeverity('error');
    } finally {
      setAlertOpen(true);
      handleClose();
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  useEffect(() => {
    // Fetch data from Django backend
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/view_all_internships/');
        const data = await response.json();

        if (data.hasOwnProperty('internships') && Array.isArray(data.internships)) {
          setInternships(data.internships);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ textAlign: 'center', marginTop: 4, marginBottom: 2 }}>
        Internships
      </Typography>

      <Box sx={{ width: '80%', margin: 'auto', marginBottom: 2 }}>
        <TextField
          label="Search Internships"
          variant="outlined"
          size="small"
          sx={{ width: '70%', marginRight: 2 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button variant="contained" color="primary" size="medium" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <Box sx={{ width: '80%', margin: 'auto' }}>
        {(searchText ? filteredInternships : internships).map((internship) => (
          <Box key={internship.pk} sx={{ width: '100%', marginBottom: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {internship.fields.title}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  Start Date: {internship.fields.start_date}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  Location: {internship.fields.location}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'right', marginTop: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ width: "130px", height: "37px" }}
                    onClick={() => handleClickOpen(internship)}
                  >
                    Apply Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center'}}>Internship Details</DialogTitle>
        <DialogContent>
          {selectedInternship && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6">{selectedInternship.fields.title}</Typography>
              <Typography variant="body2" color="textPrimary">
                Start Date: {selectedInternship.fields.start_date}
              </Typography>
              <Typography variant="body2" color="textPrimary">
                End Date: {selectedInternship.fields.end_date}
              </Typography>
              <Typography variant="body2" color="textPrimary">
                Location: {selectedInternship.fields.location}
              </Typography>
              <Typography variant="body2" color="textPrimary">
                Required Skills: {selectedInternship.fields.required_skills}
              </Typography>
              <Typography variant="body2" color="textPrimary">
                Qualifications: {selectedInternship.fields.qualifications}
              </Typography>
              <Typography variant="body2" color="textPrimary">
                Application Deadline: {selectedInternship.fields.application_deadline}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ paddingRight: 2, paddingTop: 1 }}>
          <Button onClick={handleClose} color="primary" sx={{ marginRight: 1, marginBottom: 3 }}>
            Cancel
          </Button>
          <Button onClick={handleApply} color="primary" variant="contained" startIcon={<WorkIcon />} sx={{ marginBottom: 3, marginRight: 3 }}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Internship;
