import React from "react";
import CardUI from "./CardUI.jsx";
import { dropHighlightClass } from "../utils/dropHighlight.js";

const SYMBOLS = ["♥", "♦", "♣", "♠"];

// One foundation pile. Drops are handled by the board (BoardView).
function FoundationPile({ pile, index, viewModel, highlight }) {
  const hintedCard = viewModel?.hint?.card;
  const topCard = pile.isEmpty() ? null : pile.peek();

  return (
    <div
      className={`w-(--card-w) h-(--card-h) border-2 rounded-md sm:rounded-lg flex items-center justify-center transition-colors
        ${dropHighlightClass(highlight) || "bg-blue-900"} border-gray-400
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

// highlight applies to all four piles: the game picks the right one by suit
export default function FoundationView({ foundation, viewModel, highlight }) {
  return (
    <>
      {foundation.piles.map((pile, index) => (
        <FoundationPile
          key={index}
          pile={pile}
          index={index}
          viewModel={viewModel}
          highlight={highlight}
        />
      ))}
    </>
  );
}
