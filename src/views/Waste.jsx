import React from "react";
import CardUI from "./CardUI";

export default function WasteView({ waste, viewModel }) {
  const hintedCard = viewModel?.hint?.card;

  const visibleCards = waste.slice(-3);

  return (
    <div className="relative w-(--card-w) h-(--card-h)">
      {waste.length === 0 && (
        <div className="w-full h-full border-2 border-gray-400 rounded-md sm:rounded-lg bg-blue-900/60 flex items-center justify-center">
          <span className="text-gray-300 text-[calc(var(--card-w)*0.3)]">🂠</span>
        </div>
      )}

      {visibleCards.map((card, index) => (
        // Dragging is handled by CardUI (source="waste")
        <div
          key={`${card.suit}-${card.rank}`}
          className="absolute top-0 transition-transform duration-300 cursor-pointer"
          // Fanned into the gap beside the pile, scaled with the card size
          style={{ left: `calc(var(--card-w) * ${index * 0.22})`, zIndex: 100 + index }}
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
