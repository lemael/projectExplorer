import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Exemple from "./Exemple";
import PostCardDemo from "./PostcardDemo";
import Postkarte from "./Postkarte";
import LayerContainer from "./components/LayerContainer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Postkarte />} />
        <Route path="/postcard-demo" element={<PostCardDemo />} />
        <Route path="/exemple" element={<Exemple />} />
        <Route path="/postcard" element={<LayerContainer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
