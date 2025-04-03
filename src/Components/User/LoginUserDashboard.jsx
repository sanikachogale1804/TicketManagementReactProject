import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Use for better redirection

const LoginUserDashboard = () => {
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [assignedTickets, setAssignedTickets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate(); // ✅ Use React Router for navigation

    useEffect(() => {
        const storedUserName = localStorage.getItem("userName");
        const storedUserRole = localStorage.getItem("userRole");
        const userId = localStorage.getItem("userId");

        if (storedUserName) setUserName(storedUserName);
        if (storedUserRole) setUserRole(storedUserRole);

        const fetchAssignedTickets = async () => {
            if (!userId) {
                setError("❌ User ID not found in localStorage.");
                setLoading(false);
                return;
            }

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

                // ✅ Extract tickets correctly
                setAssignedTickets(data._embedded?.tickets || []);
                console.log("📌 Extracted Tickets:", data._embedded?.tickets);

            } catch (error) {
                console.error("❌ Error fetching assigned tickets:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedTickets();
    }, []);

    return (
        <div>
            <h1>🚀 Welcome, {userName}! 👋</h1>
            <h3>Your Role: {userRole}</h3>

            {loading && <p>⏳ Loading tickets...</p>}
            {error && <p className="error">❌ Error: {error}</p>}

            {!loading && !error && assignedTickets.length > 0 ? (
                <ul>
                    {assignedTickets.map((ticket, index) => (
                        <li key={index}>
                            <strong>{ticket.title}</strong> - {ticket.status}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>❌ No tickets assigned to you.</p>
            )}

            <button onClick={() => {
                localStorage.clear();
                navigate("/login"); // ✅ Use navigate instead of window.location.href
            }}>
                Logout
            </button>
        </div>
    );
};

export default LoginUserDashboard;
