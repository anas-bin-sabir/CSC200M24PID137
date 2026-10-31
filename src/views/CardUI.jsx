import React, { useMemo, useEffect } from "react";
import * as deck from "@letele/playing-cards";
import { useDrag } from "react-dnd";

export default function CardUI({
  card,
  columnIndex,
  viewModel,
  stack = [card],
  source = "tableau",
  isHint = false,
}) {
  // Hooks must run on every render, so the null check comes after them.
  const dragItem = useMemo(() => {
    if (!card?.faceUp) return null;
    return { type: "CARD", card, cards: stack, fromCol: columnIndex, source };
  }, [card, stack, columnIndex, source]);

  // Enable dragging
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "CARD",
      item: dragItem,
      canDrag: !!dragItem,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [dragItem]
  );

  // Automatically select the dragged card
  useEffect(() => {
    if (isDragging && card?.faceUp) {
      viewModel?.selectCard(card);
    }
  }, [isDragging, card, viewModel]);

  if (!card) return null;

  const handleClick = () => {
    if (!card.faceUp) return;
    viewModel?.selectCard(card);
  };

  // Card graphics
  // Asset names look like "Ha", "S10", "Dk": suit initial + rank
  const key = card.suit?.[0]?.toUpperCase() + card.rank?.toLowerCase();
  const Comp = deck[key];
  const Back = deck.B1;

  if (!Comp || !Back) {
    console.warn("Missing card asset for:", key);
    return null;
  }

  // Render
  return (
    <div
      ref={dragRef}
      onClick={handleClick}
      className={`
      w-30 h-45 rounded-lg select-none transition-all duration-200
      ${
        isHint
          ? "ring-4 ring-yellow-400 ring-offset-2 ring-offset-black card-hint-jump"
          : ""
      }
      ${isDragging ? "opacity-50 scale-105" : ""}
      ${card.faceUp ? "cursor-pointer hover:scale-105" : "cursor-default"}
      bg-white
    `}
      style={{
        touchAction: "none",
        boxShadow:
          viewModel?.selectedCard === card
            ? "0 0 12px 3px rgba(255,255,0,0.6)"
            : "none",
      }}
    >
      {card.faceUp ? (
        <Comp style={{ width: "100%", height: "100%" }} />
      ) : (
        <Back style={{ width: "100%", height: "100%" }} />
      )}
    </div>
  );
}
