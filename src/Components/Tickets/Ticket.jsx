import React, { useEffect, useState } from 'react';
import NewTicketForm from './NewTicketForm';

import '../CSS/Ticket.css'
import { getTickets } from '../Services/TicketService';

function Ticket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Ensure page size is large enough to fetch all tickets
        const response = await getTickets(); // This will call your `getTickets` function
        const ticketsData = response._embedded?.tickets || [];
        setTickets(ticketsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleTicketCreated = (newTicket) => {
    setTickets([newTicket, ...tickets]);
  };

  return (
    <div>
      <NewTicketForm onTicketCreated={handleTicketCreated} />

      <div className="ticket-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {tickets.length > 0 ? (
              <table className="ticket-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Reason For Footage Request</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length > 0 ? (
                    <ul>
                      {tickets.map(ticket => (
                        <li key={ticket._links.self.href}>
                          <h3>{ticket.title}</h3>
                          <p>{ticket.description}</p>
                          <p>Status: {ticket.status}</p>
                          {/* Use the self link to fetch individual ticket details */}
                          <a href={ticket._links.self.href} target="_blank">View Ticket Details</a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No tickets available</p>
                  )}
                </tbody>
              </table>
            ) : (
              <p>No tickets available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Ticket;
