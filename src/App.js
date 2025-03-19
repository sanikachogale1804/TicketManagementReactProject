import './App.css';
import UserPanel from './Components/User/UserPanel';
import TicketForm from './Components/User/TicketForm';
import TicketStatus from './Components/User/TicketStatus';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Ticket from './Components/Tickets/Ticket';
import NewTicketForm from './Components/Tickets/NewTicketForm';
import AdminPanel from './Components/Tickets/AdminPanel';

import RegisterPage from './Components/User/RegisterPage';
import LoginPage from './Components/User/LoginPage';


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
    path: "/registerPage",
    element: <RegisterPage />
  },
  {
    path:"/loginPage",
    element:<LoginPage/>
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
