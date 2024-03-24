import React, { useState } from 'react';
import { Container, Grid, Typography, TextField, Button, MenuItem, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material'; // Import the ArrowBack icon

const ArticleForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [topic, setTopic] = useState('');

    const handlePostArticle = () => {
        // Handle posting the article
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem', width: '70%' }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sx={{ marginBottom: '1rem' }}>
                    <IconButton onClick={() => {window.history.back();}} sx={{ marginBottom: '1rem' }}>
                        <ArrowBack /> {/* Back button with ArrowBack icon */}
                    </IconButton>
                    <Typography variant="h4" sx={{ marginBottom: '1rem', textAlign: 'center' }}>Write Your Article</Typography>
                    <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>Article Title</Typography>
                    <TextField
                        variant="outlined"
                        // label="Article Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: '1rem' }}
                    />
                    <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>Article Content</Typography>
                    <TextField
                        variant="outlined"
                        // label="Article Content"
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
                        // label="Select Topic"
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
                        Post Article
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ArticleForm;
