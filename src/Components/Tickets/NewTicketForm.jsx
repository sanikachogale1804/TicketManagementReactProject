import React, { useState } from 'react';
import { addTicket } from '../Services/TicketService';
import '../CSS/NewTicketForm.css';

function NewTicketForm({ onTicketCreated }) {
  const [ticket, setTicket] = useState({
    title: '',
    description: '',
    status: 'OPEN',
    customerUserId: '',
    startDate: '',
    endDate: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket({ ...ticket, [name]: value });
  };

  const validateForm = () => {
    if (!ticket.title || !ticket.description || !ticket.startDate || !ticket.endDate) {
      setError('❌ Please fill out all fields.');
      return false;
    }

    const start = new Date(ticket.startDate);
    const end = new Date(ticket.endDate);
    const differenceInMinutes = (end - start) / (1000 * 60);

    if (differenceInMinutes > 30) {
      setError('⚠️ Error: Duration cannot exceed 30 minutes.');
      return false;
    }

    setError('');
    return true;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const newTicket = {
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      customerUserId: ticket.customerUserId,
      startDate: ticket.startDate,
      endDate: ticket.endDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("🟢 Submitting new ticket:", newTicket);

    addTicket(newTicket)
      .then((data) => {
        setTicket({
          title: '',
          description: '',
          status: 'OPEN',
          customerUserId: '',
          startDate: '',
          endDate: '',
        });
        if (onTicketCreated) onTicketCreated(data);
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error('❌ Failed to add ticket:', error);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="new-ticket-form">
      <h2>Create New Ticket</h2>
      <form onSubmit={submitHandler} className="ticket-form">
        <table className="ticket-form-table">
          <tbody>
            <tr>
              <td><label>Reason for Footage Request</label></td>
              <td><input type="text" name="title" value={ticket.title} onChange={handleChange} className="form-input" /></td>
            </tr>
            <tr>
              <td><label>Description</label></td>
              <td><textarea name="description" value={ticket.description} onChange={handleChange} className="form-input" /></td>
            </tr>
            <tr>
              <td><label>Start Date & Time</label></td>
              <td><input type="datetime-local" name="startDate" value={ticket.startDate} onChange={handleChange} className="form-input" /></td>
            </tr>
            <tr>
              <td><label>End Date & Time</label></td>
              <td><input type="datetime-local" name="endDate" value={ticket.endDate} onChange={handleChange} className="form-input" /></td>
            </tr>
            <tr>
              <td><label>Status</label></td>
              <td>
                <select name="status" value={ticket.status} onChange={handleChange} className="form-select">
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default NewTicketForm;
