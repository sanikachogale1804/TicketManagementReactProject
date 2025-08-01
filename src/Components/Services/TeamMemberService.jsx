import axios from 'axios';

const baseURL = (() => {
  const hostname = window.location.hostname;
  if (hostname === "localhost") return "http://localhost:9080";
  if (hostname === "192.168.1.91") return "http://192.168.1.91:9080";
  return "http://117.250.211.51:9080"; // fallback public IP
})();


const axiosInstance = axios.create({
  baseURL: baseURL,
});

export const getAssignedTickets = async (teamMemberId) => {
  try {
    const response = await axiosInstance.get(`/tickets?assignedTo=${teamMemberId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching assigned tickets:", error);
    return [];
  }
};
