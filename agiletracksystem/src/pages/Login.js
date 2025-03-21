import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => {
    if (!email.includes("@")) {
      setEmailError("Invalid email. Must contain '@'");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must have 1 uppercase, 1 number, and 8+ characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateEmail(email) || !validatePassword(password)) return;

    try {
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();

      const user = users.find(
        (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
      );

      if (user) {
        if (user.password === password) {
          console.log("Login Successful!");
          setSuccessMessage("Login Successful");
          localStorage.setItem("userId", user.id);
          localStorage.setItem("role", user.role); // Store user role

          navigate("/dashboard", { replace: true });
        } else {
          setLoginError("Invalid email or password");
        }
      } else {
        setLoginError("User not found");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoginError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h1>Login</h1>
        {successMessage && <p className="success">{successMessage}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validateEmail(email)}
          className="login-input"
        />
        {emailError && <p className="error">{emailError}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => validatePassword(password)}
          className="login-input"
        />
        {passwordError && <p className="error">{passwordError}</p>}
        {loginError && <p className="error">{loginError}</p>}

        <button onClick={handleLogin} className="login-button">
          Login
        </button>
        <p>
          Don't have an account?{" "}
          <button onClick={() => navigate("/signup")} className="signup-button">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
