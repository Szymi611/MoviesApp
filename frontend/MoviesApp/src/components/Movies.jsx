import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalMovies, setTotalMovies] = useState();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/movies?page=${page}&pageSize=${pageSize}`
        );

        if (!response.ok) {
          console.error("Error fetching movies");
        }

        const data = await response.json();
        setMovies(data.movies);
        setTotalMovies(data.totalMovies);
      } catch (err) {
        console.error(`Error fetching movies ${err}`);
      }
    };
    fetchMovies();
  }, [page, pageSize]);

  const totalPages = Math.ceil(totalMovies / pageSize);

  return (
    <>
      <div className="bg-slate-400">
        <h1 className="text-2xl flex justify-center p-6">Movies</h1>
        <div className="flex justify-center items-center">
          <label htmlFor="search"><IoSearch className="text-xl"/></label>
          <input type="text" className="w-[20rem]" />
        </div>

        <ul className="flex flex-wrap justify-center gap-6">
          {!movies.length && <p>Loading... Soon you will see movies</p>}
          {movies.map((movie) => (
            <li key={movie.imdbID} className="m-4">
              <div className="w-[15rem] h-[28rem]">
                <div className="flex">
                  <h2>{movie.title}</h2>
                  <p className="pl-2">{movie.year}</p>
                </div>
                <img
                  className="w-[15rem] h-[20rem]"
                  src={movie.poster}
                  alt={`Poster of ${movie.title} movie`}
                />
                <p className="text-sm italic">{movie.genre}</p>
                <p>
                  Date of released:{" "}
                  {new Date(movie.released).toLocaleDateString("pl-PL", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </p>
                <p className="text-center ">{movie.imdbRating}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Paginacja */}
        <div className="flex justify-center items-center mt-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="cursor-pointer hover:text-slate-400"
          >
            Previous
          </button>
          <span className="m-2">
            {" "}
            {page} of {totalPages}{" "}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="cursor-pointer hover:text-slate-400"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
