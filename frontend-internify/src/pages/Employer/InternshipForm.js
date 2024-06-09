import React from 'react';
import { Container, Grid, Typography, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { EStyledField } from '../../misc/MUIComponent';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { selectUserState } from "../../store/user/user-slice";
import { format } from 'date-fns';

const PostInternshipPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUserState);

  const formik = useFormik({
    initialValues: {
      title: '',
      startDate: '',
      endDate: '',
      location: '',
      requiredSkills: '',
      description: '',
      applicationDeadline: '',
      published: 'no',
      acceptingApplication: 'no',
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Title is required'),
      startDate: Yup.string().required('Start Date is required'),
      endDate: Yup.string().required('End Date is required'),
      location: Yup.string().required('Location is required'),
      requiredSkills: Yup.string().required('Required Skills are required'),
      description: Yup.string().required('Description is required'),
      applicationDeadline: Yup.string().required('Application Deadline is required'),
    }),
    onSubmit: async values => {
      console.log("token", user.token);
      console.log("User ID", user.details.user_id);
      console.log("User Type", user.details.user_type);
      try {
        // Format the dates to YYYY/MM/DD
        const formattedValues = {
          ...values,
          startDate: format(new Date(values.startDate), 'yyyy/MM/dd'),
          endDate: format(new Date(values.endDate), 'yyyy/MM/dd'),
          applicationDeadline: format(new Date(values.applicationDeadline), 'yyyy/MM/dd')
        };

        const response = await axios.post('http://127.0.0.1:8000/create_internship/', formattedValues, {
          headers: {
            'X-CSRFToken': user.token, 
            'X-User-ID': user.details.user_id, 
          },
        });
        console.log('Internship Response:', response.data);

        if (response.status === 200) {
          console.log('Internship Posted Successfully');
        } else {
          console.error('Internship Posting failed:', response.data.error);
        }
      } catch (error) {
        console.error('API Error:', error);
      }
    },
  });

  return (
    <Container
      maxWidth="md"
      sx={{
        marginTop: '3rem',
        marginBottom: '3rem',
        padding: '1rem',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
      }}
    >
      <Typography variant="h4" align="center" sx={{ marginBottom: '2rem' }}>
        Post Internship
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              Title
            </Typography>
            <EStyledField
              variant="outlined"
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              Start Date
            </Typography>
            <TextField
              type="date"
              variant="outlined"
              id="startDate"
              name="startDate"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              error={formik.touched.startDate && Boolean(formik.errors.startDate)}
              helperText={formik.touched.startDate && formik.errors.startDate}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              End Date
            </Typography>
            <TextField
              type="date"
              variant="outlined"
              id="endDate"
              name="endDate"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              error={formik.touched.endDate && Boolean(formik.errors.endDate)}
              helperText={formik.touched.endDate && formik.errors.endDate}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              Location
            </Typography>
            <EStyledField
              variant="outlined"
              id="location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              Required Skills
            </Typography>
            <EStyledField
              variant="outlined"
              id="requiredSkills"
              name="requiredSkills"
              value={formik.values.requiredSkills}
              onChange={formik.handleChange}
              error={formik.touched.requiredSkills && Boolean(formik.errors.requiredSkills)}
              helperText={formik.touched.requiredSkills && formik.errors.requiredSkills}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              Description
            </Typography>
            <EStyledField
              minRows={8} // Increased height
              placeholder="Enter description"
              variant="outlined"
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              Application Deadline
            </Typography>
            <EStyledField
              type="date"
              variant="outlined"
              id="applicationDeadline"
              name="applicationDeadline"
              value={formik.values.applicationDeadline}
              onChange={formik.handleChange}
              error={formik.touched.applicationDeadline && Boolean(formik.errors.applicationDeadline)}
              helperText={formik.touched.applicationDeadline && formik.errors.applicationDeadline}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" sx={{ marginBottom: '1rem' }}>
              <FormLabel component="legend">Published</FormLabel>
              <RadioGroup
                row
                aria-label="published"
                name="published"
                value={formik.values.published}
                onChange={formik.handleChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <FormControl component="fieldset" sx={{ marginBottom: '1rem' }}>
              <FormLabel component="legend">Accepting Application</FormLabel>
              <RadioGroup
                row
                aria-label="acceptingApplication"
                name="acceptingApplication"
                value={formik.values.acceptingApplication}
                onChange={formik.handleChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" sx={{ width: '50%', marginTop: '1rem' }}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default PostInternshipPage;
