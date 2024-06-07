import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, TextField, Button } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

const Internship = () => {
  const [internships, setInternships] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredInternships, setFilteredInternships] = useState([]);

  const handleSearch = () => {
    const filtered = internships.filter((internship) =>
      internship.fields.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredInternships(filtered);
  };

  useEffect(() => {
    // Fetch data from Django backend
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/view_all_internships/');
        const data = await response.json();

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
  }, []); 

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ textAlign: 'center', marginTop: 4, marginBottom: 2 }}>
        Internships
      </Typography>

      <Box sx={{ width: '80%', margin: 'auto', marginBottom: 2 }}>
        <TextField
          label="Search Internships"
          variant="outlined"
          size="small"
          sx={{ width: '70%', marginRight: 2 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button variant="contained" color="primary" size="medium" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <Box sx={{ width: '80%', margin: 'auto' }}>
        {(searchText ? filteredInternships : internships).map((internship) => (
          <Box key={internship.pk} sx={{ width: '100%', marginBottom: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {internship.fields.title}
                </Typography>
                {/* <Typography variant="body2" color="textPrimary">
                  Company Name: {internship.fields.company.name}
                </Typography> */}
                <Typography variant="body2" color="textPrimary">
                  Start Date: {internship.fields.start_date}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  End Date: {internship.fields.end_date}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  Location: {internship.fields.location}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  Required Skills: {internship.fields.required_skills}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  Qualifications: {internship.fields.qualifications}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  Application Deadline: {internship.fields.application_deadline}
                </Typography>
                {/* <Typography variant="body2" color="textPrimary">
                  {internship.fields.accept_applications ? 'Company is accepting applications' : 'Company is not accepting applications at the moment'}
                </Typography> */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'right', marginTop: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<WorkIcon />}
                    sx={{ width: "110px", height: "37px" }}
                  >
                    Apply
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

    </Container>
  );
};

export default Internship;
