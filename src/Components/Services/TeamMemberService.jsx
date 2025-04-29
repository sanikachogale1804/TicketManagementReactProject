import axios from 'axios';

// Dynamic base URL: works for both localhost and IP
const baseURL = window.location.hostname === "localhost"
  ? 'http://localhost:8080'
  : 'http://192.168.1.102:8080';

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
