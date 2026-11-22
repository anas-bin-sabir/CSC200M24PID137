import React from "react";
import CardUI from "./CardUI.jsx";
import { dropHighlightClass } from "../utils/dropHighlight.js";

// Single Tableau Column Component. Drops are handled by the board (BoardView),
// which picks the column nearest the dragged card.
function TableauColumn({ column, colIndex, viewModel, highlight }) {
  const hintedCard = viewModel?.hint?.card;

  const pile = column.toArray ? column.toArray() : column; // if array, just use it

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
      className={`relative w-(--card-w) rounded-md sm:rounded-lg transition-colors ${
        dropHighlightClass(highlight) || "bg-blue-100/10"
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

// Main Tableau View. dropTarget is where a dragged card would land, if anywhere.
export default function TableauUI({ tableau, viewModel, dropTarget, ref }) {
  return (
    <div
      ref={ref}
      className="grid grid-cols-[repeat(7,var(--card-w))] gap-(--gap) items-start"
    >
      {tableau.columns.map((column, index) => (
        <TableauColumn
          key={index}
          column={column}
          colIndex={index}
          viewModel={viewModel}
          highlight={
            dropTarget?.type === "tableau" && dropTarget.col === index
              ? dropTarget.status
              : null
          }
        />
      ))}
    </div>
  );
}
