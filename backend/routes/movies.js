const express = require('express')

const moviesController = require('../controllers/moviesController');

const router = express.Router();

router.get('/getMoviesToDB', moviesController.getAndSaveMovies)

router.get('/movies', moviesController.fetchMovies)

router.post('/addMovie', moviesController.addMovie)

router.post('/deleteMovie', moviesController.deleteMovie)

router.get('/editMovie/:id', moviesController.getMovie)
router.put('/editMovie/:id', moviesController.editMovie)

module.exports = router;