import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { selectUserState } from "../../store/user/user-slice";
import { format, isBefore, startOfToday } from 'date-fns';
import {
  Container, Grid, Typography, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, Button, TextField, Alert
} from '@mui/material';
import { EStyledField } from '../../misc/MUIComponent';

const InternshipForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUserState);
  const [internship, setInternship] = useState(null);
  const [successAlert, setSuccessAlert] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchInternship = async () => {
        console.log('JWT Token', user.token)
        console.log('IsAuthenticated', user.isAuthenticated)
        try {
          const response = await axios.get(`http://127.0.0.1:8000/internship_detail/${id}/`);
          setInternship(response.data);
          console.log('Fetched Internship Data:', response.data);
        } catch (error) {
          console.error('Error fetching internship:', error);
        }
      };
      fetchInternship();
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      title: '',
      start_date: '',
      end_date: '',
      location: '',
      required_skills: '',
      qualifications: '',
      application_deadline: '',
      is_published: 'no',
      accept_applications: 'no',
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Title is required'),
      start_date: Yup.date().required('Start Date is required').test(
        'start_date',
        'Start date must be after today',
        (value) => value && isBefore(startOfToday(), new Date(value))
      ),
      end_date: Yup.date().required('End Date is required').test(
        'end_date',
        'End date must be after start date',
        function (value) {
          const { start_date } = this.parent;
          return value && new Date(value) > new Date(start_date);
        }
      ),
      location: Yup.string().required('Location is required'),
      required_skills: Yup.string().required('Required Skills are required'),
      qualifications: Yup.string().required('Qualifications are required'),
      application_deadline: Yup.date().required('Application Deadline is required').test(
        'application_deadline',
        'Application deadline must be after today',
        (value) => value && isBefore(startOfToday(), new Date(value))
      ).test(
        'application_deadline',
        'Application deadline must be before start date',
        function (value) {
          const { start_date, end_date } = this.parent;
          return value && new Date(value) < new Date(start_date) && new Date(value) <= new Date(end_date);
        }
      ).test(
        'application_deadline',
        'Application deadline and start date cannot be the same day',
        function (value) {
          const { start_date } = this.parent;
          return value && start_date && new Date(value).toDateString() !== new Date(start_date).toDateString();
        }
      ),
    }),
    onSubmit: async (values) => {
      try {
        const formattedValues = {
          ...values,
          start_date: format(new Date(values.start_date), 'yyyy-MM-dd'),
          end_date: format(new Date(values.end_date), 'yyyy-MM-dd'),
          application_deadline: format(new Date(values.application_deadline), 'yyyy-MM-dd'),
        };
        const url = id 
          ? `http://127.0.0.1:8000/update_internship/${id}/` 
          : 'http://127.0.0.1:8000/create_internship/';
        const method = id ? 'post' : 'post';
        const response = await axios[method](url, formattedValues, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        
        if (response.status === 200) {
          setSuccessAlert(true); 
          setTimeout(() => setSuccessAlert(false), 10000); 
          navigate('/employer');
        } else {
          console.error('Internship submission failed:', response.data.error);
        }
      } catch (error) {
        console.error('API Error:', error);
      }
    },
  });

  useEffect(() => {
    if (internship) {
      formik.setValues({
        title: internship.title,
        start_date: internship.start_date,
        end_date: internship.end_date,
        location: internship.location,
        required_skills: internship.required_skills,
        qualifications: internship.qualifications,
        application_deadline: internship.application_deadline,
        is_published: internship.is_published ? 'yes' : 'no',
        accept_applications: internship.accept_applications ? 'yes' : 'no',
      });
    }
  }, [internship]);

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
        {id ? 'Edit Internship' : 'Post Internship'}
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
              id="start_date"
              name="start_date"
              value={formik.values.start_date}
              onChange={formik.handleChange}
              error={formik.touched.start_date && Boolean(formik.errors.start_date)}
              helperText={formik.touched.start_date && formik.errors.start_date}
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
              id="end_date"
              name="end_date"
              value={formik.values.end_date}
              onChange={formik.handleChange}
              error={formik.touched.end_date && Boolean(formik.errors.end_date)}
              helperText={formik.touched.end_date && formik.errors.end_date}
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
              id="required_skills"
              name="required_skills"
              value={formik.values.required_skills}
              onChange={formik.handleChange}
              error={formik.touched.required_skills && Boolean(formik.errors.required_skills)}
              helperText={formik.touched.required_skills && formik.errors.required_skills}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              Qualifications
            </Typography>
            <EStyledField
              minRows={8}
              variant="outlined"
              id="qualifications"
              name="qualifications"
              value={formik.values.qualifications}
              onChange={formik.handleChange}
              error={formik.touched.qualifications && Boolean(formik.errors.qualifications)}
              helperText={formik.touched.qualifications && formik.errors.qualifications}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem' }}>
              Application Deadline
            </Typography>
            <EStyledField
              type="date"
              variant="outlined"
              id="application_deadline"
              name="application_deadline"
              value={formik.values.application_deadline}
              onChange={formik.handleChange}
              error={formik.touched.application_deadline && Boolean(formik.errors.application_deadline)}
              helperText={formik.touched.application_deadline && formik.errors.application_deadline}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" sx={{ marginBottom: '1rem' }}>
              <FormLabel component="legend">Published</FormLabel>
              <RadioGroup
                row
                aria-label="is_published"
                name="is_published"
                value={formik.values.is_published}
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
                aria-label="accept_applications"
                name="accept_applications"
                value={formik.values.accept_applications}
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
      {successAlert && (
        <Alert severity="success" sx={{ marginTop: '1rem' }}>
          {id ? 'Internship Updated Successfully' : 'Internship Posted Successfully'}
        </Alert>
      )}
    </Container>
  );
};

export default InternshipForm;
