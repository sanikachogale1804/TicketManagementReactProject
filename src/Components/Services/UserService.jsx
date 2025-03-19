const Api_link="http://localhost:8080/users"

export const getUsers = () => {
    return fetch(Api_link)
      .then((response) => response.json())
      .then(data=>data);
  };
 
  export const registerUser = (user) => {
    return fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
      credentials: 'include',  // Include cookies in the request (if needed)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          return data; // Return user object or success message if registration is successful
        } else {
          throw new Error('Registration failed');
        }
      })
      .catch((error) => {
        console.error('Error registering user:', error);
        throw error; // Return the error for further handling
      });
  };

  export const loginUser = (user) => {
    return fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();  // Assuming the response returns the JWT token
      })
      .then((data) => {
        return data;  // Return the data (e.g., token or success message)
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        throw error;  // Return the error for further handling
      });
  };
  