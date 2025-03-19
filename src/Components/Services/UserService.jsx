import axios from "axios";

const Api_link="http://localhost:8080/users"

export const getUsers = () => {
    return fetch(Api_link)
      .then((response) => response.json())
      .then(data=>data);
  };
 
  export const registerUser = (user) => {
    return fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
      credentials: 'include',  // Include cookies in the request (if needed)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          return data; // Return user object or success message if registration is successful
        } else {
          throw new Error('Registration failed');
        }
      })
      .catch((error) => {
        console.error('Error registering user:', error);
        throw error; // Return the error for further handling
      });
  };
  const API_URL = 'http://localhost:8080';  // Update this to point to the backend server URL

  export const loginUser = async (credentials) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/login', 
        credentials, 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;  // Return the response data (JWT token)
    } catch (error) {
      console.error('Login failed:', error);
      throw error;  // Throw the error to handle it in the LoginPage
    }
  };