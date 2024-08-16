import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserState } from '../../store/user/user-slice';

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const user = useSelector(selectUserState);
  const [token, setToken] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch token from local storage
    const fetchToken = () => {
      const storedToken = localStorage.getItem('access_token'); // Token key from LoginForm
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/view_articles/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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
      } finally {
        setLoading(false);
      }
    };

    if (token) { // Ensure token is available before making request
      fetchArticles();
    }
  }, [token]);


  const handleUpdateArticle = (article) => {
    navigate(`/articleform/${article.id}`, { state: { article } });
  };

  const handleDeleteArticle = async (id) => {
    if (!user.isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const csrfToken = user.token;
      if (!csrfToken) {
        console.error('CSRF token not found');
        return;
      }

      const response = await axios.post(`http://127.0.0.1:8000/delete_article/${id}/`, {}, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        console.log("Article deleted successfully");
        setArticles(articles.filter(article => article.id !== id));
      } else {
        console.error('Error deleting article:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting article:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <Box sx={{ width: '80%', padding: '2rem', margin: '0 auto', marginTop: '3rem' }}>
      <IconButton onClick={() => navigate('/articles')} sx={{ marginBottom: '1rem' }}>
        <ArrowBack />
      </IconButton>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', marginBottom: '2rem' }}>
        My Articles
      </Typography>
      {articles.map((article) => (
        <Box
          key={article.id}
          sx={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '150px',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ textAlign: 'left', width: '70%' }}>
            <Typography variant="h6" noWrap>{article.title}</Typography>
            <Typography variant="body2" sx={{ height: '60px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
              {article.content.length > 100 ? article.content.substring(0, 100) + '...' : article.content}
            </Typography>
          </Box>
          <Stack spacing={1} alignItems="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleUpdateArticle(article)}
              sx={{ marginBottom: '0.5rem' }}
            >
              Update
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleDeleteArticle(article.id)}
              sx={{ marginTop: '0.5rem' }}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export default MyArticles;
