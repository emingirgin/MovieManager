import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { ADD_MOVIE } from '../graphql/mutations';
import { GET_MOVIES } from '../graphql/queries';

const GENRES = [
  'ACTION',
  'COMEDY',
  'DRAMA',
  'HORROR',
  'THRILLER',
  'SCIENCE_FICTION',
  'ROMANCE',
  'DOCUMENTARY'
];

const AddMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    genre: '',
    directorName: '',
    rating: '',
    plot: ''
  });
  const [errors, setErrors] = useState({});

  const [addMovie, { loading, error }] = useMutation(ADD_MOVIE, {
    onCompleted: () => {
      navigate('/');
    },
    refetchQueries: [{ query: GET_MOVIES }]
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.year) {
      newErrors.year = 'Year is required';
    } else if (formData.year < 1888 || formData.year > new Date().getFullYear() + 5) {
      newErrors.year = 'Please enter a valid year';
    }
    if (!formData.genre) newErrors.genre = 'Genre is required';
    if (!formData.directorName.trim()) newErrors.directorName = 'Director name is required';
    if (!formData.rating) {
      newErrors.rating = 'Rating is required';
    } else if (formData.rating < 0 || formData.rating > 10) {
      newErrors.rating = 'Rating must be between 0 and 10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await addMovie({
        variables: {
          input: {
            title: formData.title,
            year: parseInt(formData.year),
            genre: formData.genre,
            directorName: formData.directorName,
            rating: parseFloat(formData.rating),
            plot: formData.plot
          }
        }
      });
    } catch (err) {
      console.error('Error adding movie:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Movie
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error adding movie: {error.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              required
            />

            <TextField
              label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              error={!!errors.year}
              helperText={errors.year}
              required
            />

            <TextField
              select
              label="Genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              error={!!errors.genre}
              helperText={errors.genre}
              required
            >
              {GENRES.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre.replace('_', ' ')}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Director Name"
              name="directorName"
              value={formData.directorName}
              onChange={handleChange}
              error={!!errors.directorName}
              helperText={errors.directorName}
              required
            />

            <TextField
              label="Rating"
              name="rating"
              type="number"
              inputProps={{ step: "0.1", min: "0", max: "10" }}
              value={formData.rating}
              onChange={handleChange}
              error={!!errors.rating}
              helperText={errors.rating || "Rate from 0 to 10"}
              required
            />

            <TextField
              label="Plot"
              name="plot"
              multiline
              rows={4}
              value={formData.plot}
              onChange={handleChange}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ minWidth: 100 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Add Movie'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddMovie; 