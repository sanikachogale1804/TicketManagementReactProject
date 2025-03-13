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
  const [searchQuery, setSearchQuery] = useState("");

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

  // Assign Ticket to Team Member
  const handleAssignTicket = async () => {
    if (!selectedTicketId || !selectedTeamMember) return;
    try {
      // Call the API to assign the ticket
      const response = await assignTicketToTeamMember(selectedTicketId, selectedTeamMember);

      // Check if the response is successful (based on your API response structure)
      if (response.success) {
        // Update the assigned ticket in the local state to reflect the changes in the UI
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.ticket_id === selectedTicketId
              ? { ...ticket, assignedTo: selectedTeamMember }
              : ticket
          )
        );

        alert("Ticket assigned successfully");
      } else {
        alert("Failed to assign ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning ticket:", error);
      alert("Error assigning ticket. Please try again.");
    }
  };

  // Update Ticket Status
  const handleUpdateTicketStatus = async (ticketId) => {
    if (!ticketId || !selectedStatus) return;
    try {
      await updateTicketStatus(ticketId, selectedStatus);
      alert(`Ticket status updated to ${selectedStatus}`);
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  // Add Comment to Ticket
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

  // Filter tickets by status and search query
  const filteredTickets = tickets.filter((ticket) => {
    // Filter by status
    const matchesStatus = selectedFilter ? ticket.status === selectedFilter : true;

    // Filter by search query (case-insensitive)
    const matchesSearchQuery =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearchQuery;
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
          {tickets
            .filter((ticket) => ticket.status === "OPEN") // Filter for open tickets only
            .map((ticket) => (
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

      {/* Search Box */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          id="searchQuery"
          placeholder="Search here"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div id="searchHelp" className="form-text">Search here.</div>
      </div>

      {/* Display Tickets in a Table Format */}
      <div>
        <h3>Tickets</h3>
        {filteredTickets.length > 0 ? (
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Site ID</th>
                <th>Reason For Footage Request</th>
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
                  <td>{ticket.ticket_Id}</td>
                  <td>{ticket.site_id || "N/A"}</td>
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
