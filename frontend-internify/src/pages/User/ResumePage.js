import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { Flexbox } from '../../misc/MUIComponent';
import { useNavigate } from 'react-router-dom';
import resumeImage from '../../assets/resume.png';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserState } from '../../store/user/user-slice';

const Resume = () => {
  const [file, setFile] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [fileAlertOpen, setFileAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const user = useSelector(selectUserState);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setAlertOpen(true);
      setFile(null);
    } else {
      setFile(selectedFile);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleFileAlertClose = () => {
    setFileAlertOpen(false);
  };

  const handleSubmit = async () => {
    if (!file) {
      setFileAlertOpen(true);
      return;
    }

    setLoading(true);  

    const jwtToken = user.token;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/resume/extract_data_from_resume',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Response data: ', response.data);

        setLoading(false); 
        if (response.data) {
          navigate('/submittedresume', { state: { resumeData: response.data } });
        } else if (response.data && response.data.message) {
          console.error('Error analyzing resume:', response.data.message);
        } else {
          console.error('Unexpected response from backend:', response.data);
        };
    } catch (error) {
      console.error('Error submitting resume:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Flexbox sx={{ height: '100vh' }}>
        <Box sx={{ width: '50%', padding: '2rem', textAlign: 'left', marginLeft: 5 }}>
          <Typography variant="h3" gutterBottom>
            Build Your Resume
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Create a professional resume with our user-friendly system. Showcase your skills and experience
            to stand out in the job market.
          </Typography>
          
          <Box sx={{ marginBottom: '1rem' }}>
              Upload your resume (PDF only):
            <Typography variant="body2" color="textSecondary">
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: '#F53855',
                  color: '#F53855',
                  textTransform: 'none',
                  marginRight: '1rem',
                  '&:hover': {
                    borderColor: '#F53855',
                    backgroundColor: 'rgba(245, 56, 85, 0.04)',
                  },
                }}
              >
                Choose File
                <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
              </Button>
              {file && <Typography variant="body2">{file.name}</Typography>}
            </Box>
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#F53855',
              color: 'white',
              textTransform: 'none',
              marginTop: 2,
              '&:hover': {
                backgroundColor: '#D32F2F',
              },
            }}
            onClick={handleSubmit}
          >
            Submit Resume
          </Button>
        </Box>
        <Box sx={{ width: '50%' }}>
          <img
            src={resumeImage}
            alt="Resume"
            style={{ width: '90%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      </Flexbox>
      
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="error">
          Only PDF files are accepted.
        </Alert>
      </Snackbar>
      <Snackbar open={fileAlertOpen} autoHideDuration={6000} onClose={handleFileAlertClose}>
        <Alert onClose={handleFileAlertClose} severity="warning">
          Please upload a PDF file before submitting.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Resume;
