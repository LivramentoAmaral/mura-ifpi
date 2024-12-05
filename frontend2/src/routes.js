import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import AdminPage from "./components/admin/AdminPage";
import FullScreenCarousel from './components/FullScrem/FullScreenCarousel';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminPage />} />
        <Route path="/apresentar" element={<FullScreenCarousel />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
