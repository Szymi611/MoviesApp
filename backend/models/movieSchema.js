const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: { type: String, required: true },
  year: { type: Number },
  genre: { type: String },
  imdbID: { type: String, unique: true },
  poster: { type: String },
  isAvailable: { type: Boolean, default: true },
  released: { type: Date }, 
  imdbRating: { type: Number },
})

module.exports = mongoose.model('Movie', movieSchema, 'Movies')