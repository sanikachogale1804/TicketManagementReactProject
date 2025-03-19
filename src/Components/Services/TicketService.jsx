import axios from "axios";
import { data } from "react-router-dom";

const API_LINK = "http://localhost:8080/tickets";
const BASE_URL = "http://localhost:8080";

export const getTickets = async () => {
  try {
    const response = await fetch(API_LINK);
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error; 
  }
};



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


export const getTicketsByUser = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/tickets?assignedTo=${userId}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching tickets by user:", error);
    throw error;
  }
};


export const updateTicketStatus = async (ticketId, status) => {
  try {
    const response = await axios.put(`${BASE_URL}/tickets/${ticketId}`, {
      status: status, 
    });
    return response.data; 
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
};

export const getTeamMembers = async () => {
  try {
    const response = await fetch("http://localhost:8080/users"); 
    const data = await response.json();

    console.log("Team Members Response: ", data);

    const teamMembers = data._embedded?.users || [];

    const filteredTeamMembers = teamMembers.filter(user => user.role === "TEAMMEMBER");

    return filteredTeamMembers; 
  } catch (error) {
    console.error("Error fetching team members:", error);
    return []; 
  }
};
export const assignTicketToTeamMember = async (ticketId, teamMemberId) => {
  try {
    const response = await axios.post(`${BASE_URL}/tickets/${ticketId}/assignTo`, {
      assignedTo: { id: teamMemberId }, 
    });
    return response.data; 
  } catch (error) {
    console.error("Error assigning ticket to team member:", error);
    throw error; 
  }
};


export const getAssignedTickets = async (userId) => {
  try {
    const response = await axios.get(`/api/tickets/assignedTo/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};
