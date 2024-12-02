require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Director = require('../models/Director');
const movies = require('../data/movieSeeds');

async function seedDatabase() {
  try {
    // Connect to MongoDB with additional options
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await Director.deleteMany({});
    console.log('Cleared existing data');

    // Insert movies and create directors
    for (const movieData of movies) {
      try {
        // Create or find director
        let director = await Director.findOne({ name: movieData.directorName });
        if (!director) {
          director = await Director.create({ name: movieData.directorName });
          console.log(`Created director: ${director.name}`);
        }

        // Create movie with director reference
        const movie = await Movie.create({
          title: movieData.title,
          year: movieData.year,
          genre: movieData.genre,
          director: director._id,
          rating: movieData.rating,
          plot: movieData.plot
        });
        console.log(`Created movie: ${movie.title}`);
      } catch (error) {
        console.error(`Error creating movie ${movieData.title}:`, error.message);
      }
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.syscall) console.error('System call:', error.syscall);
    if (error.hostname) console.error('Hostname:', error.hostname);
    process.exit(1);
  }
}

// Add event listeners for connection issues
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

seedDatabase(); 