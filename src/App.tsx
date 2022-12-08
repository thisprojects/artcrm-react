import "./App.css";
import React from "react";
import Dashboard from "./Pages/Dashboard";
import NavBar from "./Components/NavBar";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Dashboard />
    </div>
  );
}

export default App;
