import axios from "axios";

const isLocalhost = window.location.hostname === 'localhost';
const BASE_URL = isLocalhost ? "http://localhost:8080" : "https://your-deployed-backend-url.com";
const Api_link = `${BASE_URL}/users`;

export const getUsers = () => {
  return fetch(Api_link)
    .then((response) => response.json())
    .then(data => data);
};

export const registerUser = (user) => {
  return fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error('Registration failed');
      }
    })
    .catch((error) => {
      console.error('Error registering user:', error);
      throw error;
    });
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      credentials,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = "/login";
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};