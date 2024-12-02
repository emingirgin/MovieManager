const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Movie = require('../models/Movie');
const User = require('../models/User');
const mongoose = require('mongoose');

const resolvers = {
  Query: {
    movies: async () => {
      try {
        const movies = await Movie.find();
        return movies.map(movie => ({
          ...movie.toObject(),
          id: movie._id.toString()
        }));
      } catch (error) {
        console.error('Error fetching movies:', error);
        throw new Error('Failed to fetch movies');
      }
    },
    movie: async (_, { id }) => {
      try {
        const movie = await Movie.findById(id);
        if (!movie) return null;
        
        return {
          ...movie.toObject(),
          id: movie._id.toString()
        };
      } catch (error) {
        console.error('Error fetching movie:', error);
        throw new Error('Failed to fetch movie');
      }
    },
    moviesByGenre: async (_, { genre }) => {
      return await Movie.find({ genre });
    },
    me: (_, __, { user }) => user,
    checkMovie: async (_, { imdbId }) => {
      const movie = await Movie.findOne({ imdbId });
      return !!movie;
    }
  },

  Movie: {
    id: (movie) => movie._id.toString()
  },

  Mutation: {
    createMovie: async (_, { title, imdbId, genre, year, director }) => {
      try {
        // Check if movie already exists
        const existingMovie = await Movie.findOne({ imdbId });
        if (existingMovie) {
          throw new Error('Movie already exists in the database');
        }

        // Create movie
        const movie = new Movie({
          title,
          imdbId,
          genre,
          year,
          director
        });

        const savedMovie = await movie.save();
        
        return {
          ...savedMovie.toObject(),
          id: savedMovie._id.toString()
        };
      } catch (error) {
        console.error('Error creating movie:', error);
        throw new Error(`Failed to create movie: ${error.message}`);
      }
    },

    updateMovie: async (_, { id, ...args }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      
      try {
        const updatedMovie = await Movie.findByIdAndUpdate(
          id,
          { ...args },
          { new: true }
        );

        if (!updatedMovie) {
          throw new Error('Movie not found');
        }

        return {
          ...updatedMovie.toObject(),
          id: updatedMovie._id.toString()
        };
      } catch (error) {
        console.error('Error updating movie:', error);
        throw new Error(`Failed to update movie: ${error.message}`);
      }
    },

    deleteMovie: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const result = await Movie.findByIdAndDelete(id);
      return !!result;
    },

    // Auth mutations
    signup: async (_, { name, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      const user = await User.create({ name, email, password });
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('No user found with this email');
      }

      const valid = await user.comparePassword(password);
      if (!valid) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      };
    }
  }
};

module.exports = resolvers; 