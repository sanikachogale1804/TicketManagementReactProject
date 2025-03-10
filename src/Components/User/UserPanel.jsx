import React, { useState } from "react";
import TicketForm from "./TicketForm";  // The form for creating a ticket
import TicketStatus from "./TicketStatus";  // To display the submitted ticket status
// import './UserPanel.css';

const UserPanel = () => {
    const [view, setView] = useState("create");  // State to toggle between views
    const [tickets, setTickets] = useState([]);  // To store an array of tickets

    // Toggle between views
    const toggleView = (viewType) => {
        setView(viewType);
    };

    // Function to handle ticket submission from TicketForm
    const handleTicketSubmit = (ticket) => {
        setTickets([...tickets, ticket]);  // Add new ticket to the list
        setView("status");  // Show the status view after submission
    };

    return (
        <div className="ticket-interface">
            <h1>Ticket Management Interface</h1>

            <div className="navigation">
                {/* Toggle between create ticket and view ticket status */}
                <button onClick={() => toggleView("create")}>Create Ticket</button>
                <button onClick={() => toggleView("status")}>View Ticket Status</button>
            </div>

            <div className="content">
                {/* Conditionally render TicketForm or TicketStatus based on view state */}
                {view === "create" && <TicketForm onSubmit={handleTicketSubmit} />}
                {view === "status" && <TicketStatus tickets={tickets} />}
            </div>
        </div>
    );
};

export default UserPanel;
