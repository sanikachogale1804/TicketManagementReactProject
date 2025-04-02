import axios from "axios";

const BASE_URL = "http://localhost:8080/comments"; // Adjust if needed

// ✅ Function to Add Comment to a Ticket
export const addCommentToTicket = async (ticketId, commentData) => {
  try {
    const response = await axios.post(BASE_URL, commentData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error adding comment:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to Get Comments for a Ticket
export const getCommentsForTicket = async (ticketId) => {
  try {
    const response = await axios.get(`${BASE_URL}?ticketId=${ticketId}`);
    return response.data._embedded?.comments || [];
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    return [];
  }
};
