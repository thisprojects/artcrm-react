import './App.css';
import { useState } from 'react';
import NavBar from './Components/NavBar'


function App() {



  // const getTheStuff = async () => {
  //   const response = await fetch('http://localhost:8080/api/v1/contact/getAll').then(r => r.json());
  //   console.log("The result", result);
  //   updateResult(response);
  // }

  return (
    <div className="App">
     <NavBar />
    </div>
  );
}

export default App;
