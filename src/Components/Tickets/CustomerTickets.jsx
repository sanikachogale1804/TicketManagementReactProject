import React, { useState, useEffect } from "react";
import { getTickets } from "../Services/TicketService"; // Adjust the import if necessary

function CustomerTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getTickets();
        console.log("Fetched tickets:", response); // Log the full response to check structure

        // Extract tickets from response._embedded.tickets
        const ticketsData = response._embedded?.tickets || [];
        
        // Log each ticket and its _links object
        ticketsData.forEach(ticket => {
          console.log("Ticket _links:", ticket._links); // Check the links object
        });

        // Map tickets and add ticket_id
        const ticketsWithId = ticketsData.map((ticket) => {
          const ticketId = ticket._links?.ticket?.href?.split("/").pop(); // Extract ticket ID from the URL
          console.log("Extracted ticketId:", ticketId); // Log extracted ticket ID
          return { ...ticket, ticket_id: ticketId }; // Add the extracted ticket_id to each ticket object
        });

        console.log("Tickets with IDs:", ticketsWithId); // Log tickets with added ticket_id

        setTickets(ticketsWithId); // Set tickets with ID added
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tickets:", error);
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
                <td>{ticket.ticket_id}</td> {/* Display ticket_id */}
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
                <td>{ticket.assignedTo || "Not Assigned"}</td> {/* Optional: Show assignedTo if available */}
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
