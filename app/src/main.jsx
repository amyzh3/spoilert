import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Home from "./pages/Home"
import { useState } from "react";
import Signup from './pages/Signup'

import "@fontsource/karla/400.css";  
import "@fontsource/karla/500.css";  
import "@fontsource/karla/600.css";  
import "@fontsource/karla/700.css";  
import "@fontsource/karla/800.css";



const App = () => {
  const [user, setUser] = useState("");  // Store username from Login

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
      </Routes>
    </BrowserRouter>
  );
};


createRoot(document.getElementById('root')).render(
    <App />
);
