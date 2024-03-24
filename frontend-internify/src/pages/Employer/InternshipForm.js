import React from 'react';
import { Container, Grid, Typography, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, Button, TextareaAutosize, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { EStyledField } from '../../misc/MUIComponent';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const PostInternshipPage = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            title: '',
            startDate: '',
            endDate: '',
            location: '',
            requiredSkills: '',
            description: '',
            applicationDeadline: '',
            published: 'no',
            acceptingApplication: 'no',
        },
        // onSubmit: async values => {
        //     // Handle form submission logic here
        //     console.log(values);

        //     try{
        //         const response = await axios.post('http://127.0.0.1:8000/create_internship/', values);
        //         console.log('Internship Response:', response.data);

        //         if (response.status === 201) {
        //             console.log('Internship Posted Successfully')
        //             navigate('/')
        //         }
        //         else {
        //             console.error('Internship Posting failed:', response.data.error);
        //             console.log('status: ', response.status)
        //             console.log('values: ', values)
        //         }
        //     }
        //     catch (error) {
        //         console.error('API Error:', error);
        //         // Handle signup error (e.g., network error)
        //         // You might want to set a state to display an error message to the user
        //       }
            
        // },
        onSubmit: async values => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/create_internship/', values);
                console.log('Internship Response:', response.data);

                if (response.status === 201) {
                    console.log('Internship Posted Successfully');
                    // Handle success, e.g., show a success message to the user
                } else {
                    console.error('Internship Posting failed:', response.data.error);
                    // Handle posting failure, e.g., show an error message to the user
                }
            } catch (error) {
                console.error('API Error:', error);
                // Handle API error, e.g., show an error message to the user
            }
        },
    });

    return (
        <Container
            maxWidth="md"
            sx={{
                marginTop: '3rem',
                marginBottom: '3rem',
                padding: '1rem',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
            }}
        >
            <Typography variant="h4" align="center" sx={{ marginBottom: '2rem' }}>
                Post Internship
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                            Title
                        </Typography>
                        <EStyledField
                            variant="outlined"
                            id="title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                            Start Date
                        </Typography>
                        <TextField
                            type="date"
                            variant="outlined"
                            id="startDate"
                            name="startDate"
                            value={formik.values.startDate}
                            onChange={formik.handleChange}
                            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                            helperText={formik.touched.startDate && formik.errors.startDate}
                            sx={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                            End Date
                        </Typography>
                        <TextField
                            type="date"
                            variant="outlined"
                            id="endDate"
                            name="endDate"
                            value={formik.values.endDate}
                            onChange={formik.handleChange}
                            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                            helperText={formik.touched.endDate && formik.errors.endDate}
                            sx={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                            Location
                        </Typography>
                        <EStyledField
                            variant="outlined"
                            id="location"
                            name="location"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                            Required Skills
                        </Typography>
                        <EStyledField
                            variant="outlined"
                            id="requiredSkills"
                            name="requiredSkills"
                            value={formik.values.requiredSkills}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                            Description
                        </Typography>
                        <EStyledField
                            minRows={8} // Increased height
                            placeholder="Enter description"
                            variant="outlined"
                            id="description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                            Application Deadline
                        </Typography>
                        <EStyledField
                            type="date"
                            variant="outlined"
                            id="applicationDeadline"
                            name="applicationDeadline"
                            value={formik.values.applicationDeadline}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <FormControl component="fieldset" sx={{ marginBottom: '1rem' }}>
                            <FormLabel component="legend">Published</FormLabel>
                            <RadioGroup
                                row
                                aria-label="published"
                                name="published"
                                value={formik.values.published}
                                onChange={formik.handleChange}
                            >
                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <FormControl component="fieldset" sx={{ marginBottom: '1rem' }}>
                            <FormLabel component="legend">Accepting Application</FormLabel>
                            <RadioGroup
                                row
                                aria-label="acceptingApplication"
                                name="acceptingApplication"
                                value={formik.values.acceptingApplication}
                                onChange={formik.handleChange}
                            >
                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit" sx={{ width: '50%', marginTop: '1rem',}}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default PostInternshipPage;
