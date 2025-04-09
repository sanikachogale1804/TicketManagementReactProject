import React, { useState, useEffect } from 'react';
import { getTickets } from '../Services/TicketService';
import '../CSS/Ticket.css'

function Ticket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getTickets();
        const ticketsData = response._embedded?.tickets || [];

        // Add ticketId extracted from href to each ticket object
        const ticketsWithId = ticketsData.map((ticket) => {
          const ticketId = ticket._links?.ticket?.href?.split("/").pop(); // Extract ticket ID from the URL
          return { ...ticket, ticketId }; // Add the extracted ticket_id to each ticket object
        });

        setTickets(ticketsWithId);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === 'ALL') return true;
    return ticket.status === filter;
  });

  return (
    <div className="ticket-dashboard-container">
      <h2>Ticket Dashboard</h2>

      {/* Filter Section */}
      <div className="filter-section">
        <label>Filter by Status: </label>
        <select onChange={handleFilterChange}>
          <option value="ALL">All</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Ticket List */}
      <div className="ticket-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Site ID</th> 
                <th>IASSP Name</th> 
                <th>Description</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.ticketId}> {/* Use ticketId here */}
                  <td>{ticket.ticketId}</td> {/* Display ticketId */}
                  <td>{ticket.siteID}</td>  {/* Display Site ID */}
                  <td>{ticket.iasspname}</td>  {/* Display IASSP Name */}
                  <td>{ticket.description}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.startDate ? new Date(ticket.startDate).toLocaleString() : 'N/A'}</td>
                  <td>{ticket.endDate ? new Date(ticket.endDate).toLocaleString() : 'N/A'}</td>
                  <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Ticket;
