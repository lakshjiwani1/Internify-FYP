import React from 'react';
import { Box, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import homeImage from '../../assets/home img1.jpeg';
import resume from '../../assets/resume.png';
import features from '../../assets/features.jpg';
import internships from '../../assets/internship img.jpg';
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
            src={features}
            alt="Features Side Image"
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

      <Flexbox sx={{ height: '100vh', boxShadow: '0px 40px 40px -2px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ width: '50%', padding: '2rem', textAlign: 'right' }}>
          <Typography variant="h4" gutterBottom>
            Explore Exciting Internship Opportunities
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 5 }} paragraph>
            Unlock your potential with Internify – your gateway to finding meaningful internships and building a successful career.
          </Typography>
          <Link to="/internships" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#F53855',
                color: 'white',
                textTransform: 'none',
                fontSize: '0.9rem',
                width: '12rem',
              }}
            >
              Browse Internships
            </Button>
          </Link>
        </Box>
        <Box sx={{ width: '50%' }}>
          <img
            src={internships}
            alt="Internships Img"
            style={{ width: '90%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      </Flexbox>

      <Flexbox sx={{ height: '100vh', }}>
        <Box sx={{ width: '50%' }}>
          <img
            src={resume}
            alt="Resume Building Img"
            style={{ width: '90%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ width: '50%', padding: '2rem', textAlign: 'left' }}>
          <Typography variant="h4" gutterBottom >
            Build a Resume Using Our ATS-Friendly System
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Create a professional resume with our user-friendly system. Showcase your skills and experience
            to stand out in the job market. Our advanced features allow you to customize your resume
            effortlessly, ensuring it aligns perfectly with your career goals.
          </Typography>
          <Link to="/resume" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#F53855',
                color: 'white',
                marginRight: '1rem',
                textTransform: 'none',
                fontSize: '0.9rem',
                width: '12rem',
              }}
            >
              Build My Resume
            </Button>
          </Link>
        </Box>
      </Flexbox>

    </>
  );
};

export default HomeScreen;
