import React from "react";
import CardUI from "./CardUI.jsx";
import { useDrop } from "react-dnd";

// Single Tableau Column Component
function TableauColumn({ column, colIndex, viewModel }) {
  const hintedCard = viewModel?.hint?.card;

  const pile = column.toArray ? column.toArray() : column; // if array, just use it

  const handleDropCard = (item) => {
    if (item.source === "tableau") {
      viewModel.moveTableauToTableau(
        item.fromCol,
        colIndex,
        item.cards?.length || 1
      );
    } else if (item.source === "waste") {
      viewModel.moveWasteToTableau(colIndex, item.card);
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CARD",
    drop: handleDropCard,
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  return (
    <div
      ref={drop}
      className={`relative min-h-[280px] w-[120px] p-1 transition-colors ${
        isOver ? "bg-blue-200/30" : "bg-blue-100/10"
      }`}
    >
      {pile.map((card, i) => {
        const stack = pile.slice(i).filter((c) => c.faceUp); // only face-up cards
        return (
          <div
            key={i}
            className="absolute transition-transform duration-200 hover:-translate-y-1"
            style={{ top: `${i * 17}px` }}
          >
            <CardUI
              card={card}
              columnIndex={colIndex}
              viewModel={viewModel}
              stack={stack}
              source="tableau"
              isHint={
                hintedCard &&
                hintedCard.suit === card.suit &&
                hintedCard.rank === card.rank
              }
            />
          </div>
        );
      })}
    </div>
  );
}

// Main Tableau View
export default function TableauUI({ tableau, viewModel }) {
  return (
    <div className="flex gap-5 px-7 py-2 justify-center">
      {tableau.columns.map((column, index) => (
        <TableauColumn
          key={index}
          column={column}
          colIndex={index}
          viewModel={viewModel}
        />
      ))}
    </div>
  );
}
