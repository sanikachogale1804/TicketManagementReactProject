import React, { useState, useEffect } from 'react';
import { getTickets } from '../Services/TicketService';


function Ticket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {

    const fetchTickets = async () => {
      try {
        const response = await getTickets();
         setTickets(response._embedded?.tickets || []);
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
    <div>
      <h2>Ticket Dashboard</h2>

      {/* Status Filter */}
      <div>
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
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Start Date</th>  {/* ✅ Added Start Date Column */}
                <th>End Date</th>    {/* ✅ Added End Date Column */}
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.ticketId}>
                  <td>{ticket.ticketId}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.startDate ? new Date(ticket.startDate).toLocaleString() : 'N/A'}</td>  {/* ✅ Show Start Date */}
                  <td>{ticket.endDate ? new Date(ticket.endDate).toLocaleString() : 'N/A'}</td>      {/* ✅ Show End Date */}
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
