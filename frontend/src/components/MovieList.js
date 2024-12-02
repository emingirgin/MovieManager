import React from 'react';
import { useQuery } from '@apollo/client';
import { 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Container,
  CircularProgress,
  Button,
  Box,
  Paper,
  Rating,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import AddIcon from '@mui/icons-material/Add';
import { GET_MOVIES } from '../graphql/queries';
import { getTMDBMovieDetails } from '../services/tmdb';
import MovieCard from './MovieCard';

const EmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        textAlign: 'center',
        backgroundColor: 'background.default',
        mt: 4
      }}
    >
      <MovieIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        No Movies Found
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Start building your movie collection by adding your first movie.
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => navigate('/add-movie')}
        sx={{ mt: 2 }}
      >
        Add Your First Movie
      </Button>
    </Paper>
  );
};

const MovieList = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_MOVIES);

  if (loading) return (
    <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Container>
  );
  
  if (error) return (
    <Container>
      <Typography color="error">Error: {error.message}</Typography>
    </Container>
  );

  if (!data?.movies?.length) {
    return <EmptyState />;
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/add-movie')}
        >
          Add New Movie
        </Button>
      </Box>
      <Grid container spacing={3}>
        {data.movies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: (theme) => theme.shadows[10],
                }
              }}
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <MovieCard movie={movie} />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {movie.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {movie.year}
                  </Typography>
                  <Chip 
                    label={movie.genre}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Director: {movie.director}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-movie/${movie.id}`);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/movie/${movie.id}`);
                    }}
                  >
                    Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MovieList; 