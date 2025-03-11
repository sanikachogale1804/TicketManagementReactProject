import React, { useState, useEffect } from 'react';
import { addTickets } from '../Services/TicketService';
import { getUsers } from '../Services/UserService';

function NewTicketForm({ onTicketCreated }) {
  const [ticket, setTicket] = useState({ title: '', description: '', status: 'OPEN', customerUserId: '' });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getUsers();
        const users = data._embedded?.users || [];
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
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      assignedToUserId: 0,
      customerUserId: ticket.customerUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTickets(newTicket)
      .then((data) => {
        setTicket({ title: '', description: '', status: 'OPEN', customerUserId: '' });
        if (onTicketCreated) onTicketCreated(data);
      })
      .catch((error) => console.error('Failed to add ticket:', error));
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label>Site ID</label>
        <input
          type="text"
          name="title"
          // value={ticket.title}
          // onChange={handleChange}
        />
      </div>
      <div>
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={ticket.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Customer Name</label>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <select
            name="customerUserId"
            value={ticket.customerUserId}
            onChange={handleChange}
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default NewTicketForm;
