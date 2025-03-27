import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <h2>TicketMS</h2>
        </div>
        <ul className="navbar-links">
          <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
          <li><Link to="/tickets" className="nav-link">Tickets</Link></li>
          <li><Link to="/customer" className="nav-link">Customer Interface</Link></li>
          <li><Link to="/admin" className="nav-link">Admin Interface</Link></li>
        </ul>
      </nav>

      {/* Header Section */}
      <header className="header">
        <h1 className="tagline">Ticket Management System</h1>
      </header>

      {/* Dashboard Section */}
      <div className="dashboard">
        {/* Ticket Stats Overview */}
        <div className="ticket-stats">
          <h2>Ticket Overview</h2>
          <div className="stats-card">
            <h3>Open Tickets</h3>
            <p className="ticket-count">12</p>
          </div>
          <div className="stats-card">
            <h3>Closed Tickets</h3>
            <p className="ticket-count">56</p>
          </div>
          <div className="stats-card">
            <h3>In Progress Tickets</h3>
            <p className="ticket-count">3</p>
          </div>
        </div>

        {/* Actionable Cards */}
        <div className="action-cards">
          <div className="card">
            <h2>Create a New Ticket</h2>
            <p>Submit a new support request</p>
            <button className="button">
              <Link to="/create-ticket" className="nav-link">Create Ticket</Link>
            </button>
          </div>

          <div className="card">
            <h2>View Your Tickets</h2>
            <p>Check the status of your tickets</p>
            <button className="button">
              <Link to="/view-tickets" className="nav-link">View Tickets</Link>
            </button>
          </div>

          <div className="card">
            <h2>Manage Tickets</h2>
            <p>Admins can assign, resolve, and close tickets</p>
            <button className="button">
              <Link to="/admin/tickets" className="nav-link">Manage Tickets</Link>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 TicketMS | All rights reserved</p>
      </footer>
    </div>
  );
}

export default HomePage;
