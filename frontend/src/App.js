import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';

// Apollo Client
import client from './apollo/client';

// Theme
import theme from './styles/theme';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AddMovie from './pages/AddMovie';
import EditMovie from './pages/EditMovie';
import NewReleases from './pages/NewReleases';
import SearchMovies from './pages/SearchMovies';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <AuthProvider>
            <Router>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route
                  path="/add-movie"
                  element={
                    <ProtectedRoute>
                      <AddMovie />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-movie/:id"
                  element={
                    <ProtectedRoute>
                      <EditMovie />
                    </ProtectedRoute>
                  }
                />
                <Route path="/new-releases" element={<NewReleases />} />
                <Route path="/search" element={<SearchMovies />} />
              </Routes>
            </Router>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App; 