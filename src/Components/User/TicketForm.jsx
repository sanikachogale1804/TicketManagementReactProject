import React, { useState } from "react";
import './TicketForm.css'

const TicketForm = ({ onSubmit }) => {
    const [ticketData, setTicketData] = useState({
        siteId: "",
        state: "",
        city: "",
        pincode: "",
        fromDate: "",
        toDate: "",
        reason: "",
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicketData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // Submit the ticket data to the parent component
        onSubmit(ticketData);

        // Optionally, you can clear the form after submission
        setTicketData({
            siteId: "",
            state: "",
            city: "",
            pincode: "",
            fromDate: "",
            toDate: "",
            reason: "",
        });
    };

    return (
        <div className="ticket-form">
            <h2>Create a Ticket</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Site ID:</label>
                    <input
                        type="text"
                        name="siteId"
                        value={ticketData.siteId}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>State:</label>
                    <input
                        type="text"
                        name="state"
                        value={ticketData.state}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>City:</label>
                    <input
                        type="text"
                        name="city"
                        value={ticketData.city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Pincode:</label>
                    <input
                        type="text"
                        name="pincode"
                        value={ticketData.pincode}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>From Date:</label>
                    <input
                        type="datetime-local"
                        name="fromDate"
                        value={ticketData.fromDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>To Date:</label>
                    <input
                        type="datetime-local"
                        name="toDate"
                        value={ticketData.toDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Reason for Request:</label>
                    <textarea
                        name="reason"
                        value={ticketData.reason}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Submit Ticket</button>
            </form>
        </div>
    );
};

export default TicketForm;
