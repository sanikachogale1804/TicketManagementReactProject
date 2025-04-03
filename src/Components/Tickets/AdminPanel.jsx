import React, { useState, useEffect } from "react";
import {
  assignTicketToTeamMember,
  updateTicketStatus,
  getTeamMembers,
  addCommentToTicket,
  getTicketsWithId,
} from "../Services/TicketService";
import '../CSS/AdminPanel.css';

function AdminPanel() {
  const [tickets, setTickets] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [ticketComments, setTicketComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedTickets = await getTicketsWithId();
        const fetchedTeamMembers = await getTeamMembers();

        console.log("✅ Fetched Tickets:", fetchedTickets);

        // 🟢 **Fetch assigned users**
        const updatedTickets = await Promise.all(
          fetchedTickets.map(async (ticket) => {
            if (ticket._links.assignedTo) {
              try {
                const assignedUserResponse = await fetch(ticket._links.assignedTo.href);
                const assignedUser = await assignedUserResponse.json();
                return { ...ticket, assignedTo: assignedUser }; // ✅ Assigned user add karo
              } catch (error) {
                console.error("❌ Error fetching assigned user:", error);
                return { ...ticket, assignedTo: null };
              }
            }
            return { ...ticket, assignedTo: null };
          })
        );

        setTickets(updatedTickets);
        setTeamMembers(fetchedTeamMembers);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ FIXED: Assign ticket only if all required values are set
  const handleAssignTicket = async () => {
    if (!selectedTicketId || !selectedTeamMember) {
      alert("Please select a ticket and a team member.");
      return;
    }

    try {
      const teamMemberUrl = selectedTeamMember._links.self.href;
      console.log(`📌 Assigning Ticket ${selectedTicketId} to ${teamMemberUrl}`);

      await assignTicketToTeamMember(selectedTicketId, teamMemberUrl);

      alert(`✅ Ticket ${selectedTicketId} assigned to ${selectedTeamMember.userName}`);

      // ✅ Assign hone ke baad fresh data leke ao
      const updatedTickets = await getTicketsWithId();
      setTickets(updatedTickets);
    } catch (error) {
      console.error("❌ Failed to assign ticket:", error);
      alert("Error assigning ticket.");
    }
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    console.log("🔍 Debug: Ticket ID ->", ticketId);
    console.log("🔍 Debug: New Status ->", newStatus);

    if (!ticketId) {
      alert("❌ Error: Ticket ID is undefined!");
      return;
    }

    try {
      console.log(`📢 Updating Ticket ${ticketId} to ${newStatus}`);

      const updatedTicket = await updateTicketStatus(ticketId, newStatus);

      console.log("✅ API Response:", updatedTicket); // Debugging ke liye response check karo

      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );

      alert(`✅ Ticket ${ticketId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      alert(`❌ Failed to update ticket status: ${error.message}`);
    }
  };

  const handleAddComment = async (ticketId) => {
    const adminUserId = localStorage.getItem("adminUserId");
    const token = localStorage.getItem("token"); // ✅ Retrieve token for debugging
  
    console.log("🟢 Debug: adminUserId ->", adminUserId);
    console.log("🟢 Debug: Token ->", token);
  
    if (!adminUserId) {
      alert("❌ Error: Admin user ID not found! Please log in again.");
      return;
    }
  
    if (!ticketId || !ticketComments[ticketId]) {
      alert("❌ Please enter a comment before submitting.");
      return;
    }
  
    try {
      const newComment = {
        ticket: { ticketId: ticketId },
        user: { userId: Number(adminUserId) },
        comment: ticketComments[ticketId],
        createdAt: new Date().toISOString(),
      };
  
      console.log("📌 Sending Comment Data:", newComment);
  
      await addCommentToTicket(ticketId, newComment);
      alert("✅ Comment added successfully!");
  
      setTicketComments((prev) => ({ ...prev, [ticketId]: "" }));
    } catch (error) {
      console.error("❌ Error adding comment:", error);
      alert("❌ Failed to add comment.");
    }
  };
  
  
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = selectedFilter ? ticket.status === selectedFilter : true;
    const matchesSearchQuery =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDateRange =
      (!startDate || new Date(ticket.createdAt) >= new Date(startDate)) &&
      (!endDate || new Date(ticket.createdAt) <= new Date(endDate));

    return matchesStatus && matchesSearchQuery && matchesDateRange;
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Admin Panel</h2>

      <div>
        <h3>Assign Ticket</h3>
        {/* ✅ FIXED: Correctly set selected ticket ID */}
        <select onChange={(e) => setSelectedTicketId(Number(e.target.value))}>
          <option value="">Select Ticket</option>
          {tickets.map((ticket) => (
            <option key={ticket.ticket_id} value={ticket.ticket_id}>
              {ticket.title} (ID: {ticket.ticket_id})
            </option>
          ))}
        </select>

        {/* ✅ FIXED: Select full team member object, not just email */}
        <select onChange={(e) => {
          const selectedMember = teamMembers.find(member => member.userEmail === e.target.value);
          setSelectedTeamMember(selectedMember);
        }}>
          <option value="">Select Team Member</option>
          {teamMembers.map((member) => (
            <option key={member.userEmail} value={member.userEmail}>
              {member.userName}
            </option>
          ))}
        </select>

        <button onClick={handleAssignTicket}>Assign Ticket</button>
      </div>

      <div>
        <h3>Filter Tickets by Status</h3>
        <select onChange={(e) => setSelectedFilter(e.target.value)}>
          <option value="">All Tickets</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div>
        <h3>Filter by Date Range</h3>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search here"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div>
        <h3>Tickets</h3>
        {filteredTickets.length > 0 ? (
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Update Status</th>
                <th>Add Comment</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.ticket_id}>
                  <td>{ticket.ticket_id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.status}</td>
                  <td>
                    {ticket.assignedTo ? ticket.assignedTo.userName : "Not Assigned"}
                  </td>
                  <td>
                    <select onChange={(e) => handleUpdateTicketStatus(ticket.ticket_id, e.target.value)}>
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </td>


                  <td>
                    <textarea
                      value={ticketComments[ticket.ticket_id] || ""}
                      onChange={(e) =>
                        setTicketComments((prev) => ({
                          ...prev,
                          [ticket.ticket_id]: e.target.value,
                        }))
                      }
                    />
                    <button onClick={() => handleAddComment(ticket.ticket_id)}>Add</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tickets to display</p>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
