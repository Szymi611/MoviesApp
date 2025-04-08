const express = require('express')

const moviesController = require('../controllers/moviesController');

const router = express.Router();

router.get('/getMoviesToDB', moviesController.getAndSaveMovies)

router.get('/movies', moviesController.fetchMovies)

module.exports = router;