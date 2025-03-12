import React, { useEffect, useState } from 'react';
import NewTicketForm from './NewTicketForm'; // Import form to create new tickets
import { getTickets } from '../Services/TicketService'; // Service to fetch tickets
import '../CSS/Ticket.css'

function Ticket() {
  const [tickets, setTickets] = useState([]); // State to hold the tickets
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    // Fetch tickets when the component mounts
    const fetchTickets = async () => {
      try {
        const response = await getTickets(); // Fetch tickets from the backend
        
        const ticketsData = response._embedded?.tickets || []; // Get tickets from response   
        setTickets(ticketsData); // Store tickets in state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false); // Set loading to false if there's an error
      }
    };

    fetchTickets(); // Call fetchTickets function when component mounts
  }, []); // Empty dependency array means it runs only once on mount

  const handleTicketCreated = (newTicket) => {
    setTickets([newTicket, ...tickets]); // Add the new ticket to the list
  };

  return (
    <div>
      <NewTicketForm onTicketCreated={handleTicketCreated} /> {/* Form to add new ticket */}

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
                    <th>Title</th>
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
                        <td>{ticketId}</td>
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
