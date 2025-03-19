import './App.css';
import UserPanel from './Components/User/UserPanel';
import TicketForm from './Components/User/TicketForm';
import TicketStatus from './Components/User/TicketStatus';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Ticket from './Components/Tickets/Ticket';
import NewTicketForm from './Components/Tickets/NewTicketForm';
import AdminPanel from './Components/Tickets/AdminPanel';
import LoginPage from './Components/TeamMember/LoginPage';
import DashboardPage from './Components/TeamMember/DashBoardPage';
import { UserProvider, useUser } from './Components/Context/UserContext'; // Import UserProvider and useUser hook
import RegisterPage from './Components/User/RegisterPage';

// ProtectedRoute component to handle route protection based on user authentication
const ProtectedRoute = ({ element }) => {
  const { user } = useUser();
  // Redirect to login if user is not authenticated
  return user ? element : <Navigate to="/teamMemberLogin" />;
};

// Define routes
const routes = createBrowserRouter([
  {
    path: "/ticketForm",
    element: <TicketForm />
  },
  {
    path: "/userpanel",
    element: <UserPanel />
  },
  {
    path: "/ticketstatus",
    element: <TicketStatus />
  },
  {
    path: "/tickets",
    element: <Ticket />
  },
  {
    path: "/newticketForm",
    element: <NewTicketForm />
  },
  {
    path: "/adminPanel",
    element: <AdminPanel /> 
  },
  {
    path: "/teamMemberLogin",
    element: <LoginPage />
  },
  // Apply ProtectedRoute to DashboardPage route
  {
    path: "/dashBoardPage",
    element: <ProtectedRoute element={<DashboardPage />} />
  },
  {
    path:"/registerPage",
    element:<RegisterPage/>
  }
]);

function App() {
  return (
    <UserProvider>  {/* Wrap everything inside UserProvider */}
      <div>
        <RouterProvider router={routes} />
      </div>
    </UserProvider>
  );
}

export default App;
