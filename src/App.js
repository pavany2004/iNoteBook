// import "./App.css";
// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   BrowserRouter
// } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./components/Home";
// import About from "./components/About";
// function App() {
//   return (
//     <>
//     <BrowserRouter>
//         <Navbar />
//         <Routes>
//           <Route  path="/" element={<Home />}/>
//           <Route  path="/about" element={ <About />}/>
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;


import About from "./components/About";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useState } from "react";
import axios from 'axios';

function App() {
  const [alert,setAlert]=useState(null);
  const showAlert = (message,type)=>{
    setAlert({
      msg:message,
      type:type
    })
    setTimeout(()=>{
      setAlert(null);
    },1500)
    axios.post('i-note-book-mern-project.vercel.app');
  }
  
  return (
    <>
    <NoteState>
    <BrowserRouter>
    <Navbar />
    <Alert alert={alert}/>
    <div className="container">
        <Routes>
          <Route exact path="/" element={<Home showAlert={showAlert}/>}/>
          <Route exact path="/about" element={ <About />}/>
          <Route exact path="/login" element={ <Login showAlert={showAlert}/>}/>
          <Route exact path="/signup" element= { <Signup showAlert={showAlert}/>}/>
        </Routes>
        </div>
      </BrowserRouter>
      </NoteState>
    </>
  );
}

export default App;
