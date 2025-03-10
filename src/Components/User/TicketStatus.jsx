import React from "react";
import './TicketStatus.css'

const TicketStatus = ({ tickets }) => {
    if (tickets.length === 0) {
        return <div>No tickets submitted yet!</div>;
    }

    return (
        <div className="ticket-status">
            <h2>Ticket Status</h2>
            <table>
                <thead>
                    <tr>
                        <th>Site ID</th>
                        <th>State</th>
                        <th>City</th>
                        <th>Pincode</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Reason</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket, index) => (
                        <tr key={index}>
                            <td>{ticket.siteId}</td>
                            <td>{ticket.state}</td>
                            <td>{ticket.city}</td>
                            <td>{ticket.pincode}</td>
                            <td>{ticket.fromDate}</td>
                            <td>{ticket.toDate}</td>
                            <td>{ticket.reason}</td>
                            <td>Open</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TicketStatus;
