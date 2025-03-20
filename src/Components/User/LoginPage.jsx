import React, { useState } from 'react';
import '../CSS/LoginPage.css'; // Import the CSS file correctly
import { loginUser } from '../Services/UserService';

const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

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

  return (
    <div className="login-container">
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
      {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
    </div>
  );
};

export default LoginPage;  