import React from 'react';
import { Link } from 'react-router-dom';
import "./Welcome.css"; 

function Welcome() {
 

  
 
  return (
    <div className="welcome-container">
      <h1>Welcome to Agile Track System</h1>
      
      <nav className="welcome-nav">
        <Link to="/dashboard">Dashboard</Link>
         | 
        <Link to="/login">Login</Link>
      </nav>

     
      </div>

    
  );
}

export default Welcome;
