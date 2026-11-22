import React from "react";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";
import { useDrop } from "react-dnd";
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

  // Where a dragged card would land: { type, col?, status: "valid" | "invalid" }
  const [dropTarget, setDropTarget] = React.useState(null);
  const topRowRef = React.useRef(null);
  const tableauRef = React.useRef(null);

  // The whole board is one drop zone. A drop goes to the pile nearest the
  // dragged card, so on small screens it doesn't have to land exactly on a
  // narrow pile; dropping in a gap or below a column still counts.
  const findTarget = (item, monitor) => {
    const offset = monitor.getSourceClientOffset(); // dragged card's top-left
    const topRow = topRowRef.current;
    const tableau = tableauRef.current;
    if (!offset || !topRow || !tableau) return null;

    const columns = [...tableau.children].map((el) => el.getBoundingClientRect());
    const cardW = columns[0].width;
    const cardH = cardW * 1.5;
    const x = offset.x + cardW / 2; // centre of the dragged card
    const y = offset.y + cardH / 2;

    // Index of the pile whose centre is horizontally closest, within a card width
    const nearest = (rects) => {
      let best = -1;
      let bestDist = cardW;
      rects.forEach((r, i) => {
        const dist = Math.abs(r.left + r.width / 2 - x);
        if (dist <= bestDist) {
          best = i;
          bestDist = dist;
        }
      });
      return best;
    };

    const rowRect = topRow.getBoundingClientRect();
    const boundary = (rowRect.bottom + tableau.getBoundingClientRect().top) / 2;

    if (y < boundary) {
      if (y < rowRect.top - cardH / 2) return null; // well above the board
      // Top row slots: stock, waste, spacer, then the four foundations
      const slots = [...topRow.children].map((el) => el.getBoundingClientRect());
      return nearest(slots) >= 3 ? { type: "foundation" } : null;
    }

    const col = nearest(columns);
    if (col === -1) return null;
    if (item.source === "tableau" && item.fromCol === col) return null; // its own column
    return { type: "tableau", col };
  };

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: "CARD",
      hover: (item, monitor) => {
        const t = findTarget(item, monitor);
        const next = t && {
          ...t,
          status: viewModel.canMoveTo(item, t) ? "valid" : "invalid",
        };
        // Only re-render when the target actually changes
        setDropTarget((prev) =>
          prev?.type === next?.type &&
          prev?.col === next?.col &&
          prev?.status === next?.status
            ? prev
            : next
        );
      },
      drop: (item, monitor) => {
        const t = findTarget(item, monitor);
        setDropTarget(null);
        if (t) viewModel.moveTo(item, t);
      },
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [viewModel]
  );
  const activeTarget = isOver ? dropTarget : null;

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
    <div
      ref={dropRef}
      className="w-full min-h-[calc(100dvh-4.5rem)] sm:min-h-[calc(100dvh-6rem)] text-white font-poppins flex flex-col lg:flex-row justify-start lg:justify-center items-center lg:items-start gap-3 lg:gap-8 px-2 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8"
    >
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
        <div
          ref={topRowRef}
          className="grid grid-cols-[repeat(7,var(--card-w))] gap-(--gap)"
        >
          <StockView stock={state.stock.getStockCards()} viewModel={viewModel} />
          <WasteView waste={state.waste} viewModel={viewModel} />
          <div aria-hidden="true" />
          <FoundationView
            foundation={state.foundation}
            viewModel={viewModel}
            highlight={activeTarget?.type === "foundation" ? activeTarget.status : null}
          />
        </div>

        <Tableau
          ref={tableauRef}
          tableau={state.tableau}
          viewModel={viewModel}
          dropTarget={activeTarget}
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
