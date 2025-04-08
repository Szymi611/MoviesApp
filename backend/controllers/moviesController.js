const Movie = require('../models/movieSchema');
const API_KEY = process.env.API_KEY;

exports.getAndSaveMovies = async (req, res, next) => {
  try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=good`);
      const data = await response.json();

      if(!response.ok){
        console.error('Bad response')
      }

      for (const movie of data.Search) {

        const detailsRes = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
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
            released: details.Released !== "N/A" ? new Date(details.Released) : null,
            imdbRating: details.imdbRating !== "N/A" ? parseFloat(details.imdbRating) : null,
          });

          await newMovie.save();
        }
      }

    res.status(200).json({ message: `Pobrano i zapisano.` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Wystąpił błąd podczas zapisu filmów' });
  }
};

exports.fetchMovies = async (req, res, next) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12
    const skip = (page - 1) * pageSize //ile pominiemy. Po to zeby wyswietlic druga strone np i filmy dla niej
    
    const movies = await Movie.find().skip(skip).limit(pageSize).exec();

    const totalMovies = await Movie.countDocuments();

    res.json({
      page,
      pageSize,
      totalMovies,
      movies,
    })

  }catch(error){
    res.status(500).json({ error: error.message });
  }
}
