import React, { useState, useEffect } from 'react';
import { getTickets, createTicket } from '../Services/TicketService'; // Ensure these imports are correct

function TicketForm() {
    const [ticketData, setTicketData] = useState({
        iasspname: '',
        siteID: '',  // Change this to match the backend field (case-sensitive)
        description: '',
        startDate: '',
        endDate: '',
        status: 'OPEN',
      });
      

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingTickets, setExistingTickets] = useState([]);

  useEffect(() => {
    // Fetch existing tickets when the component mounts
    const fetchTickets = async () => {
      try {
        const response = await getTickets(); // Fetch tickets from the API
        // Check if the response is in the expected format
        if (response._embedded && response._embedded.tickets && Array.isArray(response._embedded.tickets)) {
          setExistingTickets(response._embedded.tickets); // Set the fetched tickets to the state
        } else {
          console.error('Fetched tickets are not in the expected format:', response);
          setExistingTickets([]); // In case the data format is not as expected
        }
      } catch (err) {
        console.error('Error fetching existing tickets:', err);
        setError('Error fetching existing tickets.');
      }
    };

    fetchTickets(); // Call fetchTickets when the component mounts
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData({
      ...ticketData,
      [name]: value, // This now works with 'siteID' instead of 'siteID'
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(''); // Reset any previous error
  
    try {
      // Proceed with submitting the ticket (no need to check for duplicates)
      const createdTicket = await createTicket(ticketData);
      console.log('Ticket created successfully:', createdTicket);
  
      // Reset the form after successful ticket creation
      setTicketData({
        iasspname: '',
        siteID: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'OPEN',
      });
  
      // Optionally display a success message or reset the UI
    } catch (err) {
      // Handle any errors (including the 409 Conflict from backend)
      setError(err.message); // Display the error message returned from the backend
    } finally {
      setIsSubmitting(false); // Reset the submitting state
    }
  };
  
  return (
    <div>
      <h2>Create New Ticket</h2>
      <form className="ticket-form" onSubmit={handleSubmit}>
        <table className="ticket-form-table">
          <tbody>
            <tr>
              <td><label>IASSP Name</label></td>
              <td>
                <select
                  name="iasspname"
                  value={ticketData.iasspname}
                  onChange={handleInputChange}
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
                  value={ticketData.siteID}
                  onChange={handleInputChange}
                  maxLength="12"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label>description</label></td>
              <td>
                <textarea
                  name="description"
                  value={ticketData.description}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label>Start Date & Time</label></td>
              <td>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={ticketData.startDate}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label>End Date & Time</label></td>
              <td>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={ticketData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label>status</label></td>
              <td>
                <select
                  name="status"
                  value={ticketData.status}
                  onChange={handleInputChange}
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

        {error && <p className="error">{error}</p>} {/* Show error if there's one */}

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'} {/* Button text changes while submitting */}
        </button>
      </form>
    </div>
  );
}

export default TicketForm;
