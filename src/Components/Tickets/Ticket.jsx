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
      {/* <NewTicketForm onTicketCreated={handleTicketCreated} />  */}

      <h2>Ticket Dashboard</h2>
       <div>
         <label>Filter by Status: </label>
         <select onChange={handleFilterChange}>
           <option value="ALL">All</option>
           <option value="OPEN">Open</option>
           <option value="IN_PROGRESS">In Progress</option>
           <option value="CLOSED">Closed</option>
         </select>
       </div>

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
                   <td>{ticket.createdAt}</td>
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
