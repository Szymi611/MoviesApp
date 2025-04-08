import { useState } from "react";

export default function AddMovie() {
  const [movieData, setMovieData] = useState({
    title: "",
    year: "",
    genre: "",
    imdbID: "",
    poster: "",
    isAvailable: false,
    released: "",
    imdbRating: "",
  });

  console.log(movieData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMovieData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const movieDataToSend = {
      ...movieData,
      year: parseInt(movieData.year),
      imdbRating: parseFloat(movieData.imdbRating),
      released: new Date(movieData.released),
    };

    try {
      const response = await fetch(`http://localhost:5000/addMovie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieDataToSend),
      });

      if (!response.ok) {
        console.error("Error adding Movie");
      }

      const data = await response.json();
      console.log(data);
      alert("Movie added successfully");
    } catch (err) {
      console.error("Error adding movie", err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-3">
        <input
          name="title"
          value={movieData.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 w-full"
          required
        />
        <input
          name="year"
          value={movieData.year}
          onChange={handleChange}
          placeholder="Year"
          className="border p-2 w-full"
          type="number"
          required
        />
        <input
          name="genre"
          value={movieData.genre}
          onChange={handleChange}
          placeholder="Genre"
          className="border p-2 w-full"
          required
        />
        <input
          name="imdbID"
          value={movieData.imdbID}
          onChange={handleChange}
          placeholder="IMDb ID"
          className="border p-2 w-full"
        />
        <input
          name="poster"
          value={movieData.poster}
          onChange={handleChange}
          placeholder="Poster URL"
          className="border p-2 w-full"
          required
        />
        <input
          name="released"
          value={movieData.released}
          onChange={handleChange}
          placeholder="Release Date"
          className="border p-2 w-full"
          type="date"
          required
        />
        <input
          name="imdbRating"
          value={movieData.imdbRating}
          onChange={handleChange}
          placeholder="IMDb Rating"
          className="border p-2 w-full"
          type="number"
          step="0.1"
          required
          max={10}
          min={0}
        />
        <label className="flex items-center space-x-2">
          <input
            name="isAvailable"
            type="checkbox"
            checked={movieData.isAvailable}
            onChange={handleChange}
          />
          <span>Is Available to watch online?</span>
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Movie
        </button>
      </form>
    </>
  );
}
