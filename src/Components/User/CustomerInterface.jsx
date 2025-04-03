import React, { useEffect, useState } from 'react';
import { getTicketsByUser} from '../Services/TicketService'; // Import your API methods
// import { Link } from 'react-router-dom';  // For navigation to ticket details page
import '../CSS/CustomerInterface.css';
import NewTicketForm from '../Tickets/NewTicketForm';

function CustomerInterface({ userId }) {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('ALL');  // Filter for status (OPEN, IN_PROGRESS, CLOSED, or ALL)
  const [loading, setLoading] = useState(true);

  // Fetch tickets for the customer
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getTicketsByUser(userId);  // You can filter on backend as needed
        setTickets(response._embedded?.tickets || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userId]);

  // Handle status filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Handle status update for a ticket
  // const handleStatusChange = async (ticketId, newStatus) => {
  //   try {
  //     await updateTicketStatus(ticketId, newStatus);
  //     setTickets(prevTickets =>
  //       prevTickets.map(ticket =>
  //         ticket.ticketId === ticketId ? { ...ticket, status: newStatus } : ticket
  //       )
  //     );
  //   } catch (error) {
  //     console.error('Failed to update ticket status:', error);
  //   }
  // };

  // Handle new ticket creation
  const handleTicketCreated = (newTicket) => {
    setTickets((prevTickets) => [...prevTickets, newTicket]);
  };

  return (
    <div className="customer-interface">
      <h2>Your Tickets</h2>

      {/* New Ticket Form Component */}
      <NewTicketForm onTicketCreated={handleTicketCreated} />

      {/* Status filter */}
      <div className="ticket-filters">
        <label>Filter by Status: </label>
        <select value={filter} onChange={handleFilterChange}>
          <option value="ALL">All</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {loading ? (
        <p>Loading your tickets...</p>
      ) : (
        <div className="ticket-list">
          {tickets.length > 0 ? (
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Reason for Request</th>
                  <th>Status</th>
                  <th>Created At</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {tickets
                  .filter(ticket => filter === 'ALL' || ticket.status === filter)  // Apply the filter based on status
                  .map((ticket) => (
                    <tr key={ticket.ticketId}>
                      <td>{ticket.ticketId}</td>
                      <td>{ticket.title}</td>
                      <td>{ticket.status}</td>
                      <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                      {/* <td>
                        <Link to={`/tickets/${ticket.ticketId}`}>View</Link> |
                        {ticket.status !== 'CLOSED' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(ticket.ticketId, 'IN_PROGRESS')}
                              disabled={ticket.status === 'IN_PROGRESS'}
                            >
                              In Progress
                            </button>
                            <button
                              onClick={() => handleStatusChange(ticket.ticketId, 'CLOSED')}
                              disabled={ticket.status === 'CLOSED'}
                            >
                              Close
                            </button>
                          </>
                        )}
                      </td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>No tickets available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerInterface;
