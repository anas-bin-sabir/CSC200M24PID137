import React from "react";
import CardUI from "./CardUI.jsx";
import { useDrop } from "react-dnd";

// Single Tableau Column Component
function TableauColumn({ column, colIndex, viewModel, selectedCard }) {
  const hintedCard = viewModel?.hint?.card;

  const pile = column.toArray ? column.toArray() : column; // if array, just use it

  const handleDropCard = (item) => {
    if (item.source === "tableau") {
      if (item.fromCol === colIndex) return; // dropped back where it started
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

  // Tap-to-move, step 2: tapping a column moves the selected card(s) here
  const handleClick = () => {
    if (viewModel?.selection) viewModel.moveSelectionTo("tableau", colIndex);
  };

  // Face-down cards are fanned less than face-up ones, whose rank must show.
  // Offsets are CSS expressions so they scale with the card size.
  let down = 0;
  let up = 0;
  const tops = pile.map((card) => {
    const top = `calc(var(--fan-down) * ${down} + var(--fan-up) * ${up})`;
    if (card.faceUp) up++;
    else down++;
    return top;
  });
  const lastTop = tops[tops.length - 1] ?? "0px";

  return (
    <div
      ref={drop}
      onClick={handleClick}
      className={`relative w-(--card-w) rounded-md sm:rounded-lg transition-colors ${
        isOver ? "bg-blue-200/30" : "bg-blue-100/10"
      }`}
      style={{ height: `calc(${lastTop} + var(--card-h))` }}
    >
      {pile.map((card, i) => {
        const stack = pile.slice(i).filter((c) => c.faceUp); // only face-up cards
        return (
          <div
            key={i}
            className="absolute left-0 transition-transform duration-200 hover:-translate-y-1"
            style={{ top: tops[i] }}
          >
            <CardUI
              card={card}
              columnIndex={colIndex}
              viewModel={viewModel}
              stack={stack}
              source="tableau"
              isSelected={card === selectedCard}
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
export default function TableauUI({ tableau, viewModel, selectedCard }) {
  return (
    <div className="grid grid-cols-[repeat(7,var(--card-w))] gap-(--gap) items-start">
      {tableau.columns.map((column, index) => (
        <TableauColumn
          key={index}
          column={column}
          colIndex={index}
          viewModel={viewModel}
          selectedCard={selectedCard}
        />
      ))}
    </div>
  );
}
