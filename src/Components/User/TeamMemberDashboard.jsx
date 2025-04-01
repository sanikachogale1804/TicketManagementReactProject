import React, { useState, useEffect } from "react";

const TeamMemberDashboard = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedTeamMember, setSelectedTeamMember] = useState(null);
    const [assignedTickets, setAssignedTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await fetch("http://localhost:8080/users");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const teamMembersData = data._embedded.users.filter(user => user.role === "TEAMMEMBER");

                setTeamMembers(teamMembersData);
            } catch (error) {
                console.error("Error fetching team members:", error);
                setError(error.message);
            }
        };

        fetchTeamMembers();
    }, []);

    useEffect(() => {
        if (!selectedTeamMember) return;

        const fetchAssignedTickets = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/users/${selectedTeamMember}/assignedTickets`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setAssignedTickets(data._embedded?.tickets || []);
            } catch (error) {
                console.error("Error fetching assigned tickets:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedTickets();
    }, [selectedTeamMember]);

    return (
        <div>
            <h1>🚀 Team Member Dashboard</h1>

            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            <label>
                Select Team Member:
                <select onChange={(e) => setSelectedTeamMember(e.target.value)} value={selectedTeamMember || ""}>
                    <option value="">-- Select --</option>
                    {teamMembers.map(member => (
                        <option key={member._links.self.href} value={member._links.self.href.split("/").pop()}>
                            {member.userName}
                        </option>
                    ))}
                </select>
            </label>

            {loading && <p>Loading tickets...</p>}

            {selectedTeamMember && !loading && (
                <div>
                    <h2>Assigned Tickets for {teamMembers.find(m => m._links.self.href.split("/").pop() === selectedTeamMember)?.userName}</h2>
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

export default TeamMemberDashboard;
