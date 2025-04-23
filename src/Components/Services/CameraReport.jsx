import axios from 'axios';

const BASE_URL = "http://localhost:8080"; // 🔁 Update this for production or Netlify

export const fetchCameraReports = async () => {
  try {
    const response = await fetch(`${BASE_URL}/camera-reports`);
    const data = await response.json();
    return data; // Ensure you return the complete response object
  } catch (error) {
    console.error("Error fetching camera reports:", error);
    throw error;
  }
};


export const fetchStorageInfo = async () => {
    const response = await axios.get(`${BASE_URL}/camera-reports/storage-info`);
    return response.data;
  };