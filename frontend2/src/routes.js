import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import AdminPage from "./pages/admin/AdminPage";
import FullScreenCarousel from './pages/FullScrem/FullScreenCarousel';
import Agendar from "./pages/agendas/agenda";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<AdminPage />} />
        <Route path="/apresentar" element={<FullScreenCarousel />} />
        <Route path="/agendar" element={<Agendar />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
