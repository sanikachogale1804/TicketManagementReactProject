import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Image/cogent logo.jpg';
import '../CSS/HomePage.css';
import { getTicketsWithId } from '../Services/TicketService';
import CalendarDashboard from './CalendarDashboard'; // Adjust path if needed


function HomePage() {
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    closed: 0,
    inProgress: 0,
    outOfTat: 0,
  });
  

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const tickets = await getTicketsWithId();
        const now = new Date();

        const stats = {
          total: tickets.length,
          open: 0,
          closed: 0,
          inProgress: 0,
          outOfTat: 0,
        };

        tickets.forEach(ticket => {
          if (ticket.status === 'OPEN') stats.open += 1;
          else if (ticket.status === 'CLOSED') stats.closed += 1;
          else if (ticket.status === 'IN_PROGRESS') {
            stats.inProgress += 1;

            const createdAt = new Date(ticket.createdAt);
            const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
            if (hoursDiff > 48) {
              stats.outOfTat += 1;
            }
          }
        });

        setTicketStats(stats);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };


    fetchTickets();
  }, []);

  return (
    <div className="dashboard-container light-theme">
      <aside className="sidebar office-style">
        <div className="sidebar-logo">
          <img src={logo} alt="TicketMS Logo" className="logo" />
        </div>
        <ul className="sidebar-links">
          <li><Link to="/dashboard" className="sidebar-link">Dashboard</Link></li>

          <li><Link to="/adminPanel" className="sidebar-link">Admin Interface</Link></li>
          <li><Link to="/loginPage" className="sidebar-link">Login</Link></li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header office-header">
          <h1 className="tagline">Images & Footages Management</h1>
        </header>

        <div className="dashboard">
          <div className="ticket-stats">
            <h2>Ticket Overview</h2>
            <div className="stats-card open">
              <h3>Total Tickets</h3>
              <p className="ticket-count">{ticketStats.total}</p>
            </div>
            <div className="stats-card open">
              <h3>Open Tickets</h3>
              <p className="ticket-count">{ticketStats.open}</p>
            </div>
            <div className="stats-card closed">
              <h3>Closed Tickets</h3>
              <p className="ticket-count">{ticketStats.closed}</p>
            </div>
            <div className="stats-card progress">
              <h3>In Progress</h3>
              <p className="ticket-count">{ticketStats.inProgress}</p>
            </div>
            <div className="stats-card tat">
              <h3>Out of TAT</h3>
              <p className="ticket-count">{ticketStats.outOfTat}</p>
            </div>
          </div>

          <CalendarDashboard />

        </div>

        <footer className="footer office-footer">
          <p>&copy; 2025 TicketMS | All rights reserved</p>
        </footer>
      </main>
    </div>
  );
}

export default HomePage;
