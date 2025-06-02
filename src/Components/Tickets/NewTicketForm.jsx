import React, { useState, useEffect } from 'react';
import '../CSS/NewTicketForm.css';

function NewTicketForm() {
  const [ticket, setTicket] = useState({
    siteId: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const [siteDetails, setSiteDetails] = useState({
    iasspname: '',
    state: '',
    district: '',    // changed from city
  });


  const [sitesData, setSitesData] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/siteMasterData2')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch site data');
        return res.json();
      })
      .then(data => {
        // Extract the array of sites
        const sitesArray = data._embedded?.siteMasterData2s || [];
        setSitesData(sitesArray);
        console.log('Fetched site data:', sitesArray);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);


  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setTicket(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'siteId') {
      const matchedSite = sitesData.find(site => site.siteId?.toLowerCase() === value.toLowerCase());
      if (matchedSite) {
        setSiteDetails({
          iasspname: matchedSite.iasspName || '',  // Note camel case: iasspName
          state: matchedSite.state || '',
          district: matchedSite.district || '',    // district here instead of city
        });
      } else {
        setSiteDetails({
          iasspname: '',
          state: '',
          district: '',
        });
      }
    }
  };

  // Handle form submission
  const submitHandler = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Example submit logic - you can adapt as needed
    const payload = { ...ticket, ...siteDetails };
    console.log('Submitting ticket:', payload);

    // Simulate submit delay
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Ticket submitted!');
      // Reset form if you want
      setTicket({
        siteId: '',
        description: '',
        startDate: '',
        endDate: '',
      });
      setSiteDetails({
        iasspname: '',
        state: '',
        city: '',
      });
    }, 1000);
  };

  return (
    <div className="new-ticket-form">
      <h2>Create New Ticket</h2>
      <form onSubmit={submitHandler} className="ticket-form">
        <table className="ticket-form-table">
          <tbody>
            <tr>
              <td><label htmlFor="siteId">Site ID</label></td>
              <td>
                <input
                  type="text"
                  id="siteId"
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
              <td><label>District</label></td>  {/* changed label */}
              <td><input type="text" value={siteDetails.district} readOnly className="form-input" /></td>
            </tr>


            <tr>
              <td><label>Description</label></td>
              <td>
                <textarea
                  name="description"
                  value={ticket.description}
                  onChange={handleChange}
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
                  value={ticket.startDate}
                  onChange={handleChange}
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
                  value={ticket.endDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
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
