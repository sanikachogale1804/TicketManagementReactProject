import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode"; // ✅ JWT decode ke liye import
import "../CSS/LoginPage.css";
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
        console.log("🔹 JWT Token:", token);
        console.log("🔍 Decoded Token:", decodedToken);

        // ✅ Check if Token is expired
        const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
        if (decodedToken.exp < currentTime) {
          console.log("❌ Token Expired! Logging out...");
          handleLogout();
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("❌ Invalid Token!", error);
        handleLogout();
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const credentials = { userName, userPassword };
  
    try {
      const token = await loginUser(credentials);
      console.log("🔹 API Raw Response (Token Only):", token);
  
      if (!token) {
        throw new Error("❌ No token received from server!");
      }
  
      // ✅ Store JWT Token in Local Storage
      localStorage.setItem("token", token);
  
      // ✅ Decode JWT Token
      const decodedToken = jwtDecode(token);
      console.log("🔍 Decoded Token:", decodedToken);
  
      // ✅ Store User Info
      localStorage.setItem("userName", decodedToken.sub);
  
      // ✅ Extract & Store Roles
      // const userRole = decodedToken.roles || "UNKNOWN";  // Agar `roles` field nahi mili to "UNKNOWN" set karo
      // localStorage.setItem("userRole", userRole);
      if (decodedToken.id) {
        localStorage.setItem("userId", decodedToken.id);  // ✅ FIXED: Store `userId`
      } else {
        console.warn("⚠️ User ID not found in JWT Token!");
      }

      let userRole = decodedToken.roles;
      if (typeof userRole === "string") {
        userRole = userRole.split(","); // ✅ Ensure roles are in array format
      }
      localStorage.setItem("userRole", userRole[0]); // ✅ Store first role (if multiple)
  
      // ✅ Navigate Based on Role
      if (userRole.includes("ADMIN")) {
        navigate("/adminPanel");
      } else if(userRole.includes("CUSTOMER"))
      {
        navigate("/customerInterface")
      }
      else {
        navigate("/LoginUserDashboard");
      }
  
    } catch (error) {
      console.error("❌ Login Error:", error);
      setErrorMessage("Invalid credentials. Please try again.");
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId"); // ✅ Remove userId on logout
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setLogoutMessage("You have been logged out successfully!");
    setUserName("");
    setUserPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="login-container">
      {!isLoggedIn ? (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>UserName:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>
            <button type="submit">Login</button>
          </form>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </>
      ) : (
        <>
          <h2>Welcome, {localStorage.getItem("userName")}! 👋</h2>
          <p>Your Role: <strong>{localStorage.getItem("userRole")}</strong></p>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}

      {logoutMessage && <p className="success-message">{logoutMessage}</p>}
    </div>
  );
};

export default LoginPage;
