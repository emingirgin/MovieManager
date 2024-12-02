import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Box, 
  Paper,
  Grid,
  Rating,
  Button,
  Divider,
  Chip,
  ImageList,
  ImageListItem,
  Card,
  CardMedia,
  Modal,
  IconButton,
  CardContent
} from '@mui/material';
import { 
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  MovieCreation as MovieIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  Category as CategoryIcon,
  PlayCircleOutline as PlayIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { GET_MOVIE } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';
import { getTMDBMovieDetails, getImageUrl } from '../services/tmdb';

const VideoModal = ({ open, handleClose, videoKey, title }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ 
        width: '80vw', 
        height: '60vh', 
        bgcolor: 'background.paper', 
        p: 1,
        position: 'relative'
      }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.7)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          frameBorder="0"
          allowFullScreen
          title={title}
        />
      </Box>
    </Modal>
  );
};

const ImageModal = ({ open, handleClose, imageUrl, title }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ 
        maxWidth: '90vw', 
        maxHeight: '90vh',
        position: 'relative'
      }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.7)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        <img
          src={imageUrl}
          alt={title}
          style={{
            maxWidth: '100%',
            maxHeight: '90vh',
            objectFit: 'contain'
          }}
        />
      </Box>
    </Modal>
  );
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tmdbData, setTmdbData] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { loading, error, data } = useQuery(GET_MOVIE, {
    variables: { id }
  });

  useEffect(() => {
    const fetchTMDBData = async () => {
      if (data?.movie) {
        const tmdbDetails = await getTMDBMovieDetails(data.movie.title, data.movie.year);
        setTmdbData(tmdbDetails);
      }
    };
    fetchTMDBData();
  }, [data]);

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

  const movie = data?.movie;

  if (!movie) return (
    <Container>
      <Typography>Movie not found</Typography>
    </Container>
  );

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ mt: 4, p: 4 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            {movie.title}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Movie Info & Media */}
          <Grid item xs={12} md={8}>
            {/* Poster and Basic Info */}
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3}>
                {tmdbData?.poster_path && (
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardMedia
                        component="img"
                        image={getImageUrl(tmdbData.poster_path, 'w500')}
                        alt={movie.title}
                        sx={{ width: '100%', height: 'auto' }}
                      />
                    </Card>
                  </Grid>
                )}
                <Grid item xs={12} sm={8}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DateIcon color="primary" />
                      <Typography variant="subtitle1">
                        Year: {movie.year}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CategoryIcon color="primary" />
                      <Typography variant="subtitle1">
                        Genre: {movie.genre}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="primary" />
                      <Typography variant="subtitle1">
                        Director: {movie.director.name}
                      </Typography>
                    </Box>
                    {tmdbData?.vote_average && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Rating 
                          value={tmdbData.vote_average / 2}
                          precision={0.5}
                          readOnly
                        />
                        <Typography>
                          {tmdbData.vote_average.toFixed(1)}/10 (TMDb)
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Plot/Overview section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>Overview</Typography>
              <Typography variant="body1" paragraph>
                {tmdbData?.overview || 'No plot description available.'}
              </Typography>
            </Box>

            {/* Trailers */}
            {tmdbData?.videos?.results?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Official Trailers
                </Typography>
                <Grid container spacing={2}>
                  {tmdbData.videos.results.map((video) => (
                    <Grid item xs={12} sm={6} md={4} key={video.key}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { transform: 'scale(1.02)' },
                          transition: 'transform 0.2s'
                        }}
                        onClick={() => setSelectedVideo(video.key)}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            image={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                            alt={video.name}
                            onError={(e) => {
                              e.target.src = `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              bgcolor: 'rgba(0,0,0,0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <PlayIcon sx={{ fontSize: 60, color: 'white' }} />
                          </Box>
                        </Box>
                        <CardContent>
                          <Typography variant="caption">
                            {video.type}: {video.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Images */}
            {tmdbData?.images?.backdrops?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Official Images
                </Typography>
                <ImageList cols={3} gap={8}>
                  {tmdbData.images.backdrops.map((image) => (
                    <ImageListItem 
                      key={image.file_path}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { 
                          transform: 'scale(1.05)',
                          transition: 'transform 0.2s'
                        }
                      }}
                      onClick={() => setSelectedImage(image.file_path)}
                    >
                      <img
                        src={getImageUrl(image.file_path, 'w500')}
                        alt={movie.title}
                        loading="lazy"
                        style={{ borderRadius: 4 }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}
          </Grid>

          {/* Right Column - Additional Info & Actions */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.default' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MovieIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Movie Details</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {/* Movie Stats/Info */}
              <Box sx={{ mb: 3 }}>
                <Chip 
                  label={`Released: ${movie.year}`} 
                  sx={{ mb: 1, mr: 1 }} 
                />
                <Chip 
                  label={movie.genre} 
                  color="primary" 
                  sx={{ mb: 1 }} 
                />
                {tmdbData?.runtime && (
                  <Chip 
                    label={`${tmdbData.runtime} mins`}
                    sx={{ mb: 1, mr: 1 }}
                  />
                )}
              </Box>

              {/* TMDb Additional Info */}
              {tmdbData && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Additional Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {tmdbData.budget > 0 && (
                      <Typography variant="body2">
                        Budget: ${(tmdbData.budget / 1000000).toFixed(1)}M
                      </Typography>
                    )}
                    {tmdbData.revenue > 0 && (
                      <Typography variant="body2">
                        Revenue: ${(tmdbData.revenue / 1000000).toFixed(1)}M
                      </Typography>
                    )}
                    {tmdbData.production_countries?.length > 0 && (
                      <Typography variant="body2">
                        Country: {tmdbData.production_countries.map(c => c.name).join(', ')}
                      </Typography>
                    )}
                  </Box>
                </>
              )}

              {/* Actions */}
              {isAuthenticated && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    fullWidth
                    onClick={() => navigate(`/edit-movie/${movie.id}`)}
                    sx={{ mb: 1 }}
                  >
                    Edit Movie
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Modals */}
      <VideoModal 
        open={!!selectedVideo}
        handleClose={() => setSelectedVideo(null)}
        videoKey={selectedVideo}
        title={movie.title}
      />

      <ImageModal
        open={!!selectedImage}
        handleClose={() => setSelectedImage(null)}
        imageUrl={selectedImage ? getImageUrl(selectedImage, 'original') : ''}
        title={movie.title}
      />
    </Container>
  );
};

export default MovieDetails; 