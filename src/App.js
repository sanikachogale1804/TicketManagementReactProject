import './App.css';
import UserPanel from './Components/User/UserPanel';
import TicketForm from './Components/User/TicketForm';
import TicketStatus from './Components/User/TicketStatus';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
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

// 👇 Import RedirectHandler
import RedirectHandler from './Components/Auth/ReactHandler';
import CameraReportList from './Components/Camera/CameraReportList';

// 👇 Token check function
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// 👇 Protected route wrapper
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/loginPage" replace />;
};

// 👇 Define routes with protection
const routes = createBrowserRouter([
  { path: "/", element: <RedirectHandler /> }, // 👈 updated root route
  { path: "/loginPage", element: <LoginPage /> },
  { path: "/registerPage", element: <RegisterPage /> },

  { path: "/ticketForm", element: <PrivateRoute element={<TicketForm />} /> },
  { path: "/userpanel", element: <PrivateRoute element={<UserPanel />} /> },
  { path: "/ticketstatus", element: <PrivateRoute element={<TicketStatus />} /> },
  { path: "/tickets", element: <PrivateRoute element={<Ticket />} /> },
  { path: "/newticketForm", element: <PrivateRoute element={<NewTicketForm />} /> },
  { path: "/adminPanel", element: <PrivateRoute element={<AdminPanel />} /> },
  { path: "/customerTickets", element: <PrivateRoute element={<CustomerTickets />} /> },
  { path: "/ticketSearch", element: <PrivateRoute element={<TicketSearch />} /> },
  { path: "/customerInterface", element: <PrivateRoute element={<CustomerInterface />} /> },
  { path: "/homePage", element: <PrivateRoute element={<HomePage />} /> },
  { path: "/teamMemberDashboard", element: <PrivateRoute element={<TeamMemberDashboard />} /> },
  { path: "/loginUserDashboard", element: <PrivateRoute element={<LoggedinUserDashboard />} /> },
  { path: "/calendarDashboard", element: <PrivateRoute element={<CalendarDashboard />} /> },
  { path: "/cameraReport", element: <PrivateRoute element={<CameraReportList />} /> },

  // 👇 Redirect unmatched routes
  { path: "*", element: <Navigate to="/" replace /> }
]);

function App() {
  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
