import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, TextField, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/get_company/');
        console.log('API response:', response.data);

        if (response.data && Array.isArray(response.data.companies)) {
          const processedData = response.data.companies.map(company => ({
            id: company.pk,
            name: company.fields.name,
            address: company.fields.address,
            email: company.fields.email,
            description: company.fields.description,
            user: company.fields.user
          }));
          setCompanies(processedData);
          setFilteredCompanies(processedData);
          console.log('Companies set:', processedData);
        } else {
          console.error('Invalid data format:', response.data);
          setError('Fetched data does not contain a companies array');
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError('Error fetching companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleSearch = () => {
    const filtered = companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
  };

  const handleClickOpen = (company) => {
    setSelectedCompany(company);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCompany(null);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem', width: '70%', textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem', width: '70%', textAlign: 'center' }}>
        <Typography variant="body1" color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem', width: '70%' }}>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '1rem' }}>
        Companies Aboard
      </Typography>
      <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '2rem' }}>
        Discover companies and read reviews from real employees.
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: '2rem' }}>
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <TextField
            variant="outlined"
            label="Search Companies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flex: '1', marginRight: '1rem' }}
          />
          <Button variant="contained" onClick={handleSearch} sx={{ height: '100%' }}>
            Search
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
                    {company.name}
                  </Typography>
                  <Button variant="outlined" color="primary" onClick={() => handleClickOpen(company)} sx={{ marginRight: '1rem' }}>
                    View Company
                  </Button>
                  <Link to={`/companies/${company.id}/reviews`} style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" color="secondary">Reviews</Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', width: '100%' }}>No companies available.</Typography>
        )}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedCompany ? selectedCompany.name : 'Company'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedCompany ? `Address: ${selectedCompany.address}` : 'No address available.'}
          </DialogContentText>
          <DialogContentText>
            {selectedCompany ? `Email: ${selectedCompany.email}` : 'No email available.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Companies;
