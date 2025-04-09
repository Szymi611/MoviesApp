import AddMovie from "./components/AddMovie";
import EditMovie from "./components/EditMovie";
import Movies from "./components/Movies";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/addMovie" element={<AddMovie />} />
        <Route path='/' element={<Movies />}/>
        <Route path="/editMovie/:id" element={<EditMovie />} />
      </Routes>
    </>
  );
}

export default App;
