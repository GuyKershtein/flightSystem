import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { HomeLayout } from "./components/HomeLayout";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { AdminLayout } from "./components/AdminLayout";
import "./styles.css";
import SearchFlightsPage from "./pages/SearchFlightsPage";
import UserManagePage from "./pages/UserManagePage";
import FlightManagePage from "./pages/FlightManagePage";

function App() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<LoginPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="users" element={<UserManagePage />} />
        <Route path="flights" element={<FlightManagePage />} />
      </Route>

      <Route path="/dashboard" element={<ProtectedLayout />}>
        <Route path="search" element={<SearchFlightsPage />} />
      </Route>
    </Routes>
    );
}

export default App;