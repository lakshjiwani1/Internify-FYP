import React, { useEffect, useState } from 'react';
import { Button, Grid, Paper, Typography, Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AddCircleOutline, MoreVert, Edit, Delete } from '@mui/icons-material';
import { useTheme } from '@mui/system';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests

const EmployerDashboard = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  // const [internships, setInternships] = useState([]);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('http://127.0.0.1:8000/internship_list/');
  //       const data = await response.json();
  //       console.log(data);
  //       if (data.hasOwnProperty('internships') && Array.isArray(data.internships)) {
  //         setInternships(data.internships);
  //       } else {
  //         console.error('Invalid data format:', data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);


  const jobs = [
    {
      title: 'Testing Internship 2',
      startDate: '2024-05-01',
      endDate: '2024-06-01',
      location: 'Karachi',
      applicationDeadline: '2024-04-01',
      applicants: 0, // Assuming there are no applicants initially
    },
    {
      title: 'Sameer',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
      location: 'Karachi',
      applicationDeadline: '2024-11-01',
      applicants: 0, // Assuming there are no applicants initially
    },
    {
      title: 'New Internship',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
      location: 'Karachi',
      applicationDeadline: '2023-12-31',
      applicants: 0, // Assuming there are no applicants initially
    },
    {
      title: 'GSOC',
      startDate: '2023-12-01',
      endDate: '2024-01-01',
      location: 'Karachi',
      applicationDeadline: '2023-11-01',
      applicants: 0, // Assuming there are no applicants initially
    },
    {
      title: 'Hello Internship',
      startDate: '2023-05-01',
      endDate: '2023-06-01',
      location: 'Karachi',
      applicationDeadline: '2023-04-01',
      applicants: 0, // Assuming there are no applicants initially
    },
  ];
  

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
        {jobs.length > 0 ? (
          <TableContainer component={Paper} sx={{ marginBottom: '1rem', borderBottom: '2px solid #ccc' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Internship</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Application Deadline</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((jobs) => (
                  <TableRow key={jobs.id}>
                    <TableCell>{jobs.title}</TableCell>
                    <TableCell>{jobs.startDate}</TableCell>
                    <TableCell>{jobs.endDate}</TableCell>
                    <TableCell>{jobs.location}</TableCell>
                    <TableCell>{jobs.applicationDeadline}</TableCell>
                    <TableCell>
                    <IconButton size="small" onClick={(event) => handleClick(event, jobs)}>
                      <MoreVert />
                    </IconButton>
                    <Menu
                      id={`internship-menu-${jobs.pk}`}
                      anchorEl={anchorEl}
                      keepMounted
                      open={open}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit Internship</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
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
      <Typography variant="body1" sx={{ textAlign: 'center', marginBottom: "1rem" }}>No internships posted.</Typography>
        )}
    </Grid>
    </Grid >
  );
};

export default EmployerDashboard;
