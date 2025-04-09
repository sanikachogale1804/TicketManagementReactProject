import React, { useState } from 'react';
import { addTicket } from '../Services/TicketService';
import '../CSS/NewTicketForm.css';

function NewTicketForm({ onTicketCreated }) {
  const [ticket, setTicket] = useState({
    iasspname: '',
    siteID: '',
    description: '',
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
    if (!ticket.iasspname || !ticket.siteID || !ticket.description || !ticket.startDate || !ticket.endDate) {
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

    if (!ticket.iasspname || ticket.iasspname.trim() === "") {
      setError("⚠️ 'IASSP Name' cannot be empty.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Here, we set status to 'OPEN' by default and don't need to include it in the form
    const newTicket = {
      iasspname: ticket.iasspname,
      siteID: ticket.siteID,
      description: ticket.description,
      status: 'OPEN',  // Always 'OPEN' by default
      startDate: ticket.startDate,
      endDate: ticket.endDate,
    };

    console.log('🟢 Submitting new ticket:', newTicket);

    addTicket(newTicket)
      .then((data) => {
        setTicket({
          iasspname: '',
          siteID: '',
          description: '',
          startDate: '',
          endDate: '',
        });
        if (onTicketCreated) onTicketCreated(data);
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error('❌ Failed to add ticket:', error.message);
        setIsSubmitting(false);
        setError('❌ There was a conflict while creating the ticket. Please check the details.');
      });
  };

  return (
    <div className="new-ticket-form">
      <h2>Create New Ticket</h2>
      <form onSubmit={submitHandler} className="ticket-form">
        <table className="ticket-form-table">
          <tbody>
            <tr>
              <td><label>IASSP Name</label></td>
              <td>
                <select
                  name="iasspname"
                  value={ticket.iasspname}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select a company</option>
                  <option value="Skipper Limited">Skipper Limited</option>
                  <option value="Dinesh Engineers Limited">Dinesh Engineers Limited</option>
                  <option value="NexGen Digital Infrastructure">NexGen Digital Infrastructure</option>
                  <option value="Bondada Engineering Limited">Bondada Engineering Limited</option>
                  <option value="Pace Digitek">Pace Digitek</option>
                  <option value="Pratap Technocrats Pvt Ltd">Pratap Technocrats Pvt Ltd</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><label>Site ID</label></td>
              <td>
                <input
                  type="text"
                  name="siteID"
                  value={ticket.siteID}
                  onChange={handleChange}
                  className="form-input"
                  maxLength="12"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label>Description</label></td>
              <td><textarea name="description" value={ticket.description} onChange={handleChange} className="form-input" required /></td>
            </tr>
            <tr>
              <td><label>Start Date & Time</label></td>
              <td><input type="datetime-local" name="startDate" value={ticket.startDate} onChange={handleChange} className="form-input" required /></td>
            </tr>
            <tr>
              <td><label>End Date & Time</label></td>
              <td><input type="datetime-local" name="endDate" value={ticket.endDate} onChange={handleChange} className="form-input" required /></td>
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
