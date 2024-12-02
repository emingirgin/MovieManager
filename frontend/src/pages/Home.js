import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import MovieList from '../components/MovieList';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';

const Home = () => {
  return (
    <Container>
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          py: 4,
          px: 2,
          mb: 4,
          borderRadius: 0,
          boxShadow: (theme) => `0 4px 6px ${theme.palette.primary.dark}`,
        }}
      >
        <Container>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2 
          }}>
            <LocalMoviesIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Movie Manager
              </Typography>
              <Typography variant="subtitle1">
                Manage your movie collection with ease
              </Typography>
            </Box>
          </Box>
        </Container>
      </Paper>
      <MovieList />
    </Container>
  );
};

export default Home; 