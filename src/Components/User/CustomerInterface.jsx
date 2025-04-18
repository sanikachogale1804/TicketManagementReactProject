import React, { useEffect, useState } from 'react';
import { getTicketsByUser } from '../Services/TicketService';
import axios from 'axios';
import '../CSS/CustomerInterface.css';
import NewTicketForm from '../Tickets/NewTicketForm';

function CustomerInterface({ userId }) {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentTicketId, setCommentTicketId] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getTicketsByUser(userId);
        const ticketsData = response._embedded?.tickets || [];

        const ticketsWithId = ticketsData.map((ticket) => {
          const ticketId = ticket.ticketId || ticket._links?.ticket?.href?.split("/").pop();
          return { ...ticket, ticketId };
        });

        setTickets(ticketsWithId);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userId]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const fetchComments = async (ticketId) => {
    try {
      const response = await axios.get(`http://localhost:8080/tickets/${ticketId}/comments`);
      const commentsData = response.data._embedded?.comments || [];
      setComments(commentsData);
      console.log("Fetched comments:", commentsData);
    } catch (error) {
      console.error(`Error fetching comments for Ticket ${ticketId}:`, error);
      setComments([]);
    }
  };

  const handleShowComments = (ticketId) => {
    if (commentTicketId === ticketId && showComments) {
      setShowComments(false);
      setCommentTicketId(null);
    } else {
      fetchComments(ticketId);
      setCommentTicketId(ticketId);
      setShowComments(true);
    }
  };

  return (
    <div className="customer-interface">
      <h2>Image And Footage Request</h2>

      <NewTicketForm onTicketCreated={(newTicket) => setTickets((prevTickets) => [...prevTickets, newTicket])} />

      <div className="ticket-filters">
        <label>Filter by Status: </label>
        <select value={filter} onChange={handleFilterChange}>
          <option value="ALL">All</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {loading ? (
        <p>Loading your tickets...</p>
      ) : (
        <div className="ticket-list">
          {tickets.length > 0 ? (
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Site ID</th>
                  <th>IASSP Name</th>
                  <th>Reason For Footage</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {tickets
                  .filter(ticket => filter === 'ALL' || ticket.status === filter)
                  .map((ticket) => (
                    <React.Fragment key={ticket.ticketId}>
                      <tr>
                        <td>{ticket.ticketId}</td>
                        <td>{ticket.siteID}</td>
                        <td>{ticket.iasspname}</td>
                        <td>{ticket.description}</td>
                        <td className={`status-cell ${ticket.status.toLowerCase().replace('_', '-')}`}>
                          {ticket.status}
                        </td>

                        <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button onClick={() => handleShowComments(ticket.ticketId)} className="view-comments-btn">
                            {commentTicketId === ticket.ticketId && showComments ? "Hide Comments" : "View Comments"}
                          </button>
                        </td>
                      </tr>

                      {commentTicketId === ticket.ticketId && showComments && (
                        <tr className="comments-row">
                          <td colSpan="7">
                            <div className="comments-container fade-in">
                              <h4>💬 Comments:</h4>
                              {comments.length > 0 ? (
                                <ul className="comments-list">
                                  {comments.map((comment, index) => (
                                    <li key={index} className="comment-item">
                                      <p className="comment-text">🗒️ {comment.comment}</p>
                                      <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleString()}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No comments found for this ticket.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>No tickets available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerInterface;
