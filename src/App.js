import './App.css';
import UserPanel from './Components/User/UserPanel';
import TicketForm from './Components/User/TicketForm';
import TicketStatus from './Components/User/TicketStatus';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
    path: "/registerPage",
    element: <RegisterPage />
  },
  {
    path:"/adminPanel",
    element:<AdminPanel/>
  },
  {
    path:"/loginPage",
    element:<LoginPage/>
  },
  {
    path:"/customerTickets",
    element:<CustomerTickets/>
  },
  {
    path:"/ticketSearch",
    element:<TicketSearch/>
  },
  {
    path:"/customerInterface",
    element:<CustomerInterface/>
  },
  {
    path:"/homePage",
    element:<HomePage/>
  },
  {
    path:"/teamMemberDashboard",
    element:<TeamMemberDashboard/>
  },
  {
    path:"/loginUserDashboard",
    element:<LoggedinUserDashboard/>
  },
  {
    path:"/calendarDashboard",
    element:<CalendarDashboard/>
  }
]);

function App() {
  return (
    // <UserProvider>  {/* Wrap everything inside UserProvider to manage user state */}
      <div>
        <RouterProvider router={routes} />
      </div>
    // {/* </UserProvider> */}
  );
}

export default App;
