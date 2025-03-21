import React from 'react';
import { Link } from 'react-router-dom';
import "./Header.css";

function Header() {
  return (
    <header className="header">  
      <h1 className="header-logo">Agile Track System</h1>
      <nav className="nav-links">  
      
      <Link to="/">Welcome</Link> 
      <Link to="/login">Login</Link>
      <Link to="/signup"> SignUp</Link>
      <Link to="/userprofiles"> Profiles</Link>
       
       
        <Link to="/dashboard">Dashboard</Link> 
       
        <Link to="/welcome"> Logout </Link>
      </nav>
      <div className="menu-icon">☰</div>
    </header>
  );
}

export default Header;
