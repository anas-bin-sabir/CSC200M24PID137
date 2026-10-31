import {
  isValidSequence,
  canPlaceOnDestination,
  findFoundationIndex,
} from "./gameRules.js";
import Queue from "../models/data structures/Queue.js";

// Top card of any pile (List, Stack and Queue all implement toArray)
function getTopCard(pile) {
  const cards = pile.toArray();
  return cards.length > 0 ? cards[cards.length - 1] : null;
}

// Helper to insert cards into destination
export function insertCards(dest, cards) {
  if (!cards || cards.length === 0) return;

  if (dest.insertAtEnd) {
    cards.forEach((c) => dest.insertAtEnd(c));
  } else if (dest.push) {
    cards.forEach((c) => dest.push(c));
  } else if (dest.enqueue) {
    cards.forEach((c) => dest.enqueue(c));
  } else if (Array.isArray(dest)) {
    cards.forEach((c) => dest.push(c));
  } else {
    console.error("Unsupported destination structure:", dest);
  }
}

// Rule-specific wrappers for readability
export function moveTableauToTableau(fromCol, toCol, numCards) {
  return moveCards(
    fromCol,
    toCol,
    (movingCards, destTop) => {
      // Validate sequence + destination placement
      return (
        isValidSequence(movingCards) &&
        canPlaceOnDestination(movingCards[0], destTop)
      );
    },
    numCards
  );
}

export function moveTableauToFoundation(fromCol, foundation) {
  const movingCard = fromCol.getTopNodes(1)[0]?.data || fromCol.peek();

  const destIndex = findFoundationIndex(movingCard, foundation);

  if (destIndex === -1) {
    return { success: false };
  }

  const destPile = foundation.piles[destIndex];
  return moveCards(fromCol, destPile, () => true);
}

export function moveWasteToFoundation(waste, foundation, selectedCard = null) {
  if (!waste || waste.isEmpty()) {
    return { success: false };
  }

  // Use the selected card if provided, otherwise default to top
  const movingCard = selectedCard || waste.peek();
  // Find the correct foundation pile for this card
  const destIndex = findFoundationIndex(movingCard, foundation);
  if (destIndex === -1) return { success: false };

  const destPile = foundation.piles[destIndex];

  // Call moveCards with the selected card
  return moveCards(waste, destPile, () => true, 1, movingCard);
}

export function moveWasteToTableau(waste, tableau, colIndex, selectedCard) {
  const dest = tableau.columns[colIndex];
  return moveCards(
    waste,
    dest,
    (movingCards, destTop) => canPlaceOnDestination(movingCards[0], destTop),
    1, // numCards
    selectedCard
  );
}

export function moveCards(
  source,
  dest,
  validateFn,
  numCards = 1,
  selectedCard = null
) {
  if (!source || source.isEmpty()) return { success: false };

  let movingCards = [];
  const allCards = source.toArray();

  // Determine which cards to move
  if (source instanceof Queue) {
    // Move only the user-selected visible card
    if (!selectedCard) return { success: false };
    const cardIndex = allCards.findIndex(
      (c) => c.suit === selectedCard.suit && c.rank === selectedCard.rank
    );
    if (cardIndex === -1) return { success: false };
    movingCards = [allCards[cardIndex]];
  } else if (selectedCard) {
    // Tableau: move selected card + all above
    const index = allCards.findIndex(
      (c) => c.suit === selectedCard.suit && c.rank === selectedCard.rank
    );
    if (index === -1) return { success: false };
    movingCards = allCards.slice(index);
  } else if (source.getTopNodes) {
    // For linked-list tableau columns
    movingCards = source.getTopNodes(numCards).map((n) => n.data || n);
  } else {
    // Default: move top card
    movingCards = [source.peek()];
  }

  // Validate the move before proceeding
  const destTop = getTopCard(dest);
  if (!validateFn(movingCards, destTop)) return { success: false };

  // Remove from source
  if (source instanceof Queue) {
    source.removeCard(selectedCard); // remove specific one
  } else if (typeof source.deleteTopNodes === "function") {
    source.deleteTopNodes(numCards);
  } else if (typeof source.pop === "function") {
    for (let i = 0; i < numCards; i++) source.pop();
  }

  // Insert into destination pile
  insertCards(dest, movingCards);

  // Turn over the newly exposed card
  flipLastCardIfFaceDown(source);

  return {
    success: true,
    movedCount: movingCards.length,
    cards: movingCards,
    from: source.name || "unknown",
    to: dest.name || "unknown",
  };
}

function flipLastCardIfFaceDown(pile) {
  const card = getTopCard(pile);
  if (card) card.faceUp = true;
}
