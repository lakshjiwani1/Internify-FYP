import React from 'react';
import { Box, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import homeImage from '../../assets/home img1.jpeg';
import { Flexbox } from '../../misc/MUIComponent';
import FeatureList from '../../components/FeatureList';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  return (
    <>
      <Flexbox sx={{ height: '100vh', boxShadow: '0px 40px 40px -2px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ width: '50%', padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Welcome to Internify!
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ marginBottom: 5 }} paragraph >
            Your gateway to finding exciting internships and building your career.
          </Typography>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#F53855',
                color: 'white',
                marginRight: '1rem',
                textTransform: 'none',
                fontSize: '1rem',
                width: '10rem',
              }}
            >
              I'm a Seeker
            </Button>
          </Link>
          <Link to="/esignup" style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#F53855',
                color: '#F53855',
                textTransform: 'none',
                fontSize: '1rem',
                width: '10rem',
              }}
            >
              I'm Hiring
            </Button>
          </Link>
        </Box>
        <Box sx={{ width: '50%' }}>
          <img
            src={homeImage}
            alt="Home"
            style={{ width: '90%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      </Flexbox>
      <Flexbox sx={{ height: '100vh', boxShadow: '0px 40px 40px -2px rgba(0, 0, 0, 0.1)' }}>
        {/* Right 50% */}
        <Box sx={{ width: '50%' }}>
          <img
            src={homeImage}
            alt="Home"
            style={{ width: '90%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ width: '50%', padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            The Main Goal of Internify
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Connecting students with opportunities and helping them grow in their chosen field.
          </Typography>
          <FeatureList />
        </Box>
      </Flexbox>
      <Flexbox sx={{ height: '100vh', }}>
        <Box sx={{ width: '50%' }}>
          <img
            src={homeImage}
            alt="Home"
            style={{ width: '90%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ width: '50%', padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            The Main Goal of Internify
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Connecting students with opportunities and helping them grow in their chosen field.
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Access to a wide range of internship opportunities." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Guidance and resources for skill development." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Networking opportunities with industry professionals." />
            </ListItem>
          </List>
        </Box>
      </Flexbox>

    </>
  );
};

export default HomeScreen;
