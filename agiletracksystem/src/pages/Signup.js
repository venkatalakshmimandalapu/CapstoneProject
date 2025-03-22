import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); 

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");


  const validateEmail = (email) => {
    if (!email.includes("@")) {
      setEmailError("Invalid email. Must contain @");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

 
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must have 1 uppercase, 1 number, and 8+ characters");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const handleSignup = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
  
    if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      try {
       
        const response = await fetch("http://localhost:5000/users");
        const users = await response.json();
  
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
          alert("User with this email already exists!");
          return;
        }
  
      
        const newUser = { id: Date.now(), email, password, role };
  
       
        const res = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
  
        if (res.ok) {
          alert("Signup successful!");
          navigate('/login'); 
        } else {
          alert("Signup failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during signup:", error);
      }
    }
  };
  

  return (
    <div className="signup">
      <div className="signup-container">
        <h1>Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validateEmail(email)}
          className="signup-input"
        />
        {emailError && <p className="error">{emailError}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => validatePassword(password)}
          className="signup-input"
        />
        {passwordError && <p className="error">{passwordError}</p>}

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => validateConfirmPassword(confirmPassword)}
          className="signup-input"
        />
        {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}

       
        <select value={role} onChange={(e) => setRole(e.target.value)} className="signup-select">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select> <br></br>

        <button onClick={handleSignup} className="signup-button">Sign Up</button>
        <p>Already have an account? <br></br>
          <button onClick={() => navigate('/login')} className="login-button">Login</button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
