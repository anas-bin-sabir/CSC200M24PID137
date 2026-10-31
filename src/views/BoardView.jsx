import React from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="h-[600px] w-full text-white font-poppins flex flex-row justify-center items-center py-8 px-10 gap-10">
      <div className="px-5 w-65 shrink-0">
        <Sidebar
          moves={state.moves}
          score={state.score}
          progress={state.progress}
          time={state.time}
          onNewGame={handleNewGame}
          onLeave={handleLeave}
        />
      </div>

      <div className="flex flex-col items-center grow w-full mx-auto p-8">
        <div className="flex justify-between items-start w-11/12 mb-16">
          <div className="flex gap-6">
            <StockView
              stock={state.stock.getStockCards()}
              viewModel={viewModel}
            />
            <WasteView waste={state.waste} viewModel={viewModel} />
          </div>
          <FoundationView foundation={state.foundation} viewModel={viewModel} />
        </div>

        <div className="w-full flex justify-center">
          <Tableau tableau={state.tableau} viewModel={viewModel} />
        </div>

        {state.errorMessage && (
          <div
            role="alert"
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 px-5 py-2 rounded-xl bg-red-700/90 text-white shadow-lg"
          >
            {state.errorMessage}
          </div>
        )}

        {/* Victory Modal */}
        {showVictoryModal && (
          <>
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              numberOfPieces={1000}
              gravity={0.7}
              recycle={true}
            />
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 shadow-xl text-center w-[400px] animate-pop">
                <h1 className="text-3xl font-bold mb-4 text-blue-700">
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
