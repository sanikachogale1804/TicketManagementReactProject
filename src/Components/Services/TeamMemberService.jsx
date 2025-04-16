import axios from 'axios';

// Make sure to configure axios base URL for your API if not already set up
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',  // Adjust the base URL as needed
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