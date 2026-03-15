import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import VizGalleryPage from "./pages/VizGalleryPage";
import VizViewerPage from "./pages/VizViewerPage";
import GamifyGalleryPage from "./pages/GamifyGalleryPage";
import GamifyViewerPage from "./pages/GamifyViewerPage";
import WishlistApp from "./pages/WishlistApp";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<WishlistApp />} />
        <Route path="/visualize" element={<VizGalleryPage />} />
        <Route path="/visualize/:vizId" element={<VizViewerPage />} />
        <Route path="/gamify" element={<GamifyGalleryPage />} />
        <Route path="/gamify/:gameId" element={<GamifyViewerPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}
