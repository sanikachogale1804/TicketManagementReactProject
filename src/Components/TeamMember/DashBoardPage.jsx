import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

const DashboardPage = () => {
  const { user, logout } = useUser();
  const [assignedTickets, setAssignedTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/teamMemberLogin"); // Redirect to login if no user is found
      return; // Don't proceed further if user is not logged in
    }

    // Function to fetch assigned tickets
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`/api/tickets/assigned/${user.userId}`);
        setAssignedTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [user, navigate]); // Effect will run if the `user` or `navigate` changes

  if (!user) {
    return null; // No need to show loading if we're redirecting the user to login page
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>
      <h3>Assigned Tickets</h3>
      <ul>
        {assignedTickets.length > 0 ? (
          assignedTickets.map((ticket) => (
            <li key={ticket.id}>{ticket.title}</li>
          ))
        ) : (
          <p>No tickets assigned.</p> // Show message when no tickets are assigned
        )}
      </ul>
    </div>
  );
};

export default DashboardPage;
