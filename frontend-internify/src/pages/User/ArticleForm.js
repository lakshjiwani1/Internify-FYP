import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, TextField, Button, MenuItem, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserState } from '../../store/user/user-slice';

const ArticleForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [topic, setTopic] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector(selectUserState);
    const articleToEdit = location.state?.article;

    useEffect(() => {
        if (articleToEdit) {
            setTitle(articleToEdit.title);
            setContent(articleToEdit.content);
            setTopic(articleToEdit.topic);
        }
    }, [articleToEdit]);

    const getCsrfToken = () => {
        return user.token;
    };

    const handlePostArticle = async () => {
        if (!user.isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            const csrfToken = getCsrfToken();
            if (!csrfToken) {
                console.error('CSRF token not found');
                return;
            }

            const apiEndpoint = articleToEdit
                ? `http://127.0.0.1:8000/update_article/${articleToEdit.id}/`
                : 'http://127.0.0.1:8000/add_article/';

            const response = await axios.post(apiEndpoint, {
                title: title,
                content: content,
                topic: topic,
                author: user.details.user_id, 
            }, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true, 
            });

            console.log('API response:', response.data);

            if (response.data.success) {
                console.log("Article successfully submitted");
                setTitle('');
                setContent('');
                setTopic('');
                navigate('/articles');
            } else {
                console.error('Error submitting article:', response.data.message);
            }
        } catch (error) {
            console.error('Error submitting article:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem', width: '70%' }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sx={{ marginBottom: '1rem' }}>
                    <IconButton onClick={() => navigate('/articles')} sx={{ marginBottom: '1rem' }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" sx={{ marginBottom: '1rem', textAlign: 'center' }}>{articleToEdit ? 'Edit Your Article' : 'Write Your Article'}</Typography>
                    <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>Article Title</Typography>
                    <TextField
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: '1rem' }}
                    />
                    <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>Article Content</Typography>
                    <TextField
                        variant="outlined"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        multiline
                        rows={10}
                        fullWidth
                        sx={{ marginBottom: '1rem' }}
                    />
                    <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>Select Topic</Typography>
                    <TextField
                        select
                        variant="outlined"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: '1rem' }}
                    >
                        <MenuItem value="Web">Web</MenuItem>
                        <MenuItem value="App">App</MenuItem>
                        <MenuItem value="AI">AI</MenuItem>
                    </TextField>
                    <Button
                        variant="contained"
                        onClick={handlePostArticle}
                        disabled={!title || !content || !topic}
                        sx={{ width: '40%' }}
                    >
                        {articleToEdit ? 'Update Article' : 'Post Article'}
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ArticleForm;
