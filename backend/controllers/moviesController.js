const Movie = require("../models/movieSchema");
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const API_KEY = process.env.API_KEY;

exports.getAndSaveMovies = async (req, res, next) => {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=${API_KEY}&s=good`
    );
    const data = await response.json();

    if (!response.ok) {
      console.error("Bad response");
    }

    for (const movie of data.Search) {
      const detailsRes = await fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
      );
      const details = await detailsRes.json();

      const exists = await Movie.findOne({ imdbID: details.imdbID });
      if (!exists) {
        const newMovie = new Movie({
          title: details.Title,
          year: parseInt(details.Year),
          genre: details.Genre,
          imdbID: details.imdbID,
          poster: details.Poster,
          isAvailable: true,
          released:
            details.Released !== "N/A" ? new Date(details.Released) : null,
          imdbRating:
            details.imdbRating !== "N/A"
              ? parseFloat(details.imdbRating)
              : null,
        });

        await newMovie.save();
      }
    }

    res.status(200).json({ message: `Pobrano i zapisano.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd podczas zapisu filmów" });
  }
};

exports.fetchMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    const sort = req.query.sort || null;
    const order = req.query.order === "desc" ? -1 : 1;
    const search = req.query.search || "";
    const skip = (page - 1) * pageSize; //ile pominiemy. Po to zeby wyswietlic druga strone np i filmy dla niej

    const moviesQuery = Movie.find().skip(skip).limit(pageSize);

    if (sort) {
      moviesQuery.sort({ [sort]: order });
    }

    if (search) {
      moviesQuery
        .find({ title: { $regex: search, $options: "i" } })
        .skip()
        .limit(pageSize);
    }

    const movies = await moviesQuery.exec();

    const totalMovies = await Movie.countDocuments();

    res.json({
      page,
      pageSize,
      totalMovies,
      movies,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMovie = async (req, res, next) => {
  try {
    console.log(req.body);
    const movieData = req.body;
    const newMovie = await Movie.create(movieData);
    res
      .status(201)
      .json({ message: "Movie successfully added!", movie: newMovie });
  } catch (err) {
    res.status(400).json({ error: "Error adding movie", details: err.message });
  }
};

exports.getMovie = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.status(200).json(movie);
  } catch (err) {
    res.status(400).json({ error: 'Error fetching movie', details: err.message });
  }
}

exports.editMovie = async (req, res, next) => {
  try{
    const movieID = req.params.id
    const updatedData = req.body;
    console.log(movieID)
    const updatedMovie = await Movie.findByIdAndUpdate(
      movieID,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json(updatedMovie);
  }catch(err){
    res.status(400).json({error: 'Error editing a movie', details: err.message})
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const movieID = req.body.id;
    console.log(movieID)
    const result = await Movie.deleteOne({"_id": new ObjectId(`${movieID}`)})

    if(result.deletedCount > 0){
      res.status(201).json({message: 'Successfully deleted a movie'})
    }else{
      res.status(404).json({error: 'Movie not found'})
    }
  } catch (err) {
    res.status(400).json({ error: "Error deleting movie", details: err.message });
  }
};

