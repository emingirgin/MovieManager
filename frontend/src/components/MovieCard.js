import React, { useState, useEffect } from 'react';
import { Card, CardMedia, Skeleton } from '@mui/material';
import { getImageUrl, getTMDBMovieDetails } from '../services/tmdb';

const MovieCard = ({ movie }) => {
  const [imageError, setImageError] = useState(false);
  const [tmdbData, setTmdbData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTMDBData = async () => {
      try {
        setLoading(true);
        const data = await getTMDBMovieDetails(movie.title, movie.year);
        console.log('TMDB Data for', movie.title, ':', data); // Debug log
        setTmdbData(data);
      } catch (error) {
        console.error('Error fetching TMDB data:', error);
        setImageError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTMDBData();
  }, [movie]);

  if (loading) {
    return <Skeleton variant="rectangular" height={400} />;
  }

  if (imageError || !tmdbData?.poster_path) {
    return (
      <CardMedia
        component="img"
        height="400"
        image="/placeholder-movie.jpg"
        alt={movie.title}
        sx={{ 
          objectFit: 'cover',
          backgroundColor: 'grey.300'
        }}
      />
    );
  }

  const imageUrl = getImageUrl(tmdbData.poster_path, 'w500');
  console.log('Image URL for', movie.title, ':', imageUrl); // Debug log

  return (
    <CardMedia
      component="img"
      height="400"
      image={imageUrl}
      alt={movie.title}
      onError={(e) => {
        console.error('Image load error for', movie.title, e); // Debug log
        setImageError(true);
      }}
      loading="lazy"
      sx={{ 
        objectFit: 'cover',
        backgroundColor: 'grey.300'
      }}
    />
  );
};

export default MovieCard; 