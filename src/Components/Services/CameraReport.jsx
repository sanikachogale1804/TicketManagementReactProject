import axios from 'axios';

const BASE_URL = "http://localhost:8080"; // 🔁 Update this for production or Netlify

export const fetchCameraReports = async () => {
  const response = await axios.get(`${BASE_URL}/camera-reports`);
  return response.data;
};

export const fetchStorageInfo = async () => {
    const response = await axios.get(`${BASE_URL}/camera-reports/storage-info`);
    return response.data;
  };