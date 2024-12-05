import React from "react";
import style from"./Navbar.css"; // Importando o arquivo de estilo

const Navbar = () => {
  return (
    <nav className="navbar">
     
      <div className="navbar-logo">
      <img src="/logo.png" alt="Logo" className="logo" />
      </div>
      <div className={style.navbar_title}>
        <h2>Mural</h2>
      </div>
    </nav>
  );
};

export default Navbar;
