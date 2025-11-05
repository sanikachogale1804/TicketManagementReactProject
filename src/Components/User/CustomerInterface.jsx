import React, { useEffect, useState } from 'react';
import { getTicketsByUser } from '../Services/TicketService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/CustomerInterface.css';
import NewTicketForm from '../Tickets/NewTicketForm';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function CustomerInterface({ userId }) {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentTicketId, setCommentTicketId] = useState(null);

  const navigate = useNavigate();

  // ---------- Sorting states ----------
  const [ticketIdAsc, setTicketIdAsc] = useState(true);       // Ticket ID ascending by default
  const [createdDateAsc, setCreatedDateAsc] = useState(false); // Created Date descending by default

  // ---------- Fetch tickets ----------
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getTicketsByUser(userId);
        const ticketsData = response._embedded?.tickets || [];

        const ticketsWithId = ticketsData.map(ticket => {
          const ticketId = ticket.ticketId || ticket._links?.ticket?.href?.split("/").pop();
          const siteId = ticket.siteID || ticket.siteId || "";
          return { ...ticket, ticketId, siteId };
        });

        // Sort initially: Ticket ID ascending, Created Date descending
        const sortedByTicketId = [...ticketsWithId].sort((a, b) => a.ticketId - b.ticketId);
        const fullySorted = [...sortedByTicketId].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setTickets(fullySorted);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userId]);

  // ---------- Filter ----------
  const handleFilterChange = (e) => setFilter(e.target.value);

  // ---------- Comments ----------
  const fetchComments = async (ticketId) => {
    try {
      const response = await axios.get(`http://192.168.1.91:9080/tickets/${ticketId}/comments`);
      const commentsData = response.data._embedded?.comments || [];
      setComments(commentsData);
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

  // ---------- Logout ----------
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ---------- Export ----------
  const handleExportToExcel = () => {
    if (!tickets.length) return alert("No tickets available to export!");
    const formattedTickets = tickets.map(ticket => ({
      "Ticket ID": ticket.ticketId,
      "Site ID": ticket.siteId || ticket.siteID || "",
      "IASSP Name": ticket.iasspname || "",
      "Description": ticket.description || "",
      "Status": ticket.status || "",
      "Created At": new Date(ticket.createdAt).toLocaleString()
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedTickets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), `Tickets_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // ---------- Sorting functions ----------
  const sortByTicketId = (arr, asc = true) => arr.sort((a, b) => asc ? a.ticketId - b.ticketId : b.ticketId - a.ticketId);
  const sortByCreatedDate = (arr, asc = true) =>
    arr.sort((a, b) => asc ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt));

  const handleTicketIdSort = () => {
    const sorted = sortByTicketId([...tickets], !ticketIdAsc);
    setTickets(sorted);
    setTicketIdAsc(!ticketIdAsc);
  };

  const handleCreatedDateSort = () => {
    const sorted = sortByCreatedDate([...tickets], !createdDateAsc);
    setTickets(sorted);
    setCreatedDateAsc(!createdDateAsc);
  };

  const getTicketIdArrow = () => ticketIdAsc ? ' 🔼' : ' 🔽';
  const getCreatedDateArrow = () => createdDateAsc ? ' 🔼' : ' 🔽';

  // ---------- Ticket Created ----------
  const handleTicketCreated = (newTicket) => {
    const updatedTickets = [...tickets, newTicket];
    // Keep current sorting for both columns
    const sortedTickets = sortByCreatedDate(sortByTicketId([...updatedTickets], ticketIdAsc), createdDateAsc);
    setTickets(sortedTickets);
  };

  // ---------- Render ----------
  return (
    <div className="customer-interface">
      <h2>Image And Footage Request</h2>
      <NewTicketForm onTicketCreated={handleTicketCreated} />

      <div className="ticket-filters">
        <label>Filter by Status: </label>
        <select value={filter} onChange={handleFilterChange}>
          <option value="ALL">All</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <button className='export-button-customer' onClick={handleExportToExcel}>Export to Excel</button>

      <div className="header-buttons">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {loading ? <p>Loading your tickets...</p> : (
        <div className="ticket-list">
          {tickets.length ? (
            <table className="ticket-table">
              <thead>
                <tr>
                  <th onClick={handleTicketIdSort}>Ticket ID{getTicketIdArrow()}</th>
                  <th>Site ID</th>
                  <th>IASSP Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th onClick={handleCreatedDateSort}>Created Date{getCreatedDateArrow()}</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {tickets.filter(t => filter === 'ALL' || t.status === filter).map(ticket => (
                  <React.Fragment key={ticket.ticketId}>
                    <tr>
                      <td>{ticket.ticketId}</td>
                      <td>{ticket.siteID}</td>
                      <td>{ticket.iasspname}</td>
                      <td>{ticket.description}</td>
                      <td className={`status-cell ${ticket.status.toLowerCase().replace('_','-')}`}>{ticket.status}</td>
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
                            {comments.length ? (
                              <ul className="comments-list">
                                {comments.map((c, i) => (
                                  <li key={i} className="comment-item">
                                    <p className="comment-text">🗒️ {c.comment}</p>
                                    <span className="comment-date">{new Date(c.createdAt).toLocaleString()}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : <p>No comments found for this ticket.</p>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : <p>No tickets available.</p>}
        </div>
      )}
    </div>
  );
}

export default CustomerInterface;
