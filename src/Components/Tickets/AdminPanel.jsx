import React, { useState, useEffect } from "react";
import {
  assignTicketToTeamMember,
  updateTicketStatus,
  getTeamMembers,
  addCommentToTicket,
  getTicketsWithId,
} from "../Services/TicketService";
import '../CSS/AdminPanel.css';

function AdminPanel() {
  const [tickets, setTickets] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketComments, setTicketComments] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const fetchedTickets = await getTicketsWithId();
        const fetchedTeamMembers = await getTeamMembers();

        console.log("✅ Fetched Tickets:", fetchedTickets);
        console.log("✅ Fetched Team Members (RAW):", fetchedTeamMembers);

        setTickets(fetchedTickets);
        setTeamMembers(fetchedTeamMembers);

        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignTicket = async () => {
    console.log("📌 Selected Team Member ID:", selectedTeamMemberId);
    console.log("📌 Selected Ticket ID:", selectedTicketId);

    if (!selectedTicketId || !selectedTeamMemberId) {
      alert("Please select a ticket and a team member.");
      return;
    }

    console.log("✅ Checking Team Members:", teamMembers); // Print all team members

    // 🔍 Try to find the team member object by user_id
    const teamMember = teamMembers.find(member => String(member.user_id) === String(selectedTeamMemberId));

    if (!teamMember) {
      console.error("❌ Team Member Not Found! Selected ID:", selectedTeamMemberId);
      alert("Invalid team member selected. Please try again.");
      return;
    }

    // ✅ Get correct team member URL
    const teamMemberUrl = teamMember._links?.self?.href;
    console.log("🔗 Assigning Ticket to:", teamMemberUrl);

    if (!teamMemberUrl) {
      console.error("❌ Team Member URL Not Found!");
      alert("Team member URL is missing.");
      return;
    }

    try {
      await assignTicketToTeamMember(selectedTicketId, teamMemberUrl);
      alert("🎉 Ticket assigned successfully!");

      // ✅ Update UI instantly
      setTickets(prev =>
        prev.map(ticket =>
          ticket.ticket_id === selectedTicketId ? { ...ticket, assignedTo: teamMember.userName } : ticket
        )
      );
    } catch (error) {
      console.error("❌ API Error:", error);
      alert("Failed to assign ticket. Check console for details.");
    }
    console.log("📌 Selected Team Member ID:", selectedTeamMemberId);
console.log("📌 Selected Ticket ID:", selectedTicketId);
console.log("✅ Checking Team Members:", teamMembers);

  };


  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    if (!ticketId || !newStatus) return;

    try {
      console.log(`Updating Ticket ${ticketId} to Status: ${newStatus}`);

      const updatedTicket = await updateTicketStatus(ticketId, newStatus);

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.ticket_id === ticketId
            ? { ...ticket, status: updatedTicket.status }
            : ticket
        )
      );

      alert(`Ticket status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      alert("Failed to update ticket status.");
    }
  };

  const handleAddComment = async (ticketId) => {
    if (!ticketId || !ticketComments[ticketId]) return;

    try {
      await addCommentToTicket(ticketId, ticketComments[ticketId]);
      alert("Comment added successfully");
      setTicketComments((prev) => ({ ...prev, [ticketId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = selectedFilter ? ticket.status === selectedFilter : true;
    const matchesSearchQuery =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDateRange =
      (!startDate || new Date(ticket.createdAt) >= new Date(startDate)) &&
      (!endDate || new Date(ticket.createdAt) <= new Date(endDate));

    return matchesStatus && matchesSearchQuery && matchesDateRange;
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Admin Panel</h2>

      <div>
        <h3>Assign Ticket</h3>
        <select onChange={(e) => setSelectedTicketId(Number(e.target.value))}>
          <option value="">Select Ticket</option>
          {tickets.map((ticket) => (
            <option key={ticket.ticket_id} value={ticket.ticket_id}>
              {ticket.title} (ID: {ticket.ticket_id})
            </option>
          ))}
        </select>

        <select onChange={(e) => setSelectedTeamMemberId(e.target.value)}>
  <option value="">Select Team Member</option>
  {teamMembers.map((member) => (
    <option key={member.userEmail} value={member.userEmail}>
      {member.userName}
    </option>
  ))}
</select>



        <button onClick={handleAssignTicket}>Assign Ticket</button>
      </div>

      <div>
        <h3>Filter Tickets by Status</h3>
        <select onChange={(e) => setSelectedFilter(e.target.value)}>
          <option value="">All Tickets</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div>
        <h3>Filter by Date Range</h3>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search here"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div>
        <h3>Tickets</h3>
        {filteredTickets.length > 0 ? (
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Update Status</th>
                <th>Add Comment</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.ticket_id}>
                  <td>{ticket.ticket_id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.assignedTo || "Not Assigned"}</td>
                  <td>
                    <select
                      onChange={(e) => handleUpdateTicketStatus(ticket.ticket_id, e.target.value)}
                      value={ticket.status}
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </td>
                  <td>
                    <textarea
                      value={ticketComments[ticket.ticket_id] || ""}
                      onChange={(e) =>
                        setTicketComments((prev) => ({
                          ...prev,
                          [ticket.ticket_id]: e.target.value,
                        }))
                      }
                    />
                    <button onClick={() => handleAddComment(ticket.ticket_id)}>Add</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tickets to display</p>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
