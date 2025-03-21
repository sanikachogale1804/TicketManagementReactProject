import axios from 'axios';

// Base URL for your backend API
const BASE_URL = "http://localhost:8080"; // Adjust as needed
const API_LINK = "http://localhost:8080/tickets";

// Get JWT token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token'); // Assuming token is saved here
};

// Axios instance with JWT token in headers
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`, // Add token to request headers
  },
});

// Axios request interceptor to handle expired tokens
axiosInstance.interceptors.response.use(
  response => response, // If the response is successful, return the response
  async (error) => {
    // If the token is expired (401 Unauthorized), handle the error
    if (error.response && error.response.status === 401) {
      alert("Session expired, please log in again.");
      localStorage.removeItem('token'); // Remove expired token
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error); // Return the error to be handled elsewhere
  }
);

// API Calls

// Service function to fetch tickets

 export const getTickets=()=>{
   return fetch(API_LINK).
   then((data)=>data.json())
   .then(data=>data)
 }

// Add a new Ticket
export const addTicket = async (ticket) => {
  try {
    const response = await axiosInstance.post("/tickets", ticket);
    return response.data; // Return the added ticket
  } catch (error) {
    console.error("Error adding ticket:", error);
    throw error;
  }
};

// Update Ticket
export const updateTicket = async (ticketId, updatedTicket) => {
  try {
    const response = await axiosInstance.put(`/tickets/${ticketId}`, updatedTicket);
    return response.data; // Return the updated ticket
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

// Add a comment to a ticket
export const addCommentToTicket = async (ticketId, commentData) => {
  try {
    const response = await axiosInstance.post(`/tickets/${ticketId}/comments`, commentData);
    return response.data; // Return the added comment
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Get Team Members
export const getTeamMembers = async () => {
  try {
    const response = await axiosInstance.get("/users");
    const teamMembers = response.data._embedded?.users || [];
    return teamMembers.filter(user => user.role === "TEAMMEMBER"); // Filter only team members
  } catch (error) {
    console.error("Error fetching team members:", error);
    return []; // Return an empty array in case of error
  }
};

// Assign Ticket to a Team Member
export const assignTicketToTeamMember = async (ticketId, teamMemberId) => {
  try {
    const response = await axiosInstance.post(`/tickets/${ticketId}/assignTo`, {
      assignedTo: { id: teamMemberId },
    });
    return response.data; // Return the updated ticket
  } catch (error) {
    console.error("Error assigning ticket:", error);
    throw error;
  }
};

// Get Tickets assigned to a specific user
export const getTicketsByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/tickets?assignedTo=${userId}`);
    return response.data; // Return the tickets for the specific user
  } catch (error) {
    console.error("Error fetching tickets by user:", error);
    throw error;
  }
};

// Update the status of a ticket
export const updateTicketStatus = async (ticketId, status) => {
  try {
    const response = await axiosInstance.put(`/tickets/${ticketId}`, { status });
    return response.data; // Return the updated ticket status
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
};

// Logout function (optional, if you have a logout button)
export const logout = () => {
  localStorage.removeItem('token'); // Remove token from localStorage
  window.location.href = "/login"; // Redirect to login page
};
