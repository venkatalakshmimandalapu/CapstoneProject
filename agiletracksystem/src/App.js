import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "../src/pages/Welcome";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import UserProfile from "../src/pages/UserProfile";
import Dashboard from "../src/pages/Dashboard";

// const ProtectedRoute = ({ element, allowedRoles }) => {
//   const role = localStorage.getItem("role");
//   return allowedRoles.includes(role) ? element : <Navigate to="/login" replace />;
// };

function App() {
  return (
    <div className="app-container">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userprofiles" element={<UserProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
