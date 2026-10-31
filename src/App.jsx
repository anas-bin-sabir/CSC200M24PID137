import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameViewModel from "./viewModels/GameViewModel.js";
import BoardView from "./views/BoardView.jsx";
import Header from "./views/Header.jsx";
import LeavePage from "./views/LeavePage.jsx";
import RulesPage from "./views/RulesPage.jsx";
import Home from "./views/HomePage.jsx";

function App() {
  const [viewModel, setViewModel] = useState(null);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    const vm = new GameViewModel(setGameState); // Game view model
    vm.startNewGame();
    setViewModel(vm);
    return () => vm.dispose(); // stop the game clock
  }, []);

  if (!viewModel || !gameState)
    return <div className="text-white">Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Home / Game Board */}
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/game"
          element={
            <>
              <Header viewModel={viewModel} />
              <BoardView viewModel={viewModel} />
            </>
          }
        />
        {/* Leave Page */}
        <Route path="/leave" element={<LeavePage />} />
        <Route path="/rules" element={<RulesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
