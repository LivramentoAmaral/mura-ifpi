import React from "react";
import style from "./Navbar.css"; // Importando o arquivo de estilo

const Navbar_tudo = () => {
  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>
      <div className={style.navbar_title}>
        <div className={style.title_container}>
   {/* <a className="custom-link home_nave" href="/">Mural</a> */}

          <a className={`${style.agendar} custom-link`} href="/agendar">AGENDAR</a>
        </div>

      </div>
    </nav>
  );
};

export default Navbar_tudo;
