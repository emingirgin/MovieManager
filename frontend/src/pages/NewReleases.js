import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Rating,
  Button,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { getNewReleases, getImageUrl, getMovieExternalIds, BASE_URL } from '../services/tmdb';
import { ADD_MOVIE } from '../graphql/mutations';
import { GET_MOVIES, CHECK_MOVIE } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';
import { mapTMDBGenre } from '../utils/genreMapping';

const NewReleases = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const { isAuthenticated } = useAuth();
  const [movieStatuses, setMovieStatuses] = useState({});
  
  const [addMovie] = useMutation(ADD_MOVIE, {
    refetchQueries: [{ query: GET_MOVIES }]
  });

  const [checkMovie] = useLazyQuery(CHECK_MOVIE);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getNewReleases();
      if (data?.results) {
        setMovies(data.results);
        // Check IMDB IDs for all movies
        const statusChecks = await Promise.all(
          data.results.map(async (movie) => {
            const imdbId = await getMovieExternalIds(movie.id);
            if (imdbId) {
              const { data: checkData } = await checkMovie({
                variables: { imdbId }
              });
              return [movie.id, { imdbId, exists: checkData?.checkMovie }];
            }
            return [movie.id, { imdbId: null, exists: false }];
          })
        );
        setMovieStatuses(Object.fromEntries(statusChecks));
      }
      setLoading(false);
    };
    fetchMovies();
  }, [checkMovie]);

  const handleAddMovie = async (movie) => {
    if (!isAuthenticated) {
      setNotification({
        open: true,
        message: 'Please login to add movies',
        severity: 'warning'
      });
      return;
    }

    try {
      const imdbId = movieStatuses[movie.id]?.imdbId;
      if (!imdbId) {
        throw new Error('No IMDB ID found for this movie');
      }

      // Get additional movie details including credits
      const detailsResponse = await fetch(
        `${BASE_URL}/movie/${movie.id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&append_to_response=credits`
      );
      const movieDetails = await detailsResponse.json();
      
      // Find the director from credits
      const director = movieDetails.credits.crew.find(person => person.job === 'Director');
      if (!director) {
        throw new Error('No director information found');
      }

      // Create movie with director name
      const { data: movieData } = await addMovie({
        variables: {
          title: movie.title,
          imdbId,
          genre: mapTMDBGenre(movie.genre_ids[0]),
          year: new Date(movie.release_date).getFullYear(),
          director: director.name
        }
      });

      if (movieData?.createMovie) {
        setMovieStatuses(prev => ({
          ...prev,
          [movie.id]: { ...prev[movie.id], exists: true }
        }));
        setNotification({
          open: true,
          message: `${movie.title} added successfully!`,
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Full error:', error);
      setNotification({
        open: true,
        message: `Error adding movie: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleMovieClick = (movie) => {
    const status = movieStatuses[movie.id];
    if (status?.exists) {
      // Navigate to movie details if it exists in our database
      navigate(`/movie/${movie.id}`);
    } else {
      // Otherwise try to add it
      handleAddMovie(movie);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        New Releases
      </Typography>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
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
              onClick={() => handleMovieClick(movie)}
            >
              <CardMedia
                component="img"
                height="400"
                image={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                loading="lazy"
                sx={{ objectFit: 'cover', backgroundColor: 'grey.300' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {movie.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={movie.vote_average / 2} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {movie.vote_average.toFixed(1)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                  {movie.overview}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={new Date(movie.release_date).toLocaleDateString()}
                    size="small"
                  />
                  {movieStatuses[movie.id]?.exists ? (
                    <Chip 
                      label="In Collection"
                      color="primary"
                      size="small"
                    />
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddMovie(movie);
                      }}
                    >
                      Add to Collection
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewReleases; 