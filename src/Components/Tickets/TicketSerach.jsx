import React, { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const getTicketsById = async (ticketId) => {
    try {
      const token = localStorage.getItem('token'); // Assuming the token is saved in localStorage
      const response = await axios.get(`${BASE_URL}/tickets/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Add Authorization header with the token
        },
      });
      return response.data; // Return the ticket data
    } catch (error) {
      console.error("Error fetching ticket:", error); // If there's an error
      throw error; // Rethrow error for other error handlers
    }
  };

const TicketSearch = () => {
  const [ticketId, setTicketId] = useState('');
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const data = await getTicketsById(ticketId); // Call the function
      setTicket(data); // Store the ticket data
      setError(''); // Clear previous errors
    } catch (error) {
      setError('Ticket not found or error occurred');
      setTicket(null);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)} // Update ticketId as you type
        placeholder="Enter Ticket ID"
      />
      <button onClick={handleSearch}>Search Ticket</button>

      {error && <div>{error}</div>}

      {ticket && (
        <div>
          <h2>{ticket.title}</h2>
          <p>{ticket.description}</p>
          <p>Status: {ticket.status}</p>
        </div>
      )}
    </div>
  );
};

export default TicketSearch;
