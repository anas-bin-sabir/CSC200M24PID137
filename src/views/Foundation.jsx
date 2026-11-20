import React from "react";
import CardUI from "./CardUI.jsx";
import { useDrop } from "react-dnd";

const SYMBOLS = ["♥", "♦", "♣", "♠"];

// One foundation pile. A separate component so useDrop is called at the top level.
function FoundationPile({ pile, index, viewModel }) {
  const hintedCard = viewModel?.hint?.card;
  const topCard = pile.isEmpty() ? null : pile.peek();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "CARD",
      drop: (item) => {
        if (item.source === "tableau") {
          viewModel.moveTableauToFoundation(item.fromCol);
        } else if (item.source === "waste") {
          viewModel.moveWasteToFoundation(item.card);
        }
      },
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [viewModel]
  );

  // Tap-to-move, step 2: tapping a foundation moves the selected card here
  const handleClick = () => {
    if (viewModel?.selection) viewModel.moveSelectionTo("foundation");
  };

  return (
    <div
      ref={drop}
      onClick={handleClick}
      className={`w-(--card-w) h-(--card-h) border-2 rounded-md sm:rounded-lg flex items-center justify-center transition-colors
        ${isOver ? "bg-green-200/40" : "bg-blue-900 border-gray-400"}
      `}
    >
      {topCard ? (
        <CardUI
          card={topCard}
          viewModel={viewModel}
          source="foundation"
          draggable={false}
          isHint={
            hintedCard &&
            hintedCard.suit === topCard.suit &&
            hintedCard.rank === topCard.rank
          }
        />
      ) : (
        <span className="opacity-50 text-[calc(var(--card-w)*0.4)]">
          {SYMBOLS[index]}
        </span>
      )}
    </div>
  );
}

export default function FoundationView({ foundation, viewModel }) {
  return (
    <>
      {foundation.piles.map((pile, index) => (
        <FoundationPile
          key={index}
          pile={pile}
          index={index}
          viewModel={viewModel}
        />
      ))}
    </>
  );
}
