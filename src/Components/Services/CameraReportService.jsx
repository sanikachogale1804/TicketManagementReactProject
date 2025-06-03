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

export const addNewSite = async (siteData) => {
  try {
    const response = await fetch("http://localhost:8080/siteMasterData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(siteData),
    });

    if (!response.ok) {
      throw new Error("Failed to add new site");
    }

    const addedSite = await response.json();
    return addedSite; // Return the added site data
  } catch (error) {
    console.error("Error adding new site:", error);
    throw error; // Rethrow error for handling in the component
  }
};

export const addCameraReport = async (report) => {
  const response = await fetch("http://localhost:8080/camera-reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });
  if (!response.ok) {
    throw new Error("Failed to add camera report");
  }
};


