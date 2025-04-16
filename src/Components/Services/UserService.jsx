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


 // Get current user details (role and id)
 export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Assuming you're storing the token in localStorage
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in the header for authentication
      },
    });

    return response.data; // Returns the user data, like { id: 1, role: 'CUSTOMER' }
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error; // Propagate the error
  }
};


export const logout = () => {
  localStorage.removeItem('token'); // Clear the token
  window.location.href = "/login"; // Redirect to the login page
};

// Check if user is authenticated by looking for the token
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};