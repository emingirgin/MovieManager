import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Container,
  IconButton
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo and Brand */}
          <MovieIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            MOVIEDB
          </Typography>

          {/* Mobile Logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}>
            <MovieIcon />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MOVIEDB
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            justifyContent: 'center',
            gap: 2
          }}>
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              component={Link}
              to="/"
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Home
            </Button>

            <Button
              color="inherit"
              startIcon={<AddIcon />}
              component={Link}
              to="/add-movie"
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Add Movie
            </Button>

            <Button
              color="inherit"
              startIcon={<NewReleasesIcon />}
              component={Link}
              to="/new-releases"
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              New Releases
            </Button>

            <Button
              color="inherit"
              startIcon={<SearchIcon />}
              component={Link}
              to="/search"
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Search Movies
            </Button>
          </Box>

          {/* Mobile Navigation Icons */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/')}
            >
              <HomeIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => navigate('/add-movie')}
            >
              <AddIcon />
            </IconButton>
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <Button
                color="inherit"
                onClick={logout}
                sx={{ ml: 2 }}
              >
                Logout
              </Button>
            ) : (
              <Button
                color="inherit"
                startIcon={<LoginIcon />}
                component={Link}
                to="/login"
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 