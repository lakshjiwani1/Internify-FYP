import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Container, Grid, MenuItem, Typography, Paper, useMediaQuery, useTheme, TextField } from '@mui/material';
import { EStyledField, Flexbox } from '../../misc/MUIComponent';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

const SignupForm = () => {
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            contactNumber: '',
            taxId: '',
            address: '',
            industryType: '',
            website: '',
            description: '',
        },
        onSubmit: (values) => {
            console.log('Form Submitted', values);
            // Backend work here.
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            username: Yup.string().required('Required'),
            password: Yup.string().min(8, 'Must be at least 8 characters').required('Required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required'),
            contactNumber: Yup.string().required('Required'),
            taxId: Yup.string().required('Required'),
            address: Yup.string().required('Required'),
            industryType: Yup.string().required('Required'),
            website: Yup.string().url('Invalid URL').required('Required'),
            description: Yup.string(),
        }),
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


    return (
        <Flexbox
            sx={{
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
                padding: "3rem",
            }}
        >
            <Container component="main" maxWidth="md">
                <Paper
                    elevation={3}
                    sx={{
                        padding: '2rem',
                        borderRadius: '15px',
                    }}
                >
                    <Typography variant="h4" sx={{ marginBottom: '2rem', textAlign: 'center' }}>
                        Welcome to Internify Employer!
                    </Typography>
                    <Box>
                        <Typography variant="body1" sx={{ marginLeft: '9rem', marginBottom: '1rem' }}>
                            If you already have an account registered You can{' '}
                            <Link to="/elogin" sx={{ color: '#F53855' }}>
                                Login here.
                            </Link>
                        </Typography>
                    </Box>
                    <form onSubmit={formik.handleSubmit} style={{ marginLeft: '9rem' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                                    Names
                                </Typography>
                                <EStyledField
                                    variant="outlined"
                                    id="name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                                    Email
                                </Typography>
                                <EStyledField
                                    variant="outlined"
                                    id="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                                    Username
                                </Typography>
                                <EStyledField
                                    variant="outlined"
                                    id="username"
                                    name="username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username}
                                />
                            </Grid>
                            {/* ... Repeat for other fields ... */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                                    Password
                                </Typography>
                                <EStyledField
                                    variant="outlined"
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                                    Confirm Password
                                </Typography>
                                <EStyledField
                                    variant="outlined"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                                    Contact Number
                                </Typography>
                                <EStyledField
                                    variant="outlined"
                                    id="contactNumber"
                                    name="contactNumber"
                                    value={formik.values.contactNumber}
                                    onChange={formik.handleChange}
                                    error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                                    helperText={formik.touched.contactNumber && formik.errors.contactNumber}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                                    Tax ID
                                </Typography>
                                <EStyledField
                                    variant="outlined"
                                    id="taxId"
                                    name="taxId"
                                    value={formik.values.taxId}
                                    onChange={formik.handleChange}
                                    error={formik.touched.taxId && Boolean(formik.errors.taxId)}
                                    helperText={formik.touched.taxId && formik.errors.taxId}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                                    Address
                                </Typography>
                                <EStyledField
                                    variant="outlined"
                                    id="address"
                                    name="address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                                    Industry Type
                                </Typography>
                                <EStyledField
                                    variant="outlined"
                                    id="industryType"
                                    name="industryType"
                                    select
                                    value={formik.values.industryType}
                                    onChange={formik.handleChange}
                                    error={formik.touched.industryType && Boolean(formik.errors.industryType)}
                                    helperText={formik.touched.industryType && formik.errors.industryType}
                                >
                                    <MenuItem value="technology">Technology</MenuItem>
                                    <MenuItem value="finance">Finance</MenuItem>
                                    <MenuItem value="healthcare">Healthcare</MenuItem>
                                </EStyledField>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                                    Website
                                </Typography>
                                <EStyledField
                                    variant="outlined"
                                    id="website"
                                    name="website"
                                    value={formik.values.website}
                                    onChange={formik.handleChange}
                                    error={formik.touched.website && Boolean(formik.errors.website)}
                                    helperText={formik.touched.website && formik.errors.website}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                                    Description
                                </Typography>
                                <EStyledField
                                    variant="outlined"
                                    id="description"
                                    name="description"
                                    multiline
                                    rows={4}
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                width: '60%',
                                height: '2.5rem',
                                color: 'white',
                                backgroundColor: '#F53855',
                                marginTop: 5,
                                borderRadius: 10,
                                textTransform: 'none',
                                marginLeft: "4rem"
                            }}
                        >
                            Register
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Flexbox>
    );
};

export default SignupForm;
