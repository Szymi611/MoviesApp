import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalMovies, setTotalMovies] = useState();
  const [sort, setSort] = useState(null);
  const [order, setOrder] = useState("asc");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  

  const totalPages = Math.ceil(totalMovies / pageSize);
  const options = ["Sort A-Z", "Sort Z-A"];

  const navigate = useNavigate();

  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClick = (option) => {
    if (option === "Sort A-Z") {
      setSort("title");
      setOrder("asc");
    } else if (option === "Sort Z-A") {
      setSort("title");
      setOrder("desc");
    } else {
      setSort(null);
      setOrder("asc");
    }

    setIsOpen(false);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let url = `http://localhost:5000/movies?page=${page}&pageSize=${pageSize}`;

        if (sort) {
          url += `&sort=${sort}&order=${order}`;
        }

        if (search) {
          url += `&search=${search}`;
        }

        console.log(url);

        const response = await fetch(url);

        if (!response.ok) {
          console.error("Error fetching movies");
        }

        const data = await response.json();
        setMovies(data.movies);
        setTotalMovies(data.totalMovies);
        console.log("fetching finished");
      } catch (err) {
        console.error(`Error fetching movies ${err}`);
      }
    };
    fetchMovies();
  }, [page, pageSize, sort, order, search, isDeleted]);

  console.log(movies);

  const deleteMovie = async (id) => {
    console.log("Delete button clicked");
    try {
      const response = await fetch(`http://localhost:5000/deleteMovie`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        console.error("Response error");
      }

      const data = await response.json();
      setIsDeleted(true);
      alert("Successfully deleted an object");
    } catch (err) {
      console.error("Error deleting movie", err);
    }
  };
  const handleEditClick = (id) => {
    navigate(`/editMovie/${id}`);
  };


  return (
    <>
      <Navbar />
      {/* Top */}
      <div className="">
        <h1 className="text-2xl flex justify-center p-2"></h1>
        <div className="flex justify-center items-center">
          <form className="flex">
            <label htmlFor="input"></label>
            <input
              type="text"
              className="w-[15rem] mr-2 bg-gray-300 rounded-lg"
              value={search}
              onChange={handleInput}
            />
            <button className="cursor-pointer text-white" type="button">
              <IoSearch className="text-xl text-white mr-2 hover:text-gray-400" />
            </button>
          </form>
          <div className="relative inline-block w-[10rem] mx-8">
            <button onClick={toggleDropdown} className="cursor-pointer text-white hover:text-gray-400 hover:text-md">
              {sort
                ? order === "asc"
                  ? "Sort A-Z"
                  : "Sort Z-A"
                : "Select an option"}
            </button>
            {isOpen && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-md z-50">
                {options.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleClick(option)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-300 transition-colors"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Movies */}
        <ul className="flex flex-wrap justify-center gap-6">
          {/* SETTIMOUT po to zeby jak za długo sie ładuja dac info ze nie ma takich w bazie */}
          {!movies.length && <p>Loading... Soon you will see movies</p>}
          {movies.map((movie) => (
            <li key={movie.imdbID} className="m-4 bg-gray-300/90 rounded-lg">
              <div className="w-[17rem] h-[30rem] ">
                <div className="grid justify-center items-center">
                  <div className="flex justify-center items-center">
                    <h2 className="text-lg">{movie.title}</h2>
                    <p className="pl-2">{movie.year}</p>
                  </div>
                  <img
                    className="w-[15rem] h-[20rem] justify-center flex items-center"
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
                  <p className="text-center italic">IMDB Rating: {movie.imdbRating}</p>
                  <div className="flex justify-around items-center">
                    <div className="flex items-center m-2">
                      <FaPencil />
                      <button
                        className="cursor-pointer"
                        onClick={() => handleEditClick(movie._id)}
                      >
                        EDIT
                      </button>
                    </div>

                    <div className="flex items-center">
                      <RiDeleteBin2Line />
                      <button
                        className="cursor-pointer"
                        onClick={() => deleteMovie(movie._id)}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Paginacja */}
        <div className="flex justify-center items-center mt-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="cursor-pointer hover:text-slate-600 text-white"
          >
            Previous
          </button>
          <span className="m-2 text-white">
            {" "}
            {page} of {totalPages}{" "}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="cursor-pointer text-white hover:text-slate-400"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
