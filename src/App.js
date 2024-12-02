import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainNavigation from "./MainNavigation";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";

const App = () => {
  return (
      <Router>
        <MainNavigation />
        <main>
          <Routes>
            <Route path="/" element={<h1>Welcome to the App</h1>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </Router>
  );
};

export default App;
