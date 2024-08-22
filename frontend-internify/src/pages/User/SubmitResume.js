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
  const user = useSelector(selectUserState);

  useEffect(() => {
    // console.log("Location state: ", location.state);
    if (location.state && location.state.resumeData) {
      const { name, skills, education, experience } = location.state.resumeData;
      console.log(location.state.resumeData);
      setName(name);
      setSkills(skills);
      setEducation(education);
      setExperience(experience);
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
      education,
      experience,
    };

    console.log("Resume Data being sent:", resumeData);
    try {
      const response = await axios.post('http://127.0.0.1:8000/resume/save_resume', resumeData, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
        responseType: 'blob',
      });

      if (response.status === 200) {
        console.log('Resume saved successfully');
      } else {
        console.error('Error generating resume:', response.data.message);
      }
    } catch (error) {
      console.error('Error generating resume:', error.response ? error.response.data : error.message);
    }
  };



  return (
    <Box sx={{ padding: '2rem', marginTop: 3 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
            Enter Additional Details
          </Typography>
        </Grid>

        <Grid item xs={12} md={5}>
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
          </Grid>
        </Grid>

        <Grid item xs={12} md={5}>
          <Grid container spacing={2}>
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
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateResume}
        >
          Generate Resume
        </Button>
      </Box>
    </Box>
  );
};

export default SubmitResume;
