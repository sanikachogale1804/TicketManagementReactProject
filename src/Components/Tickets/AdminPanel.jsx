import React, { useState, useEffect } from "react";
import {
  getTickets,
  assignTicketToTeamMember,
  updateTicketStatus,
  getTeamMembers,
  addCommentToTicket,
} from "../Services/TicketService";
import '../CSS/AdminPanel.css'; // Importing the CSS file

function AdminPanel() {
  const [tickets, setTickets] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ticketResponse = await getTickets();
        const fetchedTickets = ticketResponse._embedded?.tickets || [];
        const fetchedTeamMembers = await getTeamMembers();

        setTickets(fetchedTickets);
        setTeamMembers(fetchedTeamMembers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignTicket = async () => {
    if (!selectedTicketId || !selectedTeamMember) return;
    try {
      await assignTicketToTeamMember(selectedTicketId, selectedTeamMember);
      alert("Ticket assigned successfully");
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };

  const handleUpdateTicketStatus = async (ticketId) => {
    if (!ticketId || !selectedStatus) return;
    try {
      await updateTicketStatus(ticketId, selectedStatus);
      alert(`Ticket status updated to ${selectedStatus}`);
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const handleAddComment = async (ticketId) => {
    if (!ticketId || !newComment) return;
    try {
      await addCommentToTicket(ticketId, newComment);
      alert("Comment added successfully");
      setNewComment(""); // Clear comment input after adding
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (!selectedFilter) return true;
    return ticket.status === selectedFilter;
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Admin Panel</h2>

      {/* Assign Ticket Section */}
      <div>
        <h3>Assign Ticket</h3>
        <select onChange={(e) => setSelectedTicketId(e.target.value)}>
          <option value="">Select Ticket</option>
          {tickets.map((ticket) => (
            <option key={ticket.ticket_id} value={ticket.ticket_id}>
              {ticket.title} (ID: {ticket.ticket_id})
            </option>
          ))}
        </select>

        <select onChange={(e) => setSelectedTeamMember(e.target.value)}>
          <option value="">Select Team Member</option>
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.userName}
              </option>
            ))
          ) : (
            <option value="">No Team Members Available</option>
          )}
        </select>

        <button onClick={handleAssignTicket}>Assign Ticket</button>
      </div>

      {/* Filter Tickets by Status */}
      <div>
        <h3>Filter Tickets by Status</h3>
        <select onChange={(e) => setSelectedFilter(e.target.value)}>
          <option value="">All Tickets</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Display Tickets in a Table Format */}
      <div>
        <h3>Tickets</h3>
        {filteredTickets.length > 0 ? (
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Update Status</th>
                <th>Add Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.ticket_id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.assignedTo || "Not Assigned"}</td>
                  <td>
                    <select
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      value={selectedStatus}
                    >
                      <option value="">Select Status</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <button onClick={() => handleUpdateTicketStatus(ticket.ticket_id)}>
                      Update Status
                    </button>
                  </td>
                  <td>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add your comment here"
                    />
                    <button onClick={() => handleAddComment(ticket.ticket_id)}>
                      Add Comment
                    </button>
                  </td>
                  <td>
                    {/* Any other actions (e.g., Assign) */}
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
