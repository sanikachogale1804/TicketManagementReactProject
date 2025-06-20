import React, { useState, useEffect } from 'react';
import '../CSS/NewTicketForm.css';

function NewTicketForm() {
  const [ticket, setTicket] = useState({
    iasspname: '',
    siteID: '',
    state: '',
    district: '',
    description: '',
    status: 'OPEN',
    startDate: '',
    endDate: '',
  });

  const [siteDetails, setSiteDetails] = useState({
    iasspname: '',
    state: '',
    district: '',
  });

  const [sitesData, setSitesData] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('https://192.168.1.102:9080/siteMasterData2')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch site data');
        return res.json();
      })
      .then(data => {
        const sitesArray = data._embedded?.siteMasterData2s || [];
        setSitesData(sitesArray);
        console.log('Fetched site data:', sitesArray);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'siteID') {
      const matchedSite = sitesData.find(site => site.siteId?.toLowerCase() === value.toLowerCase());
      if (matchedSite) {
        setSiteDetails({
          iasspname: matchedSite.iasspName || '',
          state: matchedSite.state || '',
          district: matchedSite.district || '',
        });
        setTicket(prev => ({
          ...prev,
          siteID: value,
          iasspname: matchedSite.iasspName || '',
          state: matchedSite.state || '',
          district: matchedSite.district || '',
        }));
      } else {
        setSiteDetails({ iasspname: '', state: '', district: '' });
        setTicket(prev => ({
          ...prev,
          siteID: value,
          iasspname: '',
          state: '',
          district: '',
        }));
      }
    } else {
      setTicket(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const payload = {
      iasspname: siteDetails.iasspname,
      siteID: ticket.siteID,
      state: siteDetails.state,
      district: siteDetails.district,
      description: ticket.description,
      startDate: ticket.startDate,
      endDate: ticket.endDate,
      status: 'OPEN'
    };

    console.log('Submitting ticket:', payload);

    fetch('https://192.168.1.102:9080/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to submit ticket');
        return res.json();
      })
      .then(data => {
        alert('Ticket submitted!');
        setIsSubmitting(false);
        setTicket({
          iasspname: '',
          siteID: '',
          state: '',
          district: '',
          description: '',
          status: 'OPEN',
          startDate: '',
          endDate: '',
        });
        setSiteDetails({
          iasspname: '',
          state: '',
          district: '',
        });
      })
      .catch(err => {
        setError(err.message);
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
              <td><label htmlFor="siteID">Site ID</label></td>
              <td>
                <input
                  type="text"
                  id="siteID"
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
              <td><label>IASSP Name</label></td>
              <td><input type="text" value={siteDetails.iasspname} readOnly className="form-input" /></td>
            </tr>
            <tr>
              <td><label>State</label></td>
              <td><input type="text" value={siteDetails.state} readOnly className="form-input" /></td>
            </tr>
            <tr>
              <td><label>District</label></td>
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
