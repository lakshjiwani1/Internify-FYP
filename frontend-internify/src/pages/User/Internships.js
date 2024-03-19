import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent } from '@mui/material';

const Internship = () => {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    // Fetch data from Django backend
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/view_all_internships/');
        const data = await response.json();

        // Check if data has the 'internships' property and it's an array
        if (data.hasOwnProperty('internships') && Array.isArray(data.internships)) {
          setInternships(data.internships);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure the effect runs only once on component mount

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Internships Posted
      </Typography>
      {internships.map((internship) => (
        <Card key={internship.pk} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {internship.fields.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Company Name: {internship.fields.company.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Start Date: {internship.fields.start_date}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              End Date: {internship.fields.end_date}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Location: {internship.fields.location}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Required Skills: {internship.fields.required_skills}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Qualifications: {internship.fields.qualifications}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Application Deadline: {internship.fields.application_deadline}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {internship.fields.accept_applications ? 'Company is accepting applications' : 'Company is not accepting applications at the moment'}
            </Typography>
            {/* Add more internship details as needed */}
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Internship;
