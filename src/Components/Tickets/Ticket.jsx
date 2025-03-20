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
        const response = await getTickets(); 
        
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
                  {tickets.map((ticket) => {
                    const ticketId = ticket._links?.self?.href.split('/').pop();
                    return (
                      <tr key={ticketId}>
                        <td>{ticket.ticketId}</td>
                        <td>{ticket.title}</td>
                        <td>{ticket.description}</td>
                        <td>{ticket.status}</td>
                        <td>{ticket.createdAt}</td>
                      </tr>
                    );
                  })}
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
