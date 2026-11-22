// Classes for a pile while a dragged card is over it: green when the move
// is legal, red when it is not.
export function dropHighlightClass(highlight) {
  if (highlight === "valid") return "ring-2 ring-green-400 bg-green-400/30";
  if (highlight === "invalid") return "ring-2 ring-red-400/80 bg-red-500/25";
  return "";
}
