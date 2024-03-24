import React, { useState, useEffect } from 'react';
import { Button, Grid, Paper, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AddCircleOutline, MoreVert, Edit, Delete } from '@mui/icons-material';
import { useTheme } from '@mui/system';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EmployerDashboard = () => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeButton, setActiveButton] = useState('posted');
    const open = Boolean(anchorEl);
    const [internships, setInternships] = useState([]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const jobsPosted = internships.filter((job) => job.status === 'posted');
    const jobsClosed = internships.filter((job) => job.status === 'closed');

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/internship_list/');
                setInternships(response.data);
            } catch (error) {
                console.error('Error fetching internships:', error);
            }
        };

        fetchInternships();
    }, []);

    return (
        <Grid container spacing={2} sx={{ width: '80%', margin: 'auto' }}>
            <Grid item xs={12} sx={{ marginTop: '3rem', marginBottom: '2rem', padding: '3rem', textAlign: 'center' }}>
                <Typography variant="h4">Employer Dashboard</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Button
                    variant={activeButton === 'posted' ? 'outlined' : 'contained'}
                    sx={{ marginBottom: '1rem', marginRight: '1rem', textTransform: 'none' }}
                    onClick={() => handleButtonClick('posted')}
                >
                    Internships Posted
                </Button>
                <Button
                    variant={activeButton === 'closed' ? 'outlined' : 'contained'}
                    sx={{ textTransform: 'none', marginBottom: '1rem' }}
                    onClick={() => handleButtonClick('closed')}
                >
                    Closed Internships
                </Button>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
                <Link to="/internshipform" style={{ textDecoration: 'none' }}>
                    <Button
                        startIcon={<AddCircleOutline />}
                        variant="contained"
                        sx={{ textTransform: 'none' }}
                    >
                        Post Internship
                    </Button>
                </Link>
            </Grid>
            <Grid item xs={12} md={10} sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <TableContainer component={Paper} sx={{ marginBottom: '1rem', borderBottom: '2px solid #ccc' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Internship</TableCell>
                                <TableCell>Applicants</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activeButton === 'posted' &&
                                jobsPosted.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell>{job.title}</TableCell>
                                        <TableCell>{job.applicants}</TableCell>
                                        <TableCell>
                                            <IconButton size="small" onClick={handleClick}>
                                                <MoreVert />
                                            </IconButton>
                                            <Menu
                                                id={`job-menu-${job.id}`}
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
                            {activeButton === 'closed' &&
                                jobsClosed.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell>{job.title}</TableCell>
                                        <TableCell>{job.applicants}</TableCell>
                                        <TableCell>
                                            <IconButton size="small" onClick={handleClick}>
                                                <MoreVert />
                                            </IconButton>
                                            <Menu
                                                id={`job-menu-${job.id}`}
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
            </Grid>
        </Grid>
    );
};

export default EmployerDashboard;