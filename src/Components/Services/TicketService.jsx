import axios from "axios";

// API URL for your ticket-related endpoints
const API_LINK = "http://localhost:8080/tickets";
const BASE_URL = "http://localhost:8080";

// Function to fetch all tickets
export const getTickets = async () => {
  try {
    const response = await fetch(API_LINK);
    const data = await response.json();
    return data; // Returning the whole response data, including tickets
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error; // Throw error if fetching fails
  }
};

// Function to create a new ticket
export const addTickets = (ticket) => {
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

// Function to update a ticket's status and assignee
export const updateTicket = (ticketId, updatedTicket) => {
  return fetch(`${API_LINK}/${ticketId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTicket),
  })
    .then((response) => response.json())
    .then((data) => data);
};

// Function to add a comment to a ticket
export const addCommentToTicket = (ticketId, commentData) => {
  return fetch(`${API_LINK}/${ticketId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  })
    .then((response) => response.json())
    .then((data) => data);
};

// Fetch all tickets assigned to a specific user (team member)
export const getTicketsByUser = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/tickets?assignedTo=${userId}`);
    return response.data; // Return the ticket data
  } catch (error) {
    console.error("Error fetching tickets by user:", error);
    throw error;
  }
};

// Function to update the status of a specific ticket (e.g., closing the ticket)
export const updateTicketStatus = async (ticketId, status) => {
  try {
    const response = await axios.put(`${BASE_URL}/tickets/${ticketId}`, {
      status: status, // Pass the status (e.g., 'CLOSED')
    });
    return response.data; // Return the updated ticket
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
};

export const getTeamMembers = async () => {
  try {
    const response = await fetch("http://localhost:8080/users"); // Use the correct endpoint
    const data = await response.json();

    // Log the response to verify the data structure
    console.log("Team Members Response: ", data);

    // Extract the team members from the '_embedded' object
    const teamMembers = data._embedded?.users || [];

    // Filter out only users with the "TEAMMEMBER" role
    const filteredTeamMembers = teamMembers.filter(user => user.role === "TEAMMEMBER");

    return filteredTeamMembers; // Return only the team members
  } catch (error) {
    console.error("Error fetching team members:", error);
    return []; // Return an empty array in case of an error
  }
};


// Function to assign a ticket to a specific team member
export const assignTicketToTeamMember = async (ticketId, teamMemberId) => {
  try {
    const response = await axios.post(`${BASE_URL}/tickets/${ticketId}/assign`, {
      assignedTo: teamMemberId, // Assign the ticket to the team member
    });
    return response.data; // Return the updated ticket with the assigned team member
  } catch (error) {
    console.error("Error assigning ticket to team member:", error);
    throw error;
  }
};
