import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../CSS/LoginPage.css'; // Import the CSS file correctly
import { loginUser } from '../Services/UserService';

const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  const navigate = useNavigate(); // Replace useHistory with useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    const credentials = {
      userName,
      userPassword,
    };

    try {
      const token = await loginUser(credentials);
      console.log('JWT Token:', token);
      // Save token and redirect user if needed
      localStorage.setItem('token', token);  // Optionally store token in localStorage

      // Set success message on successful login
      setSuccessMessage('Successfully logged in!');
      setIsLoggedIn(true); // Update login state

      // Optionally reset the form
      setUserName('');
      setUserPassword('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Login failed! Please try again.');
      console.error('Login failed:', error);
      setSuccessMessage('');  // Clear success message if login fails
    }
  };

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    setIsLoggedIn(false); // Set login state to false

    // Redirect to login page using navigate
    navigate('/login'); // Navigate to the login page
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
          <h2>Welcome!</h2>
          <p>You are logged in.</p>
          <button onClick={handleLogout}>Logout</button> {/* Logout button */}
        </>
      )}
    </div>
  );
};

export default LoginPage;
