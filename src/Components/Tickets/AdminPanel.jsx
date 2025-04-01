import React, { useState, useEffect } from "react";
import {
  assignTicketToTeamMember,
  updateTicketStatus,
  getTeamMembers,
  addCommentToTicket,
  getTickets,
} from "../Services/TicketService";
import '../CSS/AdminPanel.css';

function AdminPanel() {
  const [tickets, setTickets] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketComments, setTicketComments] = useState({});
  const [startDate, setStartDate] = useState(""); // Added start date state
  const [endDate, setEndDate] = useState(""); // Added end date state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ticketResponse = await getTickets();
        const fetchedTickets = ticketResponse._embedded?.tickets || [];  // Adjust based on actual API response structure
        const fetchedTeamMembers = await getTeamMembers();

        // Log fetched tickets to check if ticket_id exists
        console.log(fetchedTickets); // For debugging, check if ticket_id exists

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
      const response = await assignTicketToTeamMember(selectedTicketId, selectedTeamMember);

      if (response && response.ticketId) {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.ticket_id === selectedTicketId // Ensure the ticket_id matches
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

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    if (!ticketId || !newStatus) return;

    try {
      await updateTicketStatus(ticketId, newStatus);

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.ticket_id === ticketId  // Ensure you use the correct field (ticket_id or ticketId)
            ? { ...ticket, status: newStatus }
            : ticket
        )
      );

      alert(`Ticket status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating ticket status:", error);
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

  // Date range filtering logic added here
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = selectedFilter ? ticket.status === selectedFilter : true;
    const matchesSearchQuery =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Date range filter logic
    const matchesDateRange =
      (!startDate || new Date(ticket.createdAt) >= new Date(startDate)) &&
      (!endDate || new Date(ticket.createdAt) <= new Date(endDate));

    return matchesStatus && matchesSearchQuery && matchesDateRange;
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
            .filter((ticket) => ticket.status === "OPEN")
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
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Date Range Filters */}
      <div>
        <h3>Filter by Date Range</h3>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
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
                  <td>{ticket.ticket_id}</td> {/* Ensure this is properly rendered */}
                  <td>{ticket.site_id || "N/A"}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.assignedTo || "Not Assigned"}</td>
                  <td>
                    <select
                      onChange={(e) => handleUpdateTicketStatus(ticket.ticket_id, e.target.value)}
                      value={ticket.status} // Keep track of individual ticket status
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                    <button onClick={() => handleUpdateTicketStatus(ticket.ticket_id, ticket.status)}>
                      Update Status
                    </button>
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
                      placeholder="Add your comment here"
                    />
                    <button onClick={() => handleAddComment(ticket.ticket_id)}>
                      Add Comment
                    </button>
                  </td>
                  <td>
                    {/* Any other actions */}
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
