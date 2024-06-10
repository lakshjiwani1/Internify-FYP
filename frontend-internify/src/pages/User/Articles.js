import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, TextField, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ArticlesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/view_articles/');
        console.log('API response:', response.data);

        if (response.data && Array.isArray(response.data.articles)) {
          setArticles(response.data.articles);
          setFilteredArticles(response.data.articles);
          console.log('Articles set:', response.data.articles);
        } else {
          console.error('Invalid data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, []);

  const handleSearch = () => {
    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  };

  const handleTopicSelection = (topic) => {
    const filtered = articles.filter(article => article.topic === topic);
    setFilteredArticles(filtered);
  };

  const handleClickOpen = (article) => {
    setSelectedArticle(article);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedArticle(null);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem', width: '70%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ marginBottom: '1rem' }}>
          <Link to="/articleform" style={{ textDecoration: 'none' }}>
            <Button variant="contained" startIcon={<Add />}>
              Write Article
            </Button>
          </Link>
          <Link to="/myarticles" style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ marginLeft: '1rem' }}>
              My Articles
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <TextField
            variant="outlined"
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flex: '1', marginRight: '1rem' }}
          />
          <Button variant="contained" onClick={handleSearch} sx={{ height: '100%' }}>
            <Search />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '2rem' }}>Articles</Typography>
          <Grid container spacing={2}>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <Grid item xs={12} md={6} key={article.id}>
                  <Card onClick={() => handleClickOpen(article)} sx={{ cursor: 'pointer', height: '150px', overflow: 'hidden' }}>
                    <CardContent>
                      <Typography variant="h6" noWrap>{article.title}</Typography>
                      <Typography variant="body2" sx={{ marginBottom: '1rem', height: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {article.content.length > 100 ? article.content.substring(0, 100) + '...' : article.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center'}}>No articles available.</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>{selectedArticle?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedArticle?.content}
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

export default ArticlesPage;
