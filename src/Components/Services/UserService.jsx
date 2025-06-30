import axios from "axios";

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const Api_link = isLocalhost
  ? `http://localhost:9080`
  : `http://192.168.1.91:9080`;


const API_URL = Api_link; // unify usage

export const getUsers = () => {
  return fetch(Api_link)
    .then((response) => response.json())
    .then(data => data);
};

export const registerUser = (user) => {
  return fetch(`${Api_link}/register`, {
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
    const response = await axios.post(`${Api_link}/login`, credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
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

    const response = await axios.get(`${API_URL}/users`, {
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
