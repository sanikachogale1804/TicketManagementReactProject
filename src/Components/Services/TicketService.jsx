import axios from "axios";

const BACKEND_IP = "192.168.1.91:9080";
const LOCALHOST = "localhost:9080";

const BASE_URL = (() => {
  const hostname = window.location.hostname;
  if (hostname === "localhost") return "http://localhost:9080";
  if (hostname === "192.168.1.91") return "http://192.168.1.91:9080";
  return "http://117.250.211.51:9080"; // fallback public IP
})();

const API_LINK = `${BASE_URL}/tickets`;

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});


axiosInstance.interceptors.request.use(
  config => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
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
    const token = localStorage.getItem('token'); // 🔁 Fix: use correct key
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

// TicketService.jsx

export const getTickets = async () => {
  try {
    // axiosInstance already adds the token from localStorage via interceptor
    const response = await axiosInstance.get("/tickets");

    // Check if data exists
    if (!response.data) {
      console.warn("⚠️ No tickets returned from backend");
      return [];
    }

    console.log("✅ Fetched tickets:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching tickets:",
      error.response?.status,
      error.response?.data || error.message
    );

    // Return empty array to prevent frontend crash
    return [];
  }
};


export const addTicket = (ticket) => {
  const token = localStorage.getItem("token"); // 🔑 get token
  return fetch(API_LINK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // 🔑 send token
    },
    body: JSON.stringify(ticket),
  })
    .then((data) => data.json())
    .then((data) => data);
};


export const createTicket = async (ticketData) => {
  try {
    const token = localStorage.getItem("token"); // 🔑 add this
    const response = await axios.post(`${BASE_URL}/tickets`, ticketData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // 🔑 add this
      },
    });
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

export const createComment = async (commentPayload, closeTicket = false) => {
  const token = localStorage.getItem("token");

  return axios.post(
    `${BASE_URL}/comments?closeTicket=${closeTicket}`, // ✅ true / false
    commentPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
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
      ticketId: existingTicket.ticketId,
      iasspname: existingTicket.iasspname,
      siteID: existingTicket.siteID,
      description: existingTicket.description,
      district: existingTicket.district,
      state: existingTicket.state,
      startDate: existingTicket.startDate,
      endDate: existingTicket.endDate,
      status: newStatus,
      createdAt: existingTicket.createdAt,
      updatedAt: updatedAt,
      assignedTo: existingTicket.assignedTo,
      userId: existingTicket.userId // if exists and needed
    });


    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getTicketsWithId = async () => {
  const data = await getTickets();

  const formattedTickets = (data || []).map(ticket => ({
    ...ticket,
    ticket_id: ticket.id || ticket.ticketId // use the actual field name from backend
  }));

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
    const response = await fetch(`${BASE_URL}/tickets/${ticketId}/comments`, {
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
