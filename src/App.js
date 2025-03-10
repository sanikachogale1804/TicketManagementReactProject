import logo from './logo.svg';
import './App.css';
import UserPanel from './Components/User/UserPanel';
import TicketForm from './Components/User/TicketForm';
import TicketStatus from './Components/User/TicketStatus';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Ticket from './Components/Tickets/Ticket';
import NewTicketForm from './Components/Tickets/NewTicketForm';


const routes=createBrowserRouter([
  {
    path:"/ticketForm",
    element:<TicketForm/>
  },
  {
    path:"/userpanel",
    element:<UserPanel/>
  },
  {
    path:"/ticketstatus",
    element:<TicketStatus/>
  },
  {
    path:"/tickets",
    element:<Ticket/>
  },
  {
    path:"/newticketForm",
    element:<NewTicketForm/>
  }
])

function App() {
  return (
    <div>
      <RouterProvider router={routes}/>
    </div>
  );
}

export default App;
