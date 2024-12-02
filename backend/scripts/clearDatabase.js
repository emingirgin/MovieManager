require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Director = require('../models/Director');
const User = require('../models/User');

async function clearDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Clear all collections
    await Movie.deleteMany({});
    console.log('Cleared all movies');
    
    await Director.deleteMany({});
    console.log('Cleared all directors');
    
    await User.deleteMany({});
    console.log('Cleared all users');

    console.log('Database cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase(); 