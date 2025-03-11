import React, { useState, useEffect } from 'react';
import { getTickets, updateTicket, addCommentToTicket } from '../Services/TicketService';

function TeamMemberPanel() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');

  // Assume the logged-in user's ID is stored in localStorage
  const currentUserId = localStorage.getItem("userId");  // Replace with your auth logic to get current user's ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all tickets
        const ticketResponse = await getTickets();
        const fetchedTickets = ticketResponse._embedded?.tickets || [];

        // Log the entire tickets response to see the structure
        console.log('Fetched Tickets:', fetchedTickets);

        // Filter tickets by current user ID (checking assignedTo field)
        const assignedTickets = fetchedTickets.filter(ticket => {
          // Log the assignedTo link
          console.log('AssignedTo Link:', ticket._links?.assignedTo?.href);
          
          // Just check if the 'assignedTo' field is non-null or non-empty
          const assignedToLink = ticket._links?.assignedTo?.href;
          return assignedToLink;  // If assignedTo exists, include the ticket
        });

        // Log assigned tickets to verify filtering
        console.log('Assigned Tickets:', assignedTickets);

        setTickets(assignedTickets);  // Set only assigned tickets
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUserId]);  // Dependency array ensures this runs when currentUserId changes

  const handleStatusChange = async (ticketId) => {
    const updatedTicket = { status };
    try {
      const updatedTicketData = await updateTicket(ticketId, updatedTicket);
      setTickets(tickets.map(ticket => ticket.ticket_id === ticketId ? { ...ticket, ...updatedTicketData } : ticket));
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleAddComment = async () => {
    if (!selectedTicketId || !comment) return;
    try {
      await addCommentToTicket(selectedTicketId, { comment });
      setTickets(tickets.map(ticket => ticket.ticket_id === selectedTicketId ? { ...ticket, comments: [...ticket.comments, { comment, createdAt: new Date().toISOString() }] } : ticket));
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleSelectTicket = (ticketId) => {
    const selectedTicket = tickets.find(ticket => ticket.ticket_id === ticketId);
    if (selectedTicket) {
      setSelectedTicketId(ticketId);
      setStatus(selectedTicket.status);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Team Member Ticket Management</h2>

      <div>
        <h3>Assigned Tickets</h3>
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map(ticket => (
                <tr key={ticket.ticket_id}>
                  <td>{ticket.ticket_id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.status}</td>
                  <td>
                    <button onClick={() => handleSelectTicket(ticket.ticket_id)}>Manage</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No tickets assigned</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedTicketId && (
        <div>
          <h3>Manage Ticket #{selectedTicketId}</h3>
          <div>
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
            <button onClick={() => handleStatusChange(selectedTicketId)}>Update Ticket</button>
          </div>

          <div>
            <h4>Add Comment</h4>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment"></textarea>
            <button onClick={handleAddComment}>Submit Comment</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamMemberPanel;
