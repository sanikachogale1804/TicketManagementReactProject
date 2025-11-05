import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../CSS/TeamMemberDashboard.css';
import { addCommentToTicket, createComment } from "../Services/TicketService";
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";

const TeamMemberDashboard = () => {
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [assignedTickets, setAssignedTickets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketComments, setTicketComments] = useState({});

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const Api_link = (() => {
        const hostname = window.location.hostname;
        if (hostname === "localhost") return "http://localhost:9080";
        if (hostname === "192.168.1.91") return "http://192.168.1.91:9080";
        return "http://117.250.211.51:9080"; // ✅ Public fallback for Netlify/production
    })();

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

                const response = await fetch(`${Api_link}/users/${userId}/assignedTickets`, {
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

            const newComment = await createComment(ticketId, commentPayload, token);
            const commentId = newComment._links?.self?.href?.split("/").pop();

            if (!commentId) {
                throw new Error("❌ Failed to extract comment ID from response.");
            }

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

    const handleExportToExcel = async () => {
        try {
            if (assignedTickets.length === 0) {
                alert("No tickets available to export!");
                return;
            }

            const formattedTickets = assignedTickets.map(ticket => ({
                "Ticket ID": ticket._links?.self?.href.split("/").pop(),
                "Site ID": ticket.siteID,
                "IASSP Name": ticket.iasspname,
                "Description": ticket.description,
                "Status": ticket.status,
                "Created At": new Date(ticket.createdAt).toLocaleDateString(),
                "Comments": ticket.comments ? ticket.comments.map(comment => comment.comment).join("; ") : "",
            }));

            const worksheet = XLSX.utils.json_to_sheet(formattedTickets);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

            const fileName = `Tickets_${new Date().toISOString().split('T')[0]}.xlsx`;
            const data = new Blob([excelBuffer], { type: "application/octet-stream" });
            saveAs(data, fileName);

            console.log("Excel file downloaded successfully!");
        } catch (error) {
            console.error("Error exporting to Excel:", error);
            alert("Something went wrong while exporting!");
        }
    };

    return (
        <div>
            <div className="header-container">
                <h1>👋 Welcome, {userName}!</h1>
                <h3>Your Role: {userRole}</h3>
            </div>

            {loading && <p>⏳ Loading tickets...</p>}
            {error && <p className="error">❌ Error: {error}</p>}

            {!loading && !error && assignedTickets.length > 0 ? (
                <div className="ticket-list-container">
                    <div className="table-header">
                        <button className="export-button-team-member" onClick={handleExportToExcel}>
                            Export to Excel
                        </button>
                        <h2 style={{ marginLeft: "15px" }}>Assigned Tickets</h2>
                    </div>


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
                                const ticketId = ticket._links?.self?.href.split("/").pop();

                                return (
                                    <tr key={ticketId}>
                                        <td className="ticket-id">{ticketId}</td>
                                        <td>{ticket.siteID}</td>
                                        <td>{ticket.iasspname}</td>
                                        <td>{ticket.description}</td>
                                        <td className={`status-${ticket.status?.toLowerCase() || "unknown"}`}>
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
                <button
                    className="logout-button"
                    onClick={() => {
                        localStorage.clear();
                        navigate("/loginPage");
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default TeamMemberDashboard;
