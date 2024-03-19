import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Container, Grid, Typography, Paper, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { EStyledField, Flexbox } from '../../misc/MUIComponent';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

const LoginForm = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: (values) => {
            console.log('Login Form Submitted', values);
            // Backend work here.
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required'),
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
                        Welcome back to Internify Employer!
                    </Typography>
                    <Box mt={2} sx={{ marginLeft: '9rem' }}>
                        <Typography variant="body1">
                            Don't have an account?{' '}
                            <Link to="/esignup" sx={{ color: '#F53855' }}>
                                Sign Up here.
                            </Link>
                        </Typography>
                    </Box>
                    <form onSubmit={formik.handleSubmit} style={{ marginLeft: '9rem' }}>
                        <Grid container spacing={2}>
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
                            <Grid item xs={12} sx={{ }}>
                                <Typography variant="body1">
                                    Forgot your password?{' '}
                                    <Link to="/employer" sx={{ color: '#F53855' }}>
                                        Reset it here.
                                    </Link>
                                </Typography>
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
                                marginTop: 2, // Adjusted margin top
                                borderRadius: 10,
                                textTransform: 'none',
                                marginLeft: "4rem"
                            }}
                        >
                            Login
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Flexbox>
    );
};

export default LoginForm;
