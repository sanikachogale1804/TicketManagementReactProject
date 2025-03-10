import { data } from "react-router-dom";

const API_LINK = "http://localhost:8080/tickets";

export const getTickets = () => {
    return fetch(API_LINK)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched tickets:', data); // Log the fetched data for debugging
        return data["_embedded"]["tickets"] || []; // Ensure that we return an empty array if no tickets are found
      })
      .catch((error) => {
        console.error('Error fetching tickets:', error);
        return []; // Return an empty array in case of an error
      });
  };

  
  export const addTickets=(ticket)=>{
    return fetch(API_LINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ticket)
      }).then(data=>data.json()).then(data=>data)
      
}

