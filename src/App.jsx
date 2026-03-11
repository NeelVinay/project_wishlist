import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import DataVizPage from "./pages/DataVizPage";
import WishlistApp from "./pages/WishlistApp";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<WishlistApp />} />
        <Route path="/visualize" element={<DataVizPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}
