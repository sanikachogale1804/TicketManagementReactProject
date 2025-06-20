import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../CSS/TeamMemberDashboard.css'
import { addCommentToTicket, createComment } from "../Services/TicketService";


const TeamMemberDashboard = () => {
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [assignedTickets, setAssignedTickets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketComments, setTicketComments] = useState({});

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    // ✅ Dynamic base URL logic
    const baseURL = window.location.hostname === "localhost"
        ? "https://localhost:9080"
        : "https://192.168.1.102:9080";

    useEffect(() => {
        const storedUserName = localStorage.getItem("userName");
        const storedUserRole = localStorage.getItem("userRole");

        if (storedUserName) setUserName(storedUserName);
        if (storedUserRole) setUserRole(storedUserRole);

        if (!userId) {
            setError("❌ User ID not found in localStorage.");
            setLoading(false);
            return;
        }

        const fetchAssignedTickets = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("❌ Authorization token missing.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${baseURL}/users/${userId}/assignedTickets`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`❌ HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const tickets = data._embedded?.tickets || [];
                setAssignedTickets(tickets);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedTickets();
    }, [userId]);

    const handleAddComment = async (ticket) => {
        const token = localStorage.getItem("token");
        const ticketId = ticket._links?.self?.href.split("/").pop();

        if (!ticketId || !ticketComments[ticketId]) {
            alert("❌ Please enter a comment before submitting.");
            return;
        }

        try {
            const commentPayload = {
                userId: { userId: Number(userId) },
                comment: ticketComments[ticketId],
                createdAt: new Date().toISOString(),
            };

            // ✅ Step 1: Create comment
            const newComment = await createComment(ticketId, commentPayload, token);
            console.log("✅ Comment Created:", newComment);

            // ✅ Step 2: Extract comment ID from _links.self.href
            const commentId = newComment._links?.self?.href?.split("/").pop();

            if (!commentId) {
                throw new Error("❌ Failed to extract comment ID from response.");
            }

            // ✅ Step 3: Assign comment to ticket
            await addCommentToTicket(commentId, ticketId);

            alert("✅ Comment added and ticket assigned successfully!");
            setTicketComments((prev) => ({ ...prev, [ticketId]: "" }));
        } catch (error) {
            console.error("❌ Error adding comment:", error);
            alert("❌ Failed to add comment.");
        }
    };    

    const handleCommentChange = (ticketId, value) => {
        setTicketComments((prevComments) => ({
            ...prevComments,
            [ticketId]: value,
        }));
    };


    return (
        <div>
            <div className="header-container">
                <h1><span className="emoji"></span> Welcome, {userName}! <span className="emoji"></span></h1>
                <h3>Your Role: {userRole}</h3>
            </div>

            {loading && <p>⏳ Loading tickets...</p>}
            {error && <p className="error">❌ Error: {error}</p>}

            {!loading && !error && assignedTickets.length > 0 ? (
                <div className="ticket-list-container">
                    <table className="ticket-table">
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>Site ID</th>
                                <th>IASSP Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Add Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignedTickets.map((ticket) => {
                                const ticketId = ticket._links?.self?.href.split("/").pop();  // Extract ticket ID

                                return (
                                    <tr key={ticketId}>
                                        <td className="ticket-id">{ticketId}</td>
                                        <td>{ticket.siteID}</td>  {/* Display Site ID */}
                                        <td>{ticket.iasspname}</td>  {/* Display IASSP Name */}
                                        <td>{ticket.description}</td>
                                        <td
                                            className={`status-${ticket.status?.toLowerCase() || "unknown"}`}
                                        >
                                            {ticket.status || "Unknown"}
                                        </td>
                                        <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                                        <td>
                                            <div className="input-container">
                                                <textarea
                                                    value={ticketComments[ticketId] || ""}
                                                    onChange={(e) => handleCommentChange(ticketId, e.target.value)}
                                                />
                                                <button onClick={() => handleAddComment(ticket)}>Add</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>❌ No tickets assigned to you.</p>
            )}

            <div className="logout-button-container">
                <button className="logout-button" onClick={() => {
                    localStorage.clear();
                    navigate("/loginPage");
                }}>
                    Logout
                </button>
            </div>

        </div>
    );
};

export default TeamMemberDashboard;
