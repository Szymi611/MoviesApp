import AddMovie from "./components/AddMovie";
import Movies from "./components/Movies";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/addMovie" element={<AddMovie />} />
        <Route path='/' element={<Movies />}/>
      </Routes>
    </>
  );
}

export default App;
