// Navbar.js
import React from "react";
import "./Navbar.css"; // Estilos personalizados

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/path/to/logo.png" alt="Logo" className="logo" />
      </div>
      <div className="navbar-title">
        <h1>Mural</h1>
      </div>
    </nav>
  );
};

export default Navbar;
