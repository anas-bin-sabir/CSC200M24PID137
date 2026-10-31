import React, { useEffect, useState } from "react";
import GameViewModel from "../viewModels/GameViewModel.js";
import Header from "./Header.jsx";
import BoardView from "./BoardView.jsx";

// Owns the game for as long as the /game route is shown: a new game (and clock)
// starts on entering the page and the clock stops on leaving it.
export default function GamePage() {
  const [viewModel, setViewModel] = useState(null);

  useEffect(() => {
    // BoardView connects its own setState once it mounts
    const vm = new GameViewModel(() => {});
    vm.startNewGame();
    setViewModel(vm);
    return () => vm.dispose();
  }, []);

  if (!viewModel) return <div className="text-white">Loading...</div>;

  return (
    <>
      <Header viewModel={viewModel} />
      <BoardView viewModel={viewModel} />
    </>
  );
}
