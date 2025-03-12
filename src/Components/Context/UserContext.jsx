import React, { createContext, useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';  // Correct default import for jwt-decode

// Create the UserContext
const UserContext = createContext();

// Custom hook to access the user context
export const useUser = () => {
  return useContext(UserContext);
};

// UserProvider component to manage the user state
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);  // Decode the JWT token using jwtDecode function
        setUser(decoded);  // Set the user data
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser(null);  // In case the token is invalid
      }
    }
  }, []);  // Run once on component mount

  // Login function
  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);  // Decode and set user data
    setUser(decoded);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);  // Clear the user data
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
