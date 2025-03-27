import React from 'react'

function HomePage() {
    return (
        <div>
            {/* Header Section */}
            <header className="header">
                <h1>Ticket Management System</h1>
            </header>

            {/* Navigation Menu */}
            <nav className="nav">
                <ul>
                    <li><a href="#create-ticket">Create Ticket</a></li>
                    <li><a href="#view-tickets">View Tickets</a></li>
                    <li><a href="#manage-tickets">Manage Tickets</a></li>
                </ul>
            </nav>

            {/* Main Content Section */}
            <main className="main-content">
                <section id="create-ticket" className="section">
                    <h2>Create a New Ticket</h2>
                    <button className="button">Create Ticket</button>
                </section>

                <section id="view-tickets" className="section">
                    <h2>View Open Tickets</h2>
                    <p>Here you can view all the open tickets and their statuses.</p>
                    {/* Add a Table or List to display tickets */}
                </section>

                <section id="manage-tickets" className="section">
                    <h2>Manage Tickets</h2>
                    <p>Manage and resolve the open tickets.</p>
                    {/* Add functionality to manage tickets here */}
                </section>
            </main>

            {/* Footer Section */}
            <footer className="footer">
                <p>&copy; 2025 Ticket Management System</p>
            </footer>
        </div>
    )
}

export default HomePage
