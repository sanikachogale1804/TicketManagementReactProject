import axios from 'axios';

// Dynamic BASE_URL with fallback
const BASE_URL = (() => {
  const hostname = window.location.hostname;
  if (hostname === "localhost") return "http://localhost:9080";
  if (hostname === "192.168.1.91") return "http://192.168.1.91:9080";
  return "http://117.250.211.51:9080"; // fallback public IP
})();

// Fetch all camera reports
export const fetchCameraReports = async () => {
  try {
    const response = await fetch(`${BASE_URL}/camera-reports`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching camera reports:", error);
    throw error;
  }
};

// Fetch storage summary info
export const fetchStorageInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/camera-reports/storage-info`);
    return response.data;
  } catch (error) {
    console.error("Error fetching storage info:", error);
    throw error;
  }
};

// Add a new site
export const addNewSite = async (siteData) => {
  try {
    const response = await fetch(`${BASE_URL}/siteMasterData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(siteData),
    });

    if (!response.ok) {
      throw new Error("Failed to add new site");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding new site:", error);
    throw error;
  }
};

// Add a new camera report
export const addCameraReport = async (report) => {
  try {
    const response = await fetch(`${BASE_URL}/camera-reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });

    if (!response.ok) {
      throw new Error("Failed to add camera report");
    }
  } catch (error) {
    console.error("Error adding camera report:", error);
    throw error;
  }
};
