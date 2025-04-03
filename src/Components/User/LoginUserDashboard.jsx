import React, { useEffect, useState } from "react";

const LoginUserDashboard = () => {
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [assignedTickets, setAssignedTickets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserName = localStorage.getItem("userName");
        const storedUserRole = localStorage.getItem("userRole");
        const userId = localStorage.getItem("userId");  // ✅ Ensure userId is stored

        if (storedUserName) setUserName(storedUserName);
        if (storedUserRole) setUserRole(storedUserRole);

        const fetchAssignedTickets = async () => {
            if (!userId) {
                setError("User ID not found in localStorage.");
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem("token"); // ✅ Fetch token
                if (!token) {
                    setError("Authorization token missing.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:8080/users/${userId}/assignedTickets`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // ✅ Send token in request
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setAssignedTickets(data || []); // ✅ Store tickets
            } catch (error) {
                console.error("Error fetching assigned tickets:", error);
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

            {loading && <p>Loading tickets...</p>}
            {error && <p className="error">Error: {error}</p>}

            {!loading && !error && assignedTickets.length > 0 ? (
                <ul>
                    {assignedTickets.map((ticket, index) => (
                        <li key={index}>{ticket.title} - {ticket.status}</li>
                    ))}
                </ul>
            ) : (
                <p>No tickets assigned to you.</p>
            )}

            <button onClick={() => {
                localStorage.clear();
                window.location.href = "/login"; // ✅ Redirect to login page
            }}>
                Logout
            </button>
        </div>
    );
};

export default LoginUserDashboard;
