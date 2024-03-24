import React, { useState } from 'react';
import { Container, Grid, Typography, TextField, Button, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ArticlesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredArticles, setFilteredArticles] = useState([]);

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

    const handleWriteArticle = () => {
        // Redirect to the write article page or handle this according to your application flow
    };

    const articles = [
        {
            id: 1,
            title: 'Title of Article 1',
            writer: 'Writer Name',
            description: 'Starting text of the article...',
            imageUrl: 'https://via.placeholder.com/150',
            topic: 'Web'
        },
        {
            id: 2,
            title: 'Title of Article 2',
            writer: 'Writer Name',
            description: 'Starting text of the article...',
            imageUrl: 'https://via.placeholder.com/150',
            topic: 'App'
        },
        // Add more articles as needed
    ];

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
                    {/* Add more topics as needed */}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '2rem' }}>Articles</Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {(filteredArticles.length > 0 ? filteredArticles : articles).map((article) => (
                            <Grid item xs={12} md={6} key={article.id}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={article.imageUrl}
                                        alt="Article Image"
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{article.title}</Typography>
                                        <Typography variant="subtitle1">{article.writer}</Typography>
                                        <Typography variant="body2" sx={{ marginBottom: '1rem' }}>{article.description}</Typography>
                                        <Button href="#" sx={{ marginRight: '1rem' }}>View Article</Button>
                                        <IconButton aria-label="save">
                                            {/* <BookmarkIcon/> */}
                                        </IconButton>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ArticlesPage;
