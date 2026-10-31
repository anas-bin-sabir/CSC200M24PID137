import Card from "../models/domain/Card.js";
import Deck from "../models/domain/Deck.js";
import Tableau from "../models/domain/Tableau.js";
import Foundation from "../models/domain/Foundation.js";
import Stock from "../models/domain/Stock.js";
import Stack from "../models/data structures/Stack.js";

import {
  moveTableauToTableau,
  moveTableauToFoundation,
  moveWasteToTableau,
  moveWasteToFoundation,
} from "../utils/moveHelpers.js";
import { rankValue, canPlaceOnDestination } from "../utils/gameRules.js";

export default class GameController {
  constructor(onUpdate) {
    this.onUpdate = onUpdate;
    this.timer = null;
    this.resetGame();
  }

  /* ----------------- CORE INITIALIZATION ----------------- */

  resetGame() {
    this.deck = new Deck();
    this.deck.shuffle();

    this.tableau = new Tableau();
    this.tableau.deal(this.deck);

    this.foundation = new Foundation();
    this.stock = new Stock(this.deck);

    this.moves = 0;
    this.score = 0;
    this.time = 0;

    // History stacks; the initial state is the first undo entry
    this.undoStack = new Stack();
    this.redoStack = new Stack();
    this.undoStack.push(this.getSnapshot());
  }

  startNewGame() {
    this.resetGame();
    this.startTimer();
  }

  startTimer() {
    // Clear previous interval if it exists
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.time++;

      // Trigger UI update
      if (this.onUpdate) this.onUpdate(this.getState());
    }, 1000);
  }

  stopTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  /* ----------------- STATE SNAPSHOTS ----------------- */

  // Capture a deep clone of the game state
  getSnapshot() {
    return {
      deck: this.deck.toJSON(),
      tableau: this.tableau.toJSON(),
      foundation: this.foundation.toJSON(),
      stock: this.stock.toJSON(),
      moves: this.moves,
      score: this.score,
    };
  }

  restoreSnapshot(snapshot) {
    if (!snapshot) return false;
    this.deck = Deck.fromJSON(snapshot.deck);
    this.tableau = Tableau.fromJSON(snapshot.tableau);
    this.foundation = Foundation.fromJSON(snapshot.foundation);
    this.stock = Stock.fromJSON(snapshot.stock);
    this.moves = snapshot.moves;
    this.score = snapshot.score;
    return true;
  }

  // Return current full state (for UI rendering)
  getState() {
    return {
      tableau: this.tableau,
      foundation: this.foundation,
      stock: this.stock,
      waste: this.stock.getWasteCards(),
      deck: this.deck,
    };
  }

  /* ----------------- MOVE RECORDING ----------------- */

  // Called after a successful move: update counters, then save the new state
  // so undo can return to it.
  recordMove(move) {
    this.moves++;

    if (move.type === "TABLEAU_TO_TABLEAU") this.score += 5;
    else if (move.type === "TABLEAU_TO_FOUNDATION") this.score += 10;
    else if (move.type === "WASTE_TO_TABLEAU") this.score += 5;
    else if (move.type === "WASTE_TO_FOUNDATION") this.score += 10;

    this.undoStack.push(this.getSnapshot());
    this.redoStack.clear(); // a new move invalidates the redo history
  }

  /* ----------------- MOVE ACTIONS ----------------- */

  moveTableauToFoundation(colIndex) {
    const from = this.tableau.columns[colIndex];
    const result = moveTableauToFoundation(from, this.foundation);

    if (result.success) {
      this.recordMove({
        type: "TABLEAU_TO_FOUNDATION",
        cards: result.cards,
        from,
        to: result.to,
      });

      // Check victory
      if (this.checkVictory()) {
        if (this.onGameWin) this.onGameWin();
      }
    }

    return result.success;
  }

  moveTableauToTableau(fromCol, toCol, numCards) {
    const from = this.tableau.columns[fromCol];
    const to = this.tableau.columns[toCol];
    const result = moveTableauToTableau(from, to, numCards);

    if (result.success) {
      this.recordMove({
        type: "TABLEAU_TO_TABLEAU",
        cards: result.cards,
        from,
        to,
        numCards,
      });
    }

    // Check victory
    if (this.checkVictory()) {
      if (this.onGameWin) this.onGameWin();
    }
    return result.success;
  }

  moveWasteToTableau(colIndex, selectedCard) {
    const result = moveWasteToTableau(
      this.stock.wastePile,
      this.tableau,
      colIndex,
      selectedCard
    );

    if (result.success) {
      this.recordMove({
        type: "WASTE_TO_TABLEAU",
        cards: result.cards,
        from: this.stock.wastePile,
        to: this.tableau.columns[colIndex],
      });
    }

    // Check victory
    if (this.checkVictory()) {
      if (this.onGameWin) this.onGameWin();
    }

    return result.success;
  }

  moveWasteToFoundation(selectedCard) {
    const result = moveWasteToFoundation(
      this.stock.wastePile,
      this.foundation,
      selectedCard
    );

    if (result?.success) {
      this.recordMove({
        type: "WASTE_TO_FOUNDATION",
        cards: result.movedCards,
        from: this.stock.wastePile,
        to: result.to,
      });

      // Victory check
      if (this.checkVictory()) {
        if (this.onGameWin) this.onGameWin();
      }

      return true;
    }

    return false;
  }

  drawFromStock() {
    const drawnCards = this.stock.drawThree();
    if (drawnCards.length === 0) return [];

    this.recordMove({
      type: "DRAW",
      cards: drawnCards,
      from: this.stock,
      to: this.stock.wastePile,
    });

    return drawnCards;
  }

  recycleWaste() {
    if (!this.stock.isEmpty()) return false;
    if (this.stock.wastePile.isEmpty()) return false;
    this.stock.resetFromWaste();
    this.recordMove({ type: "RECYCLE" });
    return true;
  }

  // The top of undoStack is always the current state.
  undoLastMove() {
    if (this.undoStack.size() <= 1) return false;

    this.redoStack.push(this.undoStack.pop());
    return this.restoreSnapshot(this.undoStack.peek());
  }

  redoLastMove() {
    if (this.redoStack.isEmpty()) return false;

    const nextState = this.redoStack.pop();
    this.undoStack.push(nextState);
    return this.restoreSnapshot(nextState);
  }

  /* ----------------- GAME STATUS ----------------- */

  // All 52 cards on the foundations means the tableau, stock and waste are empty.
  checkVictory() {
    return this.foundation.piles.every((pile) => pile.size() === 13);
  }

  /* ----------------- MOVE VALIDATION (used by hints) ----------------- */

  isValidMoveToFoundation(card, pile) {
    const top = pile.isEmpty() ? null : pile.peek();
    if (!top) return card.rank === "A";
    return card.suit === top.suit && rankValue(card.rank) === rankValue(top.rank) + 1;
  }

  isValidMoveToTableau(card, column) {
    const cards = column.toArray();
    return canPlaceOnDestination(card, cards[cards.length - 1] ?? null);
  }

  // Debug helper: put every card on the foundations.
  forceWin() {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    this.foundation = new Foundation();
    suits.forEach((suit, i) => {
      for (const rank of ranks) {
        const card = new Card(suit, rank);
        card.faceUp = true;
        this.foundation.piles[i].push(card);
      }
    });
    this.tableau = new Tableau();
    this.stock = new Stock();

    if (this.checkVictory() && this.onGameWin) this.onGameWin();
  }
}
