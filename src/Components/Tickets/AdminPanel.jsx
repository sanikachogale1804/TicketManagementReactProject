import React, { useState, useEffect } from "react";
import { getTickets, assignTicketToTeamMember, updateTicketStatus, getTeamMembers, addCommentToTicket } from "../Services/TicketService";

function AdminPanel() {
  const [tickets, setTickets] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");  // For ticket status
  const [newComment, setNewComment] = useState(""); // For comment text
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");  // For filtering tickets by status

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all tickets and team members
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

  const handleUpdateTicketStatus = async () => {
    if (!selectedTicketId || !selectedStatus) return;
    try {
      await updateTicketStatus(selectedTicketId, selectedStatus);
      alert(`Ticket status updated to ${selectedStatus}`);
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const handleAddComment = async () => {
    if (!selectedTicketId || !newComment) return;
    try {
      await addCommentToTicket(selectedTicketId, newComment);
      alert("Comment added successfully");
      setNewComment("");  // Clear the comment input after adding it
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
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

      {/* Display Tickets based on filter */}
      <div>
        <h3>Tickets</h3>
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div key={ticket.ticket_id}>
              <h4>{ticket.title}</h4>
              <p>Status: {ticket.status}</p>
              <p>Assigned To: {ticket.assignedTo}</p>
            </div>
          ))
        ) : (
          <p>No tickets to display</p>
        )}
      </div>

      {/* Update Ticket Status */}
      <div>
        <h3>Update Ticket Status</h3>
        <select onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>

        <button onClick={handleUpdateTicketStatus}>Update Status</button>
      </div>

      {/* Add Comment to Ticket */}
      <div>
        <h3>Add Comment to Ticket</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment here"
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
}

export default AdminPanel;
