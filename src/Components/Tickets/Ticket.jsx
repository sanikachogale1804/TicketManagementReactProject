import React, { useEffect, useState } from 'react';
import NewTicketForm from './NewTicketForm'; // Import the form component
import { getTickets } from '../Services/TicketService';

function Ticket() {
  const [tickets, setTickets] = useState([]); // Tickets state to store fetched tickets
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  // Fetch tickets when the component mounts
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets(); // Fetch tickets using the API
        setTickets(data); // Store the tickets in the state
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false); // Once data is fetched or error happens, stop loading
      }
    };

    fetchTickets(); // Call the fetchTickets function
  }, []);

  // This function is called when a new ticket is created
  const handleTicketCreated = (newTicket) => {
    setTickets([newTicket, ...tickets]); // Add the new ticket to the state
  };

  return (
    <div>
      <NewTicketForm onTicketCreated={handleTicketCreated} /> {/* Form for creating a ticket */}

      <div className="card-body">
        {loading ? (
          <p>Loading...</p> // Show loading message while fetching data
        ) : (
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <h3>{ticket.title}</h3>
                <p>{ticket.description}</p>
                <p>Status: {ticket.status}</p>
                <p>Assigned to: {ticket.assignedToUserId || 'Not assigned'}</p>
                <p>Created At: {ticket.createdAt}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Ticket;
