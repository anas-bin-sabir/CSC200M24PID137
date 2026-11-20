import React, { useMemo } from "react";
import * as deck from "@letele/playing-cards";
import { useDrag } from "react-dnd";

// Card graphics. Asset names look like "Ha", "S10", "Dk": suit initial + rank
export function CardArt({ card }) {
  const key = card.suit?.[0]?.toUpperCase() + card.rank?.toLowerCase();
  const Comp = card.faceUp ? deck[key] : deck.B1;

  if (!Comp) {
    console.warn("Missing card asset for:", key);
    return null;
  }
  return <Comp style={{ width: "100%", height: "100%" }} />;
}

export default function CardUI({
  card,
  columnIndex,
  viewModel,
  stack = [card],
  source = "tableau",
  isHint = false,
  isSelected = false,
  draggable = true,
}) {
  // Hooks must run on every render, so the null check comes after them.
  const dragItem = useMemo(() => {
    if (!card?.faceUp || !draggable) return null;
    return { type: "CARD", card, cards: stack, fromCol: columnIndex, source };
  }, [card, stack, columnIndex, source, draggable]);

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

  if (!card) return null;

  // Tap-to-move, step 1: select a card. When another card is already
  // selected, a tap here lets the click reach the pile, which moves it.
  const handleClick = (e) => {
    if (!viewModel || !dragItem) return;
    const sel = viewModel.selection;

    if (sel?.card === card) {
      e.stopPropagation();
      viewModel.clearSelection();
      viewModel.updateState();
      return;
    }

    const sameColumn = sel?.source === "tableau" && sel.fromCol === columnIndex;
    if (sel && source === "tableau" && !sameColumn) return;

    e.stopPropagation();
    viewModel.selectCard(card, {
      source,
      fromCol: columnIndex,
      count: stack.length,
    });
    viewModel.updateState();
  };

  // Render
  return (
    <div
      ref={dragRef}
      onClick={handleClick}
      className={`
      card w-(--card-w) h-(--card-h) rounded-md sm:rounded-lg select-none transition-all duration-200
      ${
        isHint
          ? "ring-2 sm:ring-4 ring-yellow-400 ring-offset-1 sm:ring-offset-2 ring-offset-black card-hint-jump"
          : ""
      }
      ${isDragging ? "opacity-50 scale-105" : ""}
      ${card.faceUp ? "cursor-pointer hover:scale-105" : "cursor-default"}
      bg-white
    `}
      style={{
        // Only draggable cards block scrolling; touching others still scrolls the page
        touchAction: dragItem ? "none" : "auto",
        boxShadow: isSelected ? "0 0 12px 4px rgba(255,255,0,0.8)" : "none",
      }}
    >
      <CardArt card={card} />
    </div>
  );
}
