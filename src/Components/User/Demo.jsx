<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Support Dashboard</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        body {
            display: flex;
            font-family: Arial, sans-serif;
            margin: 0;
            background: #f4f7fe;
        }
        .sidebar {
            width: 250px;
            background: linear-gradient(to bottom, #4e54c8, #8f94fb);
            color: white;
            padding: 20px;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
        }
        .sidebar h2 {
            text-align: center;
            margin-bottom: 20px;
        }
        .sidebar ul {
            list-style: none;
            padding: 0;
        }
        .sidebar ul li {
            padding: 15px;
            cursor: pointer;
            border-radius: 5px;
            transition: 0.3s;
        }
        .sidebar ul .active, .sidebar ul li:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        .main-content {
            margin-left: 270px;
            padding: 20px;
            width: calc(100% - 270px);
        }
        header {
            font-size: 24px;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .ticket-section {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        .ticket-card, .task-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            width: 300px;
            transition: 0.3s;
            position: relative;
        }
        .ticket-card:hover, .task-card:hover {
            box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2);
        }
        .task-card {
            margin-top: 20px;
        }
        .ticket-card h3, .task-card h3 {
            margin: 0 0 10px;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <h2>Support.cc</h2>
        <ul>
            <li>Dashboard</li>
            <li class="active">Tickets</li>
            <li>Contacts</li>
            <li>Knowledge Base</li>
            <li>Tasks</li>
            <li>Automations</li>
        </ul>
    </div>
    <div class="main-content">
        <header>
            <h1>Tickets</h1>
        </header>
        <div class="ticket-section">
            <div class="ticket-card">
                <h3>Billing Problem</h3>
                <p>#537 by John</p>
            </div>
            <div class="ticket-card">
                <h3>Login Problem</h3>
                <p>#545 by Rosy</p>
            </div>
        </div>
        <div class="task-card">
            <h3>Tasks</h3>
            <p>Ticket ID: 1144</p>
            <p>Task Name: Paypal Issue</p>
            <p>Status: Open</p>
        </div>
    </div>
</body>
</html>