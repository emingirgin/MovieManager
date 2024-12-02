import React, { useState } from 'react';
import {
  Container,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Rating,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { ADD_MOVIE } from '../graphql/mutations';
import { GET_MOVIES } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';
import { mapTMDBGenre } from '../utils/genreMapping';
import { getImageUrl, BASE_URL } from '../services/tmdb';

const SearchMovies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const { isAuthenticated } = useAuth();
  
  const [addMovie] = useMutation(ADD_MOVIE, {
    refetchQueries: [{ query: GET_MOVIES }]
  });

  const searchMovies = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching movies:', error);
      setNotification({
        open: true,
        message: 'Error searching movies',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

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

      // Get external IDs for IMDB ID
      const externalIdsResponse = await fetch(
        `${BASE_URL}/movie/${movie.id}/external_ids?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );
      const externalIds = await externalIdsResponse.json();

      if (!externalIds.imdb_id) {
        throw new Error('No IMDB ID found for this movie');
      }

      // Create movie with director name as string
      await addMovie({
        variables: {
          title: movie.title,
          imdbId: externalIds.imdb_id,
          genre: mapTMDBGenre(movie.genre_ids[0]),
          year: new Date(movie.release_date).getFullYear(),
          director: director.name
        }
      });

      setNotification({
        open: true,
        message: `${movie.title} added successfully!`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Full error:', error);
      setNotification({
        open: true,
        message: `Error adding movie: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMovies();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Movies
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Search for movies"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={searchMovies} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : <SearchIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {searchResults.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: (theme) => theme.shadows[10],
                }
              }}
            >
              <CardMedia
                component="img"
                height="400"
                image={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                loading="lazy"
                sx={{ 
                  objectFit: 'cover',
                  backgroundColor: 'grey.300'
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {movie.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={movie.vote_average / 2} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({movie.vote_average.toFixed(1)})
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {new Date(movie.release_date).getFullYear()}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>
                  {movie.overview}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddMovie(movie)}
                >
                  Add to Collection
                </Button>
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

export default SearchMovies; 