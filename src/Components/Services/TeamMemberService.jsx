import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Adjust as needed
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Get token from localStorage
  },
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