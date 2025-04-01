import React, { useState, useEffect } from "react";
import { getAssignedTickets } from "../Services/TeamMemberService";
import { addCommentToTicket, updateTicketStatus } from "../Services/TicketService";


function TeamMemberDashboard() {
  const [tickets, setTickets] = useState([]);
  const [ticketComments, setTicketComments] = useState({});
  const userId = localStorage.getItem("user_id"); // Team member's ID

  useEffect(() => {
    const fetchAssignedTickets = async () => {
      try {
        const assignedTickets = await getAssignedTickets(userId);
        setTickets(assignedTickets);
      } catch (error) {
        console.error("Error fetching assigned tickets:", error);
      }
    };

    fetchAssignedTickets();
  }, [userId]);

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
      alert("Ticket status updated!");
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const handleAddComment = async (ticketId) => {
    if (!ticketComments[ticketId]) return;
    try {
      await addCommentToTicket(ticketId, ticketComments[ticketId]);
      alert("Comment added!");
      setTicketComments((prev) => ({ ...prev, [ticketId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div>
      <h2>Team Member Dashboard</h2>
      <h3>Assigned Tickets</h3>
      {tickets.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Add Comment</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.ticket_id}>
                <td>{ticket.ticket_id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
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
                      setTicketComments((prev) => ({ ...prev, [ticket.ticket_id]: e.target.value }))
                    }
                    placeholder="Add your comment"
                  />
                  <button onClick={() => handleAddComment(ticket.ticket_id)}>Add Comment</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No assigned tickets</p>
      )}
    </div>
  );
}

export default TeamMemberDashboard;
