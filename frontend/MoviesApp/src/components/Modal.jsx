export default function Modal({ isOpen, onClose, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-80">
      <div className="relative bg-black text-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
        <button
          className="absolute top-0 right-0 p-2 cursor-pointer"
          onClick={onClose}
        >
          <p className="mr-2">X</p>
        </button>
        <h1 className="text-2xl">{title}</h1>
        <p>
          This movie app allows users to manage a collection of movies by
          adding, editing, and removing entries. The app uses MongoDB as the
          database to store movie data, which includes information such as
          title, genre, release year, and IMDb rating. The app fetches movie
          data from an external API, stores it in the database, and allows users
          to view the collection on the frontend. MongoDB is used for persistent
          storage, while API calls handle the data retrieval. The frontend
          dynamically fetches movie data from the backend and displays it to
          users.
          <br />
          Check out my Github:<a href="https://github.com/Szymi611"> <span className="italic text-sm text-blue-500">CLICK HERE</span> </a>
        </p>
      </div>
    </div>
  );
}
