import React from "react";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";
import Tableau from "./Tableau.jsx";
import FoundationView from "./Foundation.jsx";
import StockView from "./Stock.jsx";
import WasteView from "./Waste.jsx";
import Sidebar from "./Sidebar.jsx";
import Confetti from "react-confetti";

export default function BoardView({ viewModel }) {
  const [state, setState] = React.useState(viewModel.getState());
  const [showVictoryModal, setShowVictoryModal] = React.useState(false);
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  // Attach setState once
  React.useEffect(() => {
    viewModel.setState = setState;
  }, [viewModel]);

  // Hook up victory callback
  React.useEffect(() => {
    viewModel.onVictory = () => {
      setShowVictoryModal(true);
    };
  }, [viewModel]);

  const handleNewGame = () => {
    viewModel.startNewGame();
    setShowVictoryModal(false);
  };

  const handleLeave = () => {
    if (window.confirm("Are you sure you want to leave the game?")) {
      navigate("/leave");
    }
  };

  return (
    <div className="w-full text-white font-poppins flex flex-col lg:flex-row justify-center items-center lg:items-start gap-3 lg:gap-8 px-2 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8">
      <div className="w-full max-w-xl lg:w-64 lg:max-w-none shrink-0">
        <Sidebar
          moves={state.moves}
          score={state.score}
          progress={state.progress}
          time={state.time}
          onNewGame={handleNewGame}
          onLeave={handleLeave}
        />
      </div>

      <div className="flex flex-col items-center gap-3 sm:gap-6 lg:gap-10">
        {/* Same 7-column grid as the tableau, so the piles line up */}
        <div className="grid grid-cols-[repeat(7,var(--card-w))] gap-(--gap)">
          <StockView stock={state.stock.getStockCards()} viewModel={viewModel} />
          <WasteView
            waste={state.waste}
            viewModel={viewModel}
            selectedCard={state.selectedCard}
          />
          <div aria-hidden="true" />
          <FoundationView foundation={state.foundation} viewModel={viewModel} />
        </div>

        <Tableau
          tableau={state.tableau}
          viewModel={viewModel}
          selectedCard={state.selectedCard}
        />

        {state.errorMessage && (
          <div
            role="alert"
            className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 max-w-[90vw] text-center px-5 py-2 rounded-xl bg-red-700/90 text-white shadow-lg"
          >
            {state.errorMessage}
          </div>
        )}

        {/* Victory Modal */}
        {showVictoryModal && (
          <>
            <Confetti
              width={width}
              height={height}
              numberOfPieces={width < 640 ? 300 : 1000}
              gravity={0.7}
              recycle={true}
            />
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl text-center w-full max-w-sm animate-pop">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700">
                  Congratulations!
                </h1>
                <p className="text-gray-600 mb-6">
                  You’ve successfully completed the game.
                </p>
                <button
                  onClick={handleNewGame}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Start New Game
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
