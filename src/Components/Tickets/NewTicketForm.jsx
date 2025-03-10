import React, { useState } from 'react';
import { addTickets } from '../Services/TicketService'; // Service to add tickets

function NewTicketForm({ onTicketCreated }) {
  const [ticket, setTicket] = useState({
    title: '',
    description: '',
    status: 'OPEN',
    customerUserId: '', // Set default user ID (can be changed as needed)
  });

  // Update the state when input fields change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket({ ...ticket, [name]: value });
  };

  // Handle form submission
  const submitHandler = (e) => {
    e.preventDefault();

    const newTicket = {
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      assignedToUserId: 0, // Default assigned to no one
      customerUserId: ticket.customerUserId, // Default customer user ID
      createdAt: new Date().toISOString(), // Set current timestamp for createdAt
      updatedAt: new Date().toISOString(), // Set current timestamp for updatedAt
    };

    // Add the new ticket using the API service
    addTickets(newTicket)
      .then((data) => {
        console.log('Ticket added successfully:', data);
        setTicket({
          title: '',
          description: '',
          status: 'OPEN',
          customerUserId: '', // Reset the form after submission
        });

        if (onTicketCreated) {
          onTicketCreated(data); // Notify parent component with the new ticket
        }
      })
      .catch((error) => {
        console.error('Failed to add ticket:', error);
      });
  };

  return (
    <div>
      <form className="w-3 border border-dark p-4" onSubmit={submitHandler}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Ticket Title"
            name="title"
            value={ticket.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Ticket Description"
            name="description"
            value={ticket.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            className="form-control"
            name="status"
            value={ticket.status}
            onChange={handleChange}
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Optionally, allow for customer selection */}
        <div className="form-group">
          <label>Customer User ID</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter Customer User ID"
            name="customerUserId"
            value={ticket.customerUserId}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default NewTicketForm;
