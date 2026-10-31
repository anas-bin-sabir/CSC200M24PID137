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

  return (
    <div
      ref={drop}
      className={`w-30 h-45 border-2 rounded-lg flex items-center justify-center transition-colors
        ${isOver ? "bg-green-200/40" : "bg-blue-900 border-gray-400"}
      `}
    >
      {topCard ? (
        <CardUI
          card={topCard}
          viewModel={viewModel}
          source="foundation"
          isHint={
            hintedCard &&
            hintedCard.suit === topCard.suit &&
            hintedCard.rank === topCard.rank
          }
        />
      ) : (
        <span className="opacity-50 text-5xl">{SYMBOLS[index]}</span>
      )}
    </div>
  );
}

export default function FoundationView({ foundation, viewModel }) {
  return (
    <div className="flex gap-6">
      {foundation.piles.map((pile, index) => (
        <FoundationPile
          key={index}
          pile={pile}
          index={index}
          viewModel={viewModel}
        />
      ))}
    </div>
  );
}
