import React, { useState } from 'react';
import { loginUser } from './services/UserService';  // Adjust path as needed

const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const user = {
      userName,
      userPassword,
    };

    try {
      const response = await loginUser(user);  // Call the login API
      if (response) {
        // Assuming JWT token is returned on successful login
        localStorage.setItem('token', response);  // Store token in localStorage
        setIsLoggedIn(true);
        setErrorMessage('');
        console.log('Login successful:', response);
      } else {
        setErrorMessage('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="userName">Username:</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="userPassword">Password:</label>
          <input
            type="password"
            id="userPassword"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {isLoggedIn && <p>Successfully logged in!</p>}
    </div>
  );
};

export default LoginPage;
