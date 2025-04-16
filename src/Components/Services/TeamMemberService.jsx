import axios from 'axios';

// 👇 Dynamically set baseURL based on hostname
const hostname = window.location.hostname;
const baseURL =
  hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://silver-unicorn-fb39cf.netlify.app/';  // <-- replace with actual deployed backend URL

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
