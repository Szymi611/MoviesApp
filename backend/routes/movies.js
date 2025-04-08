const express = require('express')

const moviesController = require('../controllers/moviesController');

const router = express.Router();

router.get('/getMoviesToDB', moviesController.getAndSaveMovies)

router.get('/movies', moviesController.fetchMovies)

router.post('/addMovie', moviesController.addMovie)

router.post('/deleteMovie', moviesController.deleteMovie)

module.exports = router;