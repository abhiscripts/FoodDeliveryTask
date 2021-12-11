import "../App.css";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import UserHome from "./UserHome";
import MainHeader from "./MainHeader";
import AdminHome from "./AdminHome";
import AdminLogin from "./AdminLogin";

function App() {
  return (
    <div className="App">
      <MainHeader />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userhome" element={<UserHome />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
