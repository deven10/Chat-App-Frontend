import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./Pages/Home";
import Chats from "./Pages/Chats";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;
