import React from "react";
import CardUI from "./CardUI";

export default function WasteView({ waste, viewModel }) {
  const hintedCard = viewModel?.hint?.card;

  const visibleCards = waste.slice(-3);

  return (
    <div className="relative w-30 h-45">
      {waste.length === 0 && (
        <div className="w-full h-full border-2 border-gray-400 rounded-lg bg-blue-900/60 flex items-center justify-center">
          <span className="text-gray-300 text-3xl">🂠</span>
        </div>
      )}

      {visibleCards.map((card, index) => (
        // Dragging is handled by CardUI (source="waste")
        <div
          key={`${card.suit}-${card.rank}`}
          className="absolute transition-transform duration-300 cursor-pointer"
          style={{ left: `${index * 27}px`, zIndex: 100 + index }}
        >
          <CardUI
            card={card}
            viewModel={viewModel}
            source="waste"
            draggable={index === visibleCards.length - 1}
            isHint={
              hintedCard &&
              hintedCard.suit === card.suit &&
              hintedCard.rank === card.rank
            }
          />
        </div>
      ))}
    </div>
  );
}
