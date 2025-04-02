import React, { useEffect, useState } from "react";

const LoginUserDashboard = () => {
    const [user, setUser] = useState(null); // ✅ Logged-in user state
    const [assignedTickets, setAssignedTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const loggedInUserEmail = localStorage.getItem("userEmail");

                console.log("🔹 Token:", token);
                console.log("🔹 User Email:", loggedInUserEmail);

                if (!token || !loggedInUserEmail) {
                    throw new Error("❌ No token or email found! Redirecting to login...");
                }

                // ✅ Fetch All Users
                const response = await fetch("http://localhost:8080/users", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("❌ Unauthorized! Redirecting to login...");
                }

                const data = await response.json();
                console.log("✅ Users Data Fetched:", data);

                const users = data._embedded?.users || [];
                const loggedInUser = users.find(u => u.userEmail === loggedInUserEmail);

                if (!loggedInUser) {
                    throw new Error("❌ User not found in database!");
                }

                setUser(loggedInUser);
            } catch (error) {
                console.error("❌ Error fetching logged-in user:", error.message);
                setError(error.message);
            }
        };

        fetchLoggedInUser();
    }, []);

    useEffect(() => {
        if (!user) return;

        const fetchAssignedTickets = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(user._links.assignedTickets.href, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("❌ Failed to fetch assigned tickets");
                }

                const data = await response.json();
                console.log("✅ Tickets Fetched:", data);

                setAssignedTickets(data._embedded?.tickets || []);
            } catch (error) {
                console.error("❌ Error fetching assigned tickets:", error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedTickets();
    }, [user]);

    return (
        <div>
            <h1>🚀 Welcome {user?.userName}'s Dashboard</h1>

            {error && <p style={{ color: "red" }}>⚠️ Error: {error}</p>}
            {loading && <p>⏳ Loading tickets...</p>}

            {!loading && !error && (
                <div>
                    <h2>🎫 Your Assigned Tickets</h2>
                    {assignedTickets.length === 0 ? (
                        <p>No tickets assigned.</p>
                    ) : (
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Updated At</th>
                                    <th>Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignedTickets.map((ticket, index) => (
                                    <tr key={index}>
                                        <td>{ticket.title}</td>
                                        <td>{ticket.description}</td>
                                        <td style={{
                                            color: ticket.status === "OPEN" ? "red" :
                                                ticket.status === "IN_PROGRESS" ? "orange" : "green",
                                            fontWeight: "bold"
                                        }}>
                                            {ticket.status}
                                        </td>
                                        <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                                        <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                                        <td>
                                            <a href={ticket._links.self.href} target="_blank" rel="noopener noreferrer">
                                                View Ticket
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default LoginUserDashboard;
