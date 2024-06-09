import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';

const SubmitResume = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', height: '100vh', marginTop: 3 }}>
      <Box sx={{ width: '50%', padding: '2rem', textAlign: 'left' }}>
        <Typography variant="h5" gutterBottom sx={{textAlign: 'center'}}>
          Enter Additional Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              Name
            </Typography>
            <TextField variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              Skills
            </Typography>
            <TextField variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              Education
            </Typography>
            <TextField variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              Experience
            </Typography>
            <TextField variant="outlined" fullWidth />
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" sx={{ marginTop: '2rem' }}>
          Verify
        </Button>
      </Box>

      <Box sx={{ width: '50%', padding: '2rem', textAlign: 'left' }}>
        <Typography variant="h5" sx={{textAlign: 'center'}} gutterBottom>
          Uploaded File
        </Typography>
        {file ? (
          <Typography variant="body1">{file.name}</Typography>
        ) : (
          <Typography variant="body1" sx={{textAlign: 'center'}}>No file uploaded</Typography>
        )}
      </Box>
    </Box>
  );
};

export default SubmitResume;
