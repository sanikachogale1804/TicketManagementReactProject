import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import "../CSS/LoginPage.css";
import logo from "../Image/logo.png"; // ✅ Logo image
import { loginUser } from "../Services/UserService";

const LoginPage = () => {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          handleLogout();
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        handleLogout();
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { userName, userPassword };

    try {
      const token = await loginUser(credentials);
      if (!token) throw new Error("No token received!");

      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      localStorage.setItem("userName", decodedToken.sub);
      if (decodedToken.id) {
        localStorage.setItem("userId", decodedToken.id);
      }

      let userRole = decodedToken.roles;
      if (typeof userRole === "string") {
        userRole = userRole.split(",");
      }
      localStorage.setItem("userRole", userRole[0]);

      if (userRole.includes("ADMIN")) navigate("/adminPanel");
      else if (userRole.includes("CUSTOMER")) navigate("/customerInterface");
      else navigate("/TeamMemberDashboard");

    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Invalid credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setLogoutMessage("You have been logged out successfully!");
    setUserName("");
    setUserPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <img src={logo} alt="Logo" className="login-logo" />
        {!isLoggedIn ? (
          <>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>

            {errorMessage && <p className="login-message error">{errorMessage}</p>}
            {successMessage && <p className="login-message success">{successMessage}</p>}

            <p className="register-message">
              Don't have an account?{" "}
              <span className="register-link" onClick={() => navigate("/registerPage")}>
                Register here
              </span>
            </p>
          </>


        ) : (
          <>
            <h2>Welcome, {localStorage.getItem("userName")}!</h2>
            {/* <p>Your Role: <strong>{localStorage.getItem("userRole")}</strong></p> */}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {logoutMessage && <p className="login-message success">{logoutMessage}</p>}
      </div>

      <footer className="login-footer">
        All Rights Reserved Cogent Safety & Security
      </footer>
    </div>
  );
};

export default LoginPage;
