const mongoose = require('mongoose');

const directorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  bio: {
    type: String
  },
  birthDate: {
    type: Date
  }
}, {
  timestamps: true
});

directorSchema.index({ name: 1 });

const Director = mongoose.model('Director', directorSchema);

module.exports = Director; 