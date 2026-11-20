import React from "react";
import { useDragLayer } from "react-dnd";
import { CardArt } from "./CardUI.jsx";

// Follows the finger while dragging on touch screens. The HTML5 backend
// draws its own drag image, so this is only mounted with the touch backend.
export default function CardDragLayer() {
  const { item, isDragging, offset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    offset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !item || !offset) return null;

  const cards = item.cards?.length ? item.cards : [item.card];

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div
        className="relative"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className="absolute left-0 w-(--card-w) h-(--card-h) rounded-md sm:rounded-lg bg-white shadow-2xl"
            style={{ top: `calc(var(--fan-up) * ${i})` }}
          >
            <CardArt card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}
