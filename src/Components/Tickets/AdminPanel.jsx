import React, { useState, useEffect } from "react";
import {
  assignTicketToTeamMember,
  updateTicketStatus,
  getTeamMembers,
  getTicketsWithId,
} from "../Services/TicketService";
import '../CSS/AdminPanel.css';

function AdminPanel() {
  const [tickets, setTickets] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedTickets = await getTicketsWithId();
        const fetchedTeamMembers = await getTeamMembers();

        console.log("✅ Fetched Tickets:", fetchedTickets);

        // 🟢 **Fetch assigned users**
        const updatedTickets = await Promise.all(
          fetchedTickets.map(async (ticket) => {
            if (ticket._links.assignedTo) {
              try {
                const assignedUserResponse = await fetch(ticket._links.assignedTo.href);
                const assignedUser = await assignedUserResponse.json();
                return { ...ticket, assignedTo: assignedUser }; // ✅ Assigned user add karo
              } catch (error) {
                console.error("❌ Error fetching assigned user:", error);
                return { ...ticket, assignedTo: null };
              }
            }
            return { ...ticket, assignedTo: null };
          })
        );

        setTickets(updatedTickets);
        setTeamMembers(fetchedTeamMembers);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ FIXED: Assign ticket only if all required values are set
  const handleAssignTicket = async () => {
    if (!selectedTicketId || !selectedTeamMember) {
      alert("Please select a ticket and a team member.");
      return;
    }

    try {
      const teamMemberUrl = selectedTeamMember._links.self.href;
      console.log(`📌 Assigning Ticket ${selectedTicketId} to ${teamMemberUrl}`);

      await assignTicketToTeamMember(selectedTicketId, teamMemberUrl);

      alert(`✅ Ticket ${selectedTicketId} assigned to ${selectedTeamMember.userName}`);

      // ✅ Assign hone ke baad fresh data leke ao
      const updatedTickets = await getTicketsWithId();
      setTickets(updatedTickets);
    } catch (error) {
      console.error("❌ Failed to assign ticket:", error);
      alert("Error assigning ticket.");
    }
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    console.log("🔍 Debug: Ticket ID ->", ticketId);
    console.log("🔍 Debug: New Status ->", newStatus);

    if (!ticketId) {
      alert("❌ Error: Ticket ID is undefined!");
      return;
    }

    try {
      console.log(`📢 Updating Ticket ${ticketId} to ${newStatus}`);

      const updatedTicket = await updateTicketStatus(ticketId, newStatus);

      console.log("✅ API Response:", updatedTicket); // Debugging ke liye response check karo

      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );

      alert(`✅ Ticket ${ticketId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      alert(`❌ Failed to update ticket status: ${error.message}`);
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

  // Fetch comments for the selected ticket
  const fetchComments = async (ticketId) => {
    try {
      // Call the API to fetch the comments of a specific ticket
      const response = await fetch(`http://localhost:8080/tickets/${ticketId}/comments`);

      if (!response.ok) {
        throw new Error("❌ Error fetching comments");
      }

      const data = await response.json();

      // Log the response to inspect its structure
      console.log("Fetched Comments Response:", data);

      // Ensure the response contains comments under '_embedded.comments'
      if (data && data._embedded && Array.isArray(data._embedded.comments) && data._embedded.comments.length > 0) {
        setComments(data._embedded.comments); // Set the comments state
      } else {
        console.log("No comments available or unexpected response format.");
        setComments([]); // If no comments are available, set an empty array
      }
    } catch (error) {
      console.error("❌ Error fetching comments:", error);
      setComments([]); // Optionally, handle errors by setting an empty array
    }
  };

  // Function to handle viewing comments for a specific ticket
  const handleShowComments = (ticketId) => {
    setSelectedTicketId(ticketId);  // Set the selected ticket ID
    fetchComments(ticketId);  // Fetch comments for the selected ticket
  };


  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>

      {/* Navbar for Filters and Ticket Assignment */}
      <div className="navbar">
        {/* Assign Ticket */}
        <div className="assign-ticket-container">
          <h3>Assign Ticket</h3>
          <select onChange={(e) => setSelectedTicketId(Number(e.target.value))}>
            <option value="">Select Ticket</option>
            {tickets.map((ticket) => (
              <option key={ticket.ticket_id} value={ticket.ticket_id}>
                {ticket.title} (ID: {ticket.ticket_id})
              </option>
            ))}
          </select>

          {/* Apply the class to the select dropdown */}
          <select
            onChange={(e) => setSelectedTeamMember(teamMembers.find(member => member.userEmail === e.target.value))}
            className="team-member-select"
          >
            <option value="">Select Team Member</option>
            {teamMembers.map((member) => (
              <option key={member.userEmail} value={member.userEmail}>
                {member.userName}
              </option>
            ))}
          </select>

          <button onClick={handleAssignTicket}>Assign Ticket</button>
        </div>

        {/* Filter by Status */}
        <div className="filters-container">
          <h3>Filter Tickets by Status</h3>
          <select onChange={(e) => setSelectedFilter(e.target.value)}>
            <option value="">All Tickets</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Filter by Date Range and Search Bar */}
          <div className="filter-search-container">
            <h3>Filter by Date Range</h3>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            {/* Search Bar */}
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search tickets..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Tickets Table */}
      <div className="ticket-list-container">
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
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.ticket_id}>
                  <td>{ticket.ticket_id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.assignedTo ? ticket.assignedTo.userName : "Not Assigned"}</td>
                  <td>
                    <select onChange={(e) => handleUpdateTicketStatus(ticket.ticket_id, e.target.value)} className="status-select">
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleShowComments(ticket.ticket_id)} className="view-comments-btn">View Comments</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tickets to display</p>
        )}
      </div>


      {/* Comments Section */}
      {/* <div className="comments-container">
    {comments.length === 0 ? (
      <p>No comments available for this ticket.</p>
    ) : (
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>
            <p>{comment.comment}</p>
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    )}
  </div> */}
    </div>

  );
}


export default AdminPanel;
