import React from 'react';
import { Box, Container, Grid, Link, Typography } from '@mui/material';
import footerImage from '../assets/logo-white.png';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#F53855',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // paddingBottom: 20,
        color: 'white',
        marginTop: 10,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <img src={footerImage} alt="Footer Image" style={{ width: '50%', borderRadius: '8px' }} />
          <Typography variant='body2' sx={{width: '20rem', marginLeft: 5}}>
            Internify is a platform to find internships and discuss about application building.
          </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ marginBottom: '1.5rem' }}>
                  General
                </Typography>
                <Link href="/signup" color="inherit" underline="hover" sx={{ display: 'block', marginBottom: '0.5rem' }}>
                  Sign Up
                </Link>
                <Link href="/login" color="inherit" underline="hover" sx={{ display: 'block', marginBottom: '0.5rem' }}>
                  Log In
                </Link>
                <Link href="/" color="inherit" underline="hover" sx={{ display: 'block' }}>
                  About Us
                </Link>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ marginBottom: '1.5rem' }}>
                  Browse
                </Typography>
                <Link href="/internships" color="inherit" underline="hover" sx={{ display: 'block', marginBottom: '0.5rem' }}>
                  Internships
                </Link>
                <Link href="/companies" color="inherit" underline="hover" sx={{ display: 'block', marginBottom: '0.5rem' }}>
                  Companies
                </Link>
                <Link href="/articles" color="inherit" underline="hover" sx={{ display: 'block' }}>
                  Articles
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Typography variant="body2" sx={{marginTop: 20}}>
              © {new Date().getFullYear()} Internify. All rights reserved.
            </Typography>
    </Box>
  );
};

export default Footer;


