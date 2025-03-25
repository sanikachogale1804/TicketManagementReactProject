import React, { useState, useEffect } from 'react';
import { getUsers } from '../Services/UserService';
import '../CSS/NewTicketForm.css';
import { addTicket } from '../Services/TicketService';

function NewTicketForm({ onTicketCreated }) {
  const [ticket, setTicket] = useState({
    title: '',
    description: '',
    status: 'OPEN',
    customerUserId: '',
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Error state for form validation
  const [isSubmitting, setIsSubmitting] = useState(false); // To handle submitting state

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const userData = await getUsers();
        const users = userData._embedded?.users;
        const customerList = users.map(user => ({
          id: user._links?.self?.href.split('/').pop(),
          name: user.userName,
        }));
        setCustomers(customerList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket({ ...ticket, [name]: value });
  };

  const validateForm = () => {
    // Validate required fields
    if (!ticket.title || !ticket.description || !ticket.customerUserId) {
      setError('Please fill out all fields.');
      return false;
    }
    setError('');
    return true;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop submission if form is not valid

    setIsSubmitting(true);

    const newTicket = {
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      customerUserId: ticket.customerUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Submitting new ticket:", newTicket);

    addTicket(newTicket)
      .then((data) => {
        setTicket({ title: '', description: '', status: 'OPEN', customerUserId: '' });
        if (onTicketCreated) onTicketCreated(data);
        setIsSubmitting(false); // Reset submitting state
      })
      .catch((error) => {
        console.error('Failed to add ticket:', error);
        setIsSubmitting(false); // Reset submitting state
      });
  };

  return (
    <div>
      <h2>Create New Ticket</h2>
      <form onSubmit={submitHandler} className="ticket-form">
        <table className="ticket-table">
          <tbody>
            {/* Site ID (Ticket ID) Row */}
            <tr>
              <td><label>Site ID</label></td>
              <td>
                <input
                  type="text"
                  name="ticketId"
                  onChange={handleChange}
                  className="form-input"
                  value={ticket.ticketId}
                />
              </td>
            </tr>

            {/* Title Row */}
            <tr>
              <td><label>Reason for Footage Request</label></td>
              <td>
                <input
                  type="text"
                  name="title"
                  value={ticket.title}
                  onChange={handleChange}
                  className="form-input"
                />
              </td>
            </tr>

            {/* Description Row */}
            <tr>
              <td><label>Description</label></td>
              <td>
                <textarea
                  name="description"
                  value={ticket.description}
                  onChange={handleChange}
                  className="form-input"
                />
              </td>
            </tr>

            {/* Customer Name Row */}
            <tr>
              <td><label>Customer Name</label></td>
              <td>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <select
                    name="customerUserId"
                    value={ticket.customerUserId}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            </tr>

            {/* Status Row */}
            <tr>
              <td><label>Status</label></td>
              <td>
                <select
                  name="status"
                  value={ticket.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Display Error Message */}
        {error && <p className="error">{error}</p>}

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default NewTicketForm;
