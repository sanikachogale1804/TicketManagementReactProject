import './App.css';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import UserPanel from './Components/User/UserPanel';
import TicketForm from './Components/User/TicketForm';
import TicketStatus from './Components/User/TicketStatus';
import Ticket from './Components/Tickets/Ticket';
import NewTicketForm from './Components/Tickets/NewTicketForm';
import RegisterPage from './Components/User/RegisterPage';
import AdminPanel from './Components/Tickets/AdminPanel';
import LoginPage from './Components/User/LoginPage';
import CustomerTickets from './Components/Tickets/CustomerTickets';
import TicketSearch from './Components/Tickets/TicketSerach';
import CustomerInterface from './Components/User/CustomerInterface';
import HomePage from './Components/HomePage/HomePage';
import TeamMemberDashboard from './Components/User/TeamMemberDashboard';
import LoggedinUserDashboard from './Components/User/LoginUserDashboard';
import CalendarDashboard from './Components/HomePage/CalendarDashboard';
import CameraReportList from './Components/Camera/CameraReportList';


// ✅ Token check function
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// ✅ Protected route wrapper
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/loginPage" replace />;
};

function App() {
  return (
    <div>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/loginPage" element={<LoginPage />} />
          <Route path="/registerPage" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/ticketForm" element={<PrivateRoute element={<TicketForm />} />} />
          <Route path="/userpanel" element={<PrivateRoute element={<UserPanel />} />} />
          <Route path="/ticketstatus" element={<PrivateRoute element={<TicketStatus />} />} />
          <Route path="/tickets" element={<PrivateRoute element={<Ticket />} />} />
          <Route path="/newticketForm" element={<PrivateRoute element={<NewTicketForm />} />} />
          <Route path="/adminPanel" element={<PrivateRoute element={<AdminPanel />} />} />
          <Route path="/customerTickets" element={<PrivateRoute element={<CustomerTickets />} />} />
          <Route path="/ticketSearch" element={<PrivateRoute element={<TicketSearch />} />} />
          <Route path="/customerInterface" element={<PrivateRoute element={<CustomerInterface />} />} />
          <Route path="/homePage" element={<PrivateRoute element={<HomePage />} />} />
          <Route path="/teamMemberDashboard" element={<PrivateRoute element={<TeamMemberDashboard />} />} />
          <Route path="/loginUserDashboard" element={<PrivateRoute element={<LoggedinUserDashboard />} />} />
          <Route path="/calendarDashboard" element={<PrivateRoute element={<CalendarDashboard />} />} />
          <Route path="/cameraReport" element={<PrivateRoute element={<CameraReportList />} />} />


          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
