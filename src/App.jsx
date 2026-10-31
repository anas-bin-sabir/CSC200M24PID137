import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/HomePage.jsx";

// Loaded on demand, so the card images only download when a game starts
const GamePage = lazy(() => import("./views/GamePage.jsx"));
const LeavePage = lazy(() => import("./views/LeavePage.jsx"));
const RulesPage = lazy(() => import("./views/RulesPage.jsx"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/rules" element={<RulesPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
