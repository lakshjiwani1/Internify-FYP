import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Chip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserState } from '../../store/user/user-slice';

const SubmitResume = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [fileContent, setFileContent] = useState('');
  const user = useSelector(selectUserState);

  useEffect(() => {
    if (location.state && location.state.resumeData) {
      const { name, skills, education, experience, content } = location.state.resumeData;
      setName(name);
      setSkills(skills);
      setEducation(education);
      setExperience(experience);
      setFileContent(content);
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

  const handleVerify = async () => {
    const csrfToken = user.token ; 
    console.log("Token", user.token);
    const resumeData = {
      name,
      skills,
      education,
      experience,
    };

    try {
      const saveResponse = await axios.post('http://127.0.0.1:8000/resume/save_resume', resumeData, {
        headers: {
          'Authorization': `Bearer ${csrfToken}`,
          'X-CSRFToken': csrfToken,
        },
      });

      if (saveResponse.data.success) {
        console.log('Resume saved successfully');
      } else {
        console.error('Error saving resume:', saveResponse.data.message);
      }
    } catch (error) {
      console.error('Error saving resume:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', height: '100vh', marginTop: 3 }}>
      <Box sx={{ width: '50%', padding: '2rem', textAlign: 'left' }}>
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
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              Experience
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: '2rem' }}
          onClick={handleVerify}
        >
          Verify
        </Button>
      </Box>

      <Box sx={{ width: '50%', padding: '2rem', textAlign: 'left' }}>
        <Typography variant="h5" sx={{ textAlign: 'center' }} gutterBottom>
          Uploaded File
        </Typography>
        {fileContent ? (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{fileContent}</Typography>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center' }}>No file uploaded</Typography>
        )}
      </Box>
    </Box>
  );
};

export default SubmitResume;
