import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Chip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserState } from '../../store/user/user-slice';
import resumeImage from '../../assets/resume.png'; 

const SubmitResume = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [education_fields, setEducation] = useState('');
  const [resumeGenerated, setResumeGenerated] = useState(false); 
  const user = useSelector(selectUserState);

  useEffect(() => {
    if (location.state && location.state.resumeData) {
      const { name, skills, education_fields } = location.state.resumeData;
      setName(name);
      setSkills(skills);
      setEducation(education_fields);
    }
  }, [location.state]);

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setSkills(skills.filter((skill) => skill !== skillToDelete));
  };

  const handleGenerateResume = async () => {
    const jwtToken = user.token;

    const resumeData = {
      name,
      skills,
      education_fields,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/resume/save_resume', resumeData, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
        responseType: 'blob',
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Resume details saved successfully');
        setResumeGenerated(true); 
      } else {
        console.error('Error saving resume details:', response.data.message);
      }
    } catch (error) {
      console.error('Error saving resume details:', error.response ? error.response.data : error.message);
    }
  };

  const handleDownloadResume = async () => {
    const jwtToken = user.token;

    try {
      const response = await axios.get('http://127.0.0.1:8000/resume/generate_resume', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      });

      if (response.status === 200 || response.status === 201) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'resume.pdf');
        document.body.appendChild(link);
        link.click();
        console.log('Resume downloaded successfully');
      } else {
        console.error('Error generating resume:', response.data.message);
      }
    } catch (error) {
      console.error('Error generating resume:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <Box sx={{ padding: '2rem', marginTop: 3 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
            Enter Additional Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                Name
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
                <TextField
                  variant="outlined"
                  size="small"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add new skill"
                />
                <Button variant="contained" color="primary" onClick={handleAddSkill}>
                  Add
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
                Education
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={education_fields}
                onChange={(e) => setEducation(e.target.value)}
              />
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateResume}
            >
              Submit
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
          <img
            src={resumeImage}
            alt="Resume Preview"
            style={{ width: '80%', height: 'auto', marginBottom: '1rem', marginTop: '-1rem' }} 
          />
          <Typography variant="h6">
            {resumeGenerated
              ? "Your ATS-Friendly Resume is Ready! Download now by clicking the button below."
              : "Save your details now to get a generated Resume"}
          </Typography>
          {resumeGenerated && (
            <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownloadResume}
              >
                Download
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubmitResume;
