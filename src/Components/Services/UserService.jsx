const Api_link="http://localhost:8080/users"

export const getUsers = () => {
    return fetch(Api_link)
      .then((response) => response.json())
      .then(data=>data);
  };

  