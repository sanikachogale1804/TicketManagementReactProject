import React, { useState } from 'react';
import { addTicket } from '../Services/TicketService';
import '../CSS/NewTicketForm.css';

function NewTicketForm({ onTicketCreated }) {
  const [ticket, setTicket] = useState({
    iasspname: '',
    siteId: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [siteDetails, setSiteDetails] = useState({
    iasspname: '',
    state: '',
    city: ''
  });


  const handleChange = async (e) => {
    const { name, value } = e.target;
    setTicket((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'siteId' && value.trim() !== '') {
      try {
        const token = localStorage.getItem('token'); // adjust if you use another method
        const response = await fetch(`http://localhost:8080/siteMasterData2/${value.trim()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error("Site not found");
        const site = await response.json();
        setSiteDetails({
          iasspname: site.iasspName,
          state: site.state,
          city: site.district,
        });
        setTicket(prev => ({ ...prev, iasspname: site.iasspName }));
        setError('');
      } catch (err) {
        setError('⚠️ Site ID not found or invalid.');
        setSiteDetails({ iasspname: '', state: '', city: '' });
      }
    }

  };


  const validateForm = () => {
    if (!ticket.iasspname || !ticket.siteId || !ticket.description || !ticket.startDate || !ticket.endDate) {
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
      siteId: ticket.siteId,
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
          siteId: '',
          description: '',
          startDate: '',
          endDate: '',
        });
        // Add ticketId directly from the response
        if (onTicketCreated) onTicketCreated(data);  // Pass the newly created ticket with ticketId back
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
              <td><label>Site ID</label></td>
              <td>
                <input
                  type="text"
                  name="siteId"
                  value={ticket.siteId}
                  onChange={handleChange}
                  className="form-input"
                  maxLength="12"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label>IASSP Name</label></td>
              <td><input type="text" value={siteDetails.iasspname} readOnly className="form-input" /></td>
            </tr>
            <tr>
              <td><label>State</label></td>
              <td><input type="text" value={siteDetails.state} readOnly className="form-input" /></td>
            </tr>
            <tr>
              <td><label>City</label></td>
              <td><input type="text" value={siteDetails.city} readOnly className="form-input" /></td>
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
