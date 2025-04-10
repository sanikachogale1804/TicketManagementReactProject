import React, { useState, useEffect } from "react";
import {
  assignTicketToTeamMember,
  updateTicketStatus,
  getTeamMembers,
  getTicketsWithId,
} from "../Services/TicketService";
import '../CSS/AdminPanel.css';
import axios from 'axios';


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
  const [showComments, setShowComments] = useState(false); // For toggling comments visibility
  const [commentTicketId, setCommentTicketId] = useState(null);


  const [ticketStats, setTicketStats] = useState({
    open: 0,
    inProgress: 0,
    closed: 0,
  });

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

        const stats = {
          open: updatedTickets.filter(ticket => ticket.status === "OPEN").length,
          inProgress: updatedTickets.filter(ticket => ticket.status === "IN_PROGRESS").length,
          closed: updatedTickets.filter(ticket => ticket.status === "CLOSED").length,
        };
        setTicketStats(stats);
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

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = selectedFilter ? ticket.status === selectedFilter : true;
    const matchesSearchQuery =
      (ticket.title && ticket.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ticket.description && ticket.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDateRange =
      (!startDate || new Date(ticket.createdAt) >= new Date(startDate)) &&
      (!endDate || new Date(ticket.createdAt) <= new Date(endDate));

    return matchesStatus && matchesSearchQuery && matchesDateRange;
  });


  const fetchComments = async (ticketId) => {
    try {
      const response = await axios.get(`http://localhost:8080/tickets/${ticketId}/comments`);
      const comments = response.data._embedded?.comments || [];

      setComments(comments);
      console.log(`✅ Comments for Ticket ${ticketId}:`, comments);
    } catch (error) {
      console.error(`❌ Error fetching comments for Ticket ${ticketId}:`, error);
      setComments([]);
    }
  };


  // Function to handle viewing comments for a specific ticket
  const handleShowComments = (ticketId) => {
    if (commentTicketId === ticketId && showComments) {
      setShowComments(false);
      setCommentTicketId(null);
    } else {
      fetchComments(ticketId);
      setCommentTicketId(ticketId);
      setShowComments(true);
    }
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

      {/* Ticket Stats Overview - Positioned Below Navbar */}
      <div className="ticket-stats-overview">
        <h2 className="ticket-stats-title">Ticket Overview</h2>
        <div className="ticket-stats-card open-tickets">
          <h3 className="ticket-stats-heading">Open Tickets</h3>
          <p className="ticket-stats-count">{ticketStats.open}</p>
        </div>
        <div className="ticket-stats-card closed-tickets">
          <h3 className="ticket-stats-heading">Closed Tickets</h3>
          <p className="ticket-stats-count">{ticketStats.closed}</p>
        </div>
        <div className="ticket-stats-card in-progress-tickets">
          <h3 className="ticket-stats-heading">In Progress</h3>
          <p className="ticket-stats-count">{ticketStats.inProgress}</p>
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
                <th>Site ID</th>
                <th>IASSP Name</th>
                <th>Description</th> {/* Changed from Reason to Description */}
                <th>Status</th>
                <th>Assigned To</th>
                <th>Update Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.ticket_id}>
                  <td>{ticket.ticket_id}</td>
                  <td>{ticket.siteID}</td>  {/* Display Site ID */}
                  <td>{ticket.iasspname}</td>  {/* Display IASSP Name */}
                  <td>{ticket.description}</td> {/* Render the description here */}
                  <td>{ticket.status}</td>
                  <td>{ticket.assignedTo ? ticket.assignedTo.userName : "Not Assigned"}</td>
                  <td>
                    <select onChange={(e) => handleUpdateTicketStatus(ticket.ticket_id, e.target.value)} className="status-select">
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </td>
                  <td>{ticket.startDate ? new Date(ticket.startDate).toLocaleString() : 'N/A'}</td>
                  <td>{ticket.endDate ? new Date(ticket.endDate).toLocaleString() : 'N/A'}</td>
                  <td>
                    <button onClick={() => handleShowComments(ticket.ticket_id)} className="view-comments-btn">
                      View Comments
                    </button>
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
      {showComments && (
        <div className="comments-container">
          <h3>Comments for Ticket ID: {commentTicketId}</h3>
          {comments.length > 0 ? (
            <ul>
              {comments.map((comment, index) => (
                <li key={index}>
                  <p>{comment.comment}</p>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments found for this ticket.</p>
          )}
        </div>
      )}

    </div>
  );
}

export default AdminPanel;
