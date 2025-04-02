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

export const getTickets = async () => {
  try {
    const response = await fetch("http://localhost:8080/tickets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      mode: "cors"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return []; // Return an empty array on failure
  }
};

// Add a new Ticket
export const addTicket = (ticket) => {
  return fetch(API_LINK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  })
    .then((data) => data.json())
    .then((data) => data);
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
export const addCommentToTicket = async (ticketId, commentText) => {
  try {
    const response = await axiosInstance.post(`/tickets/${ticketId}/comments`, {
      comment: commentText
    });
    return response.data;
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
export const assignTicketToTeamMember = async (ticketId, teamMemberUrl) => {
  console.log(`📌 Assigning Ticket ID: ${ticketId} to ${teamMemberUrl}`);

  try {
    const response = await axiosInstance.put(
      `/tickets/${ticketId}/assignedTo`,
      teamMemberUrl, // Sending raw URI
      {
        headers: {
          "Content-Type": "text/uri-list", // Ensuring correct content type
        },
      }
    );

    console.log("✅ Ticket Assigned Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error Assigning Ticket:", error.response?.data || error);
    throw error;
  }
};

// Get Tickets assigned to a specific user
export const getTicketsByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/tickets?assignedTo=${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching tickets by user:", error);
    return [];
  }
};

// const API_URL = "http://localhost:8080/tickets";

export const updateTicketStatus  = async (ticketId, newStatus) => {
  try {
      if (!ticketId) {
          throw new Error("Ticket ID is missing!");
      }

      // ✅ Step 1: Pehle ticket ki current details fetch karo
      const ticketResponse = await axios.get(`http://localhost:8080/tickets/${ticketId}`);
      const existingTicket = ticketResponse.data;

      if (!existingTicket.createdAt) {
          throw new Error("Missing createdAt field in existing ticket data!");
      }

      // ✅ Step 2: Update ke liye required fields send karo
      const updatedAt = new Date().toISOString(); // 🕒 Current timestamp

      const response = await axios.put(`http://localhost:8080/tickets/${ticketId}`, {
          ticketId: existingTicket.ticketId, // 🆔 ID ensure karo
          title: existingTicket.title, // 📝 Title pass karo
          description: existingTicket.description, // 📝 Description bhi bhejo
          status: newStatus, // ✅ Naya status
          createdAt: existingTicket.createdAt, // 🕒 Pehla createdAt send karo
          updatedAt: updatedAt, // 🕒 Naya updatedAt send karo
          assignedTo: existingTicket.assignedTo // 🎯 AssignedTo bhi preserve karo
      });

      return response.data;
  } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      throw error;
  }
};

export const getTicketsWithId = async () => {
  const data = await getTickets(); // Call existing function

  const formattedTickets = data._embedded?.tickets.map(ticket => ({
    ...ticket,
    ticket_id: ticket._links?.self?.href.split("/").pop() // Extract last part (ID)
  })) || [];

  console.log("✅ Tickets with extracted IDs:", formattedTickets);
  return formattedTickets;
};
