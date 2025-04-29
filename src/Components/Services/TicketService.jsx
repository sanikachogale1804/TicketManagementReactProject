import axios from "axios";

const BACKEND_IP = "192.168.1.102:8080";
const LOCALHOST = "localhost:8080";

const BASE_URL = window.location.hostname === "localhost"
  ? `http://${LOCALHOST}`
  : `http://${BACKEND_IP}`;

const API_LINK = `${BASE_URL}/tickets`;



const getAuthToken = () => {
  return localStorage.getItem('token');
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      alert("Session expired, please log in again.");
      localStorage.removeItem('token');
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getUsers = () => {
  return fetch(`${BASE_URL}/users`)
    .then((response) => response.json())
    .then(data => data);
};

export const registerUser = (user) => {
  return fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error('Registration failed');
      }
    })
    .catch((error) => {
      console.error('Error registering user:', error);
      throw error;
    });
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      credentials,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = "/login";
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const getTickets = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tickets`, {
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
    return [];
  }
};

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

export const createTicket = async (ticketData) => {
  try {
    const response = await axios.post(`${BASE_URL}/tickets`, ticketData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw new Error('Ticket with the same Site ID and Description already exists.');
    } else {
      throw new Error('Error creating ticket: ' + error.message);
    }
  }
};

export const updateTicket = async (ticketId, updatedTicket) => {
  try {
    const response = await axiosInstance.put(`/tickets/${ticketId}`, updatedTicket);
    return response.data;
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

export const createComment = async (ticketId, commentPayload, token) => {
  const response = await axios.post(
    `${BASE_URL}/comments`,
    commentPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const addCommentToTicket = async (commentId, ticketId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/comments/${commentId}/ticket`,
      `${BASE_URL}/tickets/${ticketId}`,
      {
        headers: {
          "Content-Type": "text/uri-list",
        },
      }
    );
    console.log("✅ Ticket assigned successfully:", response.status);
  } catch (error) {
    console.error("❌ Error assigning ticket:", error.response?.data || error);
  }
};

export const getTeamMembers = async () => {
  try {
    const response = await axiosInstance.get("/users");
    const teamMembers = response.data._embedded?.users || [];
    return teamMembers.filter(user => user.role === "TEAMMEMBER");
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
};

export const assignTicketToTeamMember = async (ticketId, teamMemberUrl) => {
  console.log(`📌 Assigning Ticket ID: ${ticketId} to ${teamMemberUrl}`);

  try {
    const response = await axiosInstance.put(
      `/tickets/${ticketId}/assignedTo`,
      teamMemberUrl,
      {
        headers: {
          "Content-Type": "text/uri-list",
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

export const getTicketsByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/tickets?assignedTo=${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching tickets by user:", error);
    return [];
  }
};

export const updateTicketStatus = async (ticketId, newStatus) => {
  try {
    if (!ticketId) {
      throw new Error("Ticket ID is missing!");
    }

    const ticketResponse = await axios.get(`${BASE_URL}/tickets/${ticketId}`);
    const existingTicket = ticketResponse.data;

    if (!existingTicket.createdAt) {
      throw new Error("Missing createdAt field in existing ticket data!");
    }

    const updatedAt = new Date().toISOString(); // 🕒 Current timestamp

    const response = await axios.put(`${BASE_URL}/tickets/${ticketId}`, {
      ticketId: existingTicket.ticketId, // 🆔 ID ensure karo
      iasspname: existingTicket.iasspname,
      siteID: existingTicket.siteID,
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
  const data = await getTickets();
  const formattedTickets = data._embedded?.tickets.map(ticket => ({
    ...ticket,
    ticket_id: ticket._links?.self?.href.split("/").pop()
  })) || [];

  console.log("✅ Tickets with extracted IDs:", formattedTickets);
  return formattedTickets;
};

export const getAssignedTickets = async (userId) => {
  try {
    const response = await axiosInstance.get(`/tickets/assignedTo/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching assigned tickets:", error);
    return [];
  }
};

export const getCommentsForTicket = async (ticketId, token) => {
  try {
    const response = await fetch(`https://your-api.com/tickets/${ticketId}/comments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`❌ API Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`📌 Comments for Ticket ${ticketId}:`, data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    return [];
  }
};
