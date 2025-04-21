// src/Components/Auth/RedirectHandler.js
import React from "react";
import { Navigate } from "react-router-dom";

const RedirectHandler = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/homePage" replace /> : <Navigate to="/loginPage" replace />;
};

export default RedirectHandler;
