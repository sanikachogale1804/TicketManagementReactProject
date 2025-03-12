import React, { useState, useEffect } from 'react';
import { addTickets } from '../Services/TicketService';
import { getUsers } from '../Services/UserService';
import '../CSS/NewTicketForm.css'; // Importing the CSS file

function NewTicketForm({ onTicketCreated }) {
  const [ticket, setTicket] = useState({
    ticketId: '',
    title: '',
    description: '',
    status: 'OPEN',
    customerUserId: '',
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const userData = await getUsers();
        const users = userData._embedded?.users || [];
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

  const submitHandler = (e) => {
    e.preventDefault();

    const newTicket = {
      ticketId: ticket.ticketId,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      customerUserId: ticket.customerUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTickets(newTicket)
      .then((data) => {
        setTicket({ ticketId: '', title: '', description: '', status: 'OPEN', customerUserId: '' });
        if (onTicketCreated) onTicketCreated(data);
      })
      .catch((error) => console.error('Failed to add ticket:', error));
  };

  return (
    <div>
      <h2>Create New Ticket</h2>
      <form onSubmit={submitHandler} className="ticket-form">
        <table className="ticket-table">
          <tbody>
            {/* Ticket ID Row */}
            {/* <tr>
              <td><label>Ticket ID</label></td>
              <td>
                <input
                  type="text"
                  name="ticketId"
                  value={ticket.ticketId}
                  onChange={handleChange}
                  className="form-input"
                />
              </td>
            </tr> */}

            {/* Site ID (Title) Row */}
            <tr>
              <td><label>Site ID</label></td>
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
                <input
                  type="text"
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
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default NewTicketForm;
