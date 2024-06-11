import React, { useEffect, useState } from 'react';
import { Button, Grid, Paper, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { AddCircleOutline, MoreVert, Edit, Delete } from '@mui/icons-material';
import { useTheme } from '@mui/system';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserState } from '../../store/user/user-slice';

const EmployerDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [internships, setInternships] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const open = Boolean(anchorEl);
  const user = useSelector(selectUserState);

  const handleClick = (event, internship) => {
    setAnchorEl(event.currentTarget);
    setSelectedInternship(internship);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedInternship(null);
  };

  const handleEdit = () => {
    navigate(`/internshipform/${selectedInternship.id}`);
    handleClose();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/delete_internship/${selectedInternship.id}/`, {
        headers: {
          'X-CSRFToken': user.token,
          'Authorization': `Bearer ${user.token}`, // Ensure the user is authenticated
        },
      });
      setInternships(internships.filter(internship => internship.id !== selectedInternship.id));
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting internship:', error);
    } finally {
      handleClose();
    }
  };

  const handleViewApplicants = async (internshipId) => {
    const url = `http://127.0.0.1:8000/view_applicants/${internshipId}/`;
    console.log(`Fetching applicants from URL: ${url}`); // Log the URL for debugging
    try {
      const response = await axios.get(url, {
        headers: {
          'X-CSRFToken': user.token,
          'Authorization': `Bearer ${user.token}`,
        },
      });
      setApplicants(response.data.applicants);
      setApplicantsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  const closeApplicantsDialog = () => {
    setApplicantsDialogOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/view_all_internships/', {
          headers: {
            'X-CSRFToken': user.token,
            'Authorization': `Bearer ${user.token}`, // Ensure the user is authenticated
          },
        });
        const data = response.data;
        if (Array.isArray(data.internships)) {
          const internshipsData = data.internships.map(item => ({ id: item.pk, ...item.fields }));
          setInternships(internshipsData);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user.token]);

  return (
    <Grid container spacing={2} sx={{ width: '80%', margin: 'auto' }}>
      <Grid item xs={12} sx={{ marginTop: '3rem', marginBottom: '2rem', padding: '3rem', textAlign: 'center' }}>
        <Typography variant="h4">Employer Dashboard</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.palette.primary.main, color: 'white', marginBottom: '1rem', marginRight: '1rem', textTransform: 'none', }}
        >
          Internships Posted
        </Button>
        <Button
          variant="outlined"
          sx={{ textTransform: 'none', marginBottom: '1rem' }}
        >
          Closed Internships
        </Button>
      </Grid>
      <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
        <Link to="/internshipform" style={{ textDecoration: 'none' }}>
          <Button
            startIcon={<AddCircleOutline />}
            variant="contained"
            sx={{ backgroundColor: theme.palette.primary.main, color: 'white', textTransform: 'none' }}
          >
            Post Internships
          </Button>
        </Link>
      </Grid>
      <Grid item xs={12} md={12} sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
        {internships.length > 0 ? (
          <TableContainer component={Paper} sx={{ marginBottom: '1rem', borderBottom: '2px solid #ccc' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Internship</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Applicants</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Application Deadline</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {internships.map((internship) => (
                  <TableRow key={internship.id}>
                    <TableCell>{internship.title}</TableCell>
                    <TableCell>{internship.start_date}</TableCell>
                    <TableCell>
                      <Button variant="text" onClick={() => handleViewApplicants(internship.id)}>
                        {internship.number_of_applicants} Applicants
                      </Button>
                    </TableCell>
                    <TableCell>{internship.location}</TableCell>
                    <TableCell>{internship.application_deadline}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={(event) => handleClick(event, internship)}>
                        <MoreVert />
                      </IconButton>
                      <Menu
                        id={`internship-menu-${internship.id}`}
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleEdit}>
                          <ListItemIcon>
                            <Edit fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Edit Internship</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleDelete}>
                          <ListItemIcon>
                            <Delete fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Delete Internship</ListItemText>
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', marginBottom: '1rem' }}>No internships posted.</Typography>
        )}
      </Grid>

      <Dialog open={applicantsDialogOpen} onClose={closeApplicantsDialog} maxWidth="md" fullWidth>
        <DialogTitle>Applicants</DialogTitle>
        <DialogContent>
          {applicants.length > 0 ? (
            <Box>
              {applicants.map((applicant) => (
                <Box key={applicant.id} sx={{ marginBottom: 2 }}>
                  <Typography variant="h6">{applicant.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{applicant.email}</Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    href={applicant.cv_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ marginTop: 1 }}
                  >
                    View CV
                  </Button>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body1">No applicants yet.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeApplicantsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Internship deleted successfully!
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default EmployerDashboard;
