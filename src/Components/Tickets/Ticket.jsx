import React, { useEffect, useState } from 'react';
import NewTicketForm from './NewTicketForm'; // Import form to create new tickets
import { getTickets } from '../Services/TicketService'; // Service to fetch tickets

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

      <div className="card-body">
        {loading ? (
          <p>Loading...</p> // Show loading message while fetching data
        ) : (
          <ul>
            {tickets.length > 0 ? (
              tickets.map((ticket) => {
                const ticketId = ticket._links?.self?.href.split('/').pop(); // Get ticket ID from the self link
                return (
                  <li key={ticketId}>
                    <h3>Ticket ID: {ticketId}</h3> {/* Display Ticket ID */}
                    <h3>{ticket.title}</h3>
                    <p>{ticket.description}</p>
                    <p>Status: {ticket.status}</p>
                    <p>Created At: {ticket.createdAt}</p>
                  </li>
                );
              })
            ) : (
              <p>No tickets available.</p> // Show a message if no tickets are available
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Ticket;
