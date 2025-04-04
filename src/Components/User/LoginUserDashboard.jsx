import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCommentToTicket } from "../Services/TicketService";

const LoginUserDashboard = () => {
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [assignedTickets, setAssignedTickets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketComments, setTicketComments] = useState({});

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

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

                console.log("📢 Fetching assigned tickets for userId:", userId);

                const response = await fetch(`http://localhost:8080/users/${userId}/assignedTickets`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`❌ HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("✅ API Response:", data);

                // Extract ticket data from the _embedded.tickets array
                const tickets = data._embedded?.tickets || [];
                setAssignedTickets(tickets);
            } catch (error) {
                console.error("❌ Error fetching assigned tickets:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedTickets();
    }, [userId]);

    // Handle Comment Submission
    const handleAddComment = async (ticket) => {
        const token = localStorage.getItem("token");

        const ticketId = ticket._links?.self?.href.split("/").pop();  // Extract ticket ID from the URL

        if (!ticketId || !ticketComments[ticketId]) {
            alert("❌ Please enter a comment before submitting.");
            return;
        }

        try {
            const newComment = {
                ticket: { ticketId: ticketId },
                user: { userId: Number(userId) },
                comment: ticketComments[ticketId],
                createdAt: new Date().toISOString(),
            };

            console.log("📌 Sending Comment Data:", newComment);

            await addCommentToTicket(ticketId, newComment, token);

            alert("✅ Comment added successfully!");

            // Clear the comment for the specific ticket
            setTicketComments((prev) => ({
                ...prev,
                [ticketId]: ""
            }));
        } catch (error) {
            console.error("❌ Error adding comment:", error);
            alert("❌ Failed to add comment.");
        }
    };

    // Handle Comment Change
    const handleCommentChange = (ticketId, value) => {
        setTicketComments((prevComments) => {
            return {
                ...prevComments,
                [ticketId]: value,  // Update only for the specific ticket
            };
        });
    };

    return (
        <div>
            <h1>🚀 Welcome, {userName}! 👋</h1>
            <h3>Your Role: {userRole}</h3>

            {loading && <p>⏳ Loading tickets...</p>}
            {error && <p className="error">❌ Error: {error}</p>}

            {!loading && !error && assignedTickets.length > 0 ? (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Ticket ID</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Add Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedTickets.map((ticket) => {
                            const ticketId = ticket._links?.self?.href.split("/").pop();  // Extract ticket ID

                            console.log("Ticket Data:", ticket);  // Log ticket to verify

                            return (
                                <tr key={ticketId}>
                                    <td>{ticketId}</td> {/* Display the extracted ticket ID */}
                                    <td>{ticket.title}</td>
                                    <td
                                        style={{
                                            color:
                                                ticket.status === "OPEN"
                                                    ? "red"
                                                    : ticket.status === "IN_PROGRESS"
                                                    ? "orange"
                                                    : "green",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {ticket.status}
                                    </td>
                                    <td>{new Date(ticket.createdAt).toLocaleString()}</td>

                                    {/* Comment Section for Each Ticket */}
                                    <td>
                                        <textarea
                                            value={ticketComments[ticketId] || ""}
                                            onChange={(e) => handleCommentChange(ticketId, e.target.value)}
                                        />
                                        <button onClick={() => handleAddComment(ticket)}>
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>❌ No tickets assigned to you.</p>
            )}

            <button onClick={() => {
                localStorage.clear();
                navigate("/login");
            }}>
                Logout
            </button>
        </div>
    );
};


export default LoginUserDashboard;
