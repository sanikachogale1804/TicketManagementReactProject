import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Image/cogent logo.jpg';
import '../CSS/HomePage.css';
import { getTicketsWithId } from '../Services/TicketService';  // Importing the service function to fetch tickets

function HomePage() {
  const [tickets, setTickets] = useState([]);  // State to hold the tickets data
  const [ticketStats, setTicketStats] = useState({
    open: 0,
    closed: 0,
    inProgress: 0,
  });

  // Fetch tickets and calculate stats
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const fetchedTickets = await getTicketsWithId();
        setTickets(fetchedTickets);

        const stats = {
          open: fetchedTickets.filter(ticket => ticket.status === 'OPEN').length,
          closed: fetchedTickets.filter(ticket => ticket.status === 'CLOSED').length,
          inProgress: fetchedTickets.filter(ticket => ticket.status === 'IN_PROGRESS').length,
        };
        setTicketStats(stats);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);  // Empty dependency array to run the effect only once when the component mounts

  return (
    <div className="dashboard-container light-theme">
      {/* Sidebar */}
      <aside className="sidebar office-style">
        <div className="sidebar-logo">
          <img src={logo} alt="TicketMS Logo" className="logo" />
        </div>
        <ul className="sidebar-links">
          <li><Link to="/dashboard" className="sidebar-link">Dashboard</Link></li>
          <li><Link to="/tickets" className="sidebar-link">Tickets</Link></li>
          <li><Link to="/customerInterface" className="sidebar-link">Customer Interface</Link></li>
          <li><Link to="/adminPanel" className="sidebar-link">Admin Interface</Link></li>
          <li><Link to="/loginPage" className="sidebar-link">Login</Link></li>
        </ul>
      </aside>

      <main className="main-content">
        {/* Header Section */}
        <header className="header office-header">
          <h1 className="tagline">Ticket Management System</h1>
        </header>

        {/* Dashboard Section */}
        <div className="dashboard">
          {/* Ticket Stats Overview */}
          <div className="ticket-stats">
            <h2>Ticket Overview</h2>
            <div className="stats-card open">
              <h3>Open Tickets</h3>
              <p className="ticket-count">{ticketStats.open}</p> {/* Dynamically render Open tickets count */}
            </div>
            <div className="stats-card closed">
              <h3>Closed Tickets</h3>
              <p className="ticket-count">{ticketStats.closed}</p> {/* Dynamically render Closed tickets count */}
            </div>
            <div className="stats-card progress">
              <h3>In Progress</h3>
              <p className="ticket-count">{ticketStats.inProgress}</p> {/* Dynamically render In Progress tickets count */}
            </div>
          </div>

          {/* Actionable Cards */}
          <div className="action-cards">
            <div className="card create">
              <h2>Create a New Ticket</h2>
              <p>Submit a new support request</p>
              <button className="button">
                <Link to="/newticketForm" className="nav-link">Create Ticket</Link>
              </button>
            </div>

            <div className="card view">
              <h2>View Your Tickets</h2>
              <p>Check the status of your tickets</p>
              <button className="button">
                <Link to="/tickets" className="nav-link">View Tickets</Link>
              </button>
            </div>

            <div className="card manage">
              <h2>Manage Tickets</h2>
              <p>Admins can assign, resolve, and close tickets</p>
              <button className="button">
                <Link to="/admin/tickets" className="nav-link">Manage Tickets</Link>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="footer office-footer">
          <p>&copy; 2025 TicketMS | All rights reserved</p>
        </footer>
      </main>
    </div>
  );
}

export default HomePage;
