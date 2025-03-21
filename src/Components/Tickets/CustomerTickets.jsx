import React, { useState, useEffect } from "react";
import axios from "axios";
import { getTickets } from "../Services/TicketService";

function CustomerTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");  // Assuming you have stored the userId in localStorage after login
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
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Your Tickets</h2>
      {tickets.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.ticket_id}>
                <td>{ticket.ticket_id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
                <td>{ticket.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tickets found</p>
      )}
    </div>
  );
}

export default CustomerTickets;
