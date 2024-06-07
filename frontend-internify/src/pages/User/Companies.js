import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, TextField, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const companyData = [
      { id: 1, name: 'Company One', description: 'Description for Company One.' },
      { id: 2, name: 'Company Two', description: 'Description for Company Two.' },
      { id: 3, name: 'Company Three', description: 'Description for Company Three.' },
      { id: 4, name: 'Company Four', description: 'Description for Company Four.' },
      { id: 5, name: 'Company Five', description: 'Description for Company Five.' },
      { id: 6, name: 'Company Six', description: 'Description for Company Six.' },
    ];
    setCompanies(companyData);
    setFilteredCompanies(companyData);
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
            {selectedCompany ? selectedCompany.description : 'No description available.'}
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
