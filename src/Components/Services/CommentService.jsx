
import axios from "axios";

export const addCommentToTicket = async (ticketId, commentData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("🚨 No token found! User is not logged in.");
      alert("⚠️ Session expired, please log in again.");
      return;
    }

    console.log("🔍 Debug: Token being sent ->", token);

    const response = await axios.post(
      `http://localhost:8080/tickets/${ticketId}/comments`,
      commentData,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Comment Added:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding comment:", error.response?.data || error.message);
    alert("🚨 Failed to add comment: " + (error.response?.data || error.message));
  }
};


// ✅ Function to Get Comments for a Ticket (🔹 FIXED API URL)
export const getCommentsForTicket = async (ticketId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${ticketId}/comments`); // 🔥 Correct API Endpoint
    return response.data; // Assuming API returns an array of comments
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    return [];
  }
};
