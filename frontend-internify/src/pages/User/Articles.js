import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for HTTP requests

const ArticlesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/view_articles/');
        if (response.data && Array.isArray(response.data.articles)) {
          setArticles(response.data.articles);
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

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem', width: '70%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ marginBottom: '1rem' }}>
          <Link to="/articleform" style={{ textDecoration: 'none' }}>
            <Button variant="contained" startIcon={<Add />}>
              Write Article
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
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '0.5rem' }}>Topics</Typography>
          <Grid container spacing={1} justifyContent="center">
            <Grid item>
              <Button variant="outlined" onClick={() => handleTopicSelection('Web')} sx={{ marginRight: '1rem', marginTop: '0.5rem' }}>Web</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={() => handleTopicSelection('App')} sx={{ marginRight: '1rem', marginTop: '0.5rem' }}>App</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={() => handleTopicSelection('AI')} sx={{ marginRight: '1rem', marginTop: '0.5rem' }}>AI</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '2rem' }}>Articles</Typography>
          <Grid container spacing={2}>
            {articles.length > 0 ? (
              articles.map((article) => (
                <Grid item xs={12} md={6} key={article.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{article.title}</Typography>
                      <Typography variant="subtitle1">Topic: {article.topic}</Typography>
                      <Typography variant="body2" sx={{ marginBottom: '1rem' }}>{article.content}</Typography>
                      {/* Add other fields as needed */}
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
    </Container>
  );
};

export default ArticlesPage;