import React, { useState } from 'react';
import { loginUser } from '../Services/UserService';


const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    } catch (error) {
      setErrorMessage('Login failed! Please try again.');
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
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
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default LoginPage;
