import GameController from "../controllers/GameController.js";

export default class GameViewModel {
  constructor(setState) {
    this.setState = setState;
    this.onVictory = null;

    // Pass an onUpdate callback to GameController
    this.controller = new GameController(() => this.updateState());

    this.selectedCard = null;
    this.selection = null; // { card, source, fromCol, count } for tap-to-move
    this.errorMessage = null;
    this.showVictoryModal = false;
    this.hint = null;
    this.controller.onGameWin = this.handleGameWin.bind(this);

    this.updateState(); // initial render

    // Debug cheat, only available in development builds
    if (import.meta.env.DEV && typeof window !== "undefined") {
      window.forceWin = this.forceWin.bind(this);
    }
  }

  // Stop the game clock; call when the game view is torn down.
  dispose() {
    this.controller.stopTimer();
    clearTimeout(this.hintTimer);
    clearTimeout(this.errorTimer);
  }

  handleGameWin() {
    this.controller.stopTimer();
    this.showVictoryModal = true;
    if (this.onVictory) this.onVictory();
  }

  /** --- CARD SELECTION --- */
  // info describes where the card is: { source, fromCol, count }
  selectCard(card, info = {}) {
    this.selectedCard = card;
    this.selection = card ? { card, ...info } : null;
  }

  clearSelection() {
    this.selectedCard = null;
    this.selection = null;
  }

  // Tap-to-move: move the selected card(s) onto a tableau column
  // (target "tableau" with colIndex) or onto the foundation.
  moveSelectionTo(target, colIndex) {
    const sel = this.selection;
    if (!sel) return;

    if (target === "tableau") {
      if (sel.source === "tableau") {
        if (sel.fromCol === colIndex) {
          this.clearSelection();
          this.updateState();
        } else {
          this.moveTableauToTableau(sel.fromCol, colIndex, sel.count);
        }
      } else if (sel.source === "waste") {
        this.moveWasteToTableau(colIndex, sel.card);
      }
    } else if (target === "foundation") {
      if (sel.source === "tableau") {
        if (sel.count > 1) {
          this.clearSelection();
          this.setError("Invalid move!");
          this.updateState();
        } else {
          this.moveTableauToFoundation(sel.fromCol);
        }
      } else if (sel.source === "waste") {
        this.moveWasteToFoundation(sel.card);
      }
    }
  }

  /** --- ERROR HANDLING --- */
  // Shown by BoardView; clears itself after 2 seconds.
  // Callers run updateState() afterwards to display it.
  setError(message) {
    clearTimeout(this.errorTimer);
    this.errorMessage = message;
    this.errorTimer = setTimeout(() => {
      this.errorMessage = null;
      this.updateState();
    }, 2000);
  }

  clearError() {
    clearTimeout(this.errorTimer);
    this.errorMessage = null;
  }

  /** --- STATE SYNC --- */
  // Builds the plain state object the views render from.
  getState() {
    const state = this.controller.getState();

    const completedCards = state.foundation.piles.reduce(
      (sum, pile) => sum + pile.size(),
      0
    );

    return {
      // New array references so React sees the change
      tableau: {
        columns: state.tableau.columns.map((col) => col.toArray()),
      },
      foundation: state.foundation,
      stock: state.stock,
      waste: state.stock.getWasteCards(),
      moves: this.controller.moves,
      score: this.controller.score,
      time: this.controller.time,
      progress: Math.floor((completedCards / 52) * 100),
      hint: this.hint ?? null,
      selectedCard: this.selectedCard,
      errorMessage: this.errorMessage,
      showVictoryModal: this.showVictoryModal,
    };
  }

  updateState() {
    this.setState(this.getState());
  }

  /** --- GAME ACTIONS --- */
  startNewGame() {
    this.showVictoryModal = false;
    this.hint = null;
    this.clearSelection();
    this.clearError();
    this.controller.startNewGame();
    this.updateState();
  }

  drawFromStock() {
    this.clearSelection();
    this.controller.drawFromStock();
    this.updateState();
  }

  recycleFromWaste() {
    this.clearSelection();
    this.controller.recycleWaste();
    this.updateState();
  }

  moveWasteToTableau(colIndex, card = this.selectedCard) {
    if (!card) return;
    const result = this.controller.moveWasteToTableau(colIndex, card);
    if (!result) this.setError("Invalid move!");
    else this.clearError();
    this.clearSelection();
    this.updateState();
  }

  moveWasteToFoundation(card = this.selectedCard) {
    if (!card) return;
    const result = this.controller.moveWasteToFoundation(card);
    if (!result) this.setError("Invalid move!");
    else this.clearError();
    this.clearSelection();
    this.updateState();
  }

  moveTableauToTableau(fromCol, toCol, numCards) {
    const result = this.controller.moveTableauToTableau(
      fromCol,
      toCol,
      numCards
    );
    if (!result) this.setError("Invalid move!");
    else this.clearError();
    this.clearSelection();
    this.updateState();
  }

  moveTableauToFoundation(colIndex) {
    const result = this.controller.moveTableauToFoundation(colIndex);
    if (!result) this.setError("Invalid move!");
    else this.clearError();
    this.clearSelection();
    this.updateState();
  }

  /** --- UNDO / REDO --- */
  undo() {
    this.clearSelection();
    const success = this.controller.undoLastMove();
    if (!success) this.setError("Nothing to undo");
    else this.clearError();
    this.updateState();
  }

  redo() {
    this.clearSelection();
    const success = this.controller.redoLastMove();
    if (!success) this.setError("Nothing to redo");
    else this.clearError();
    this.updateState();
  }

  forceWin() {
    this.controller.forceWin();
    this.updateState();
  }

  provideHint() {
    const { tableau, foundation, waste } = this.controller.getState();

    const visibleWaste = waste.slice(-1); // only the top waste card is playable

    // Containers for moves by priority
    const wasteToFoundation = [];
    const tableauToFoundation = [];
    const wasteToTableau = [];
    const tableauToTableau = [];

    // ---------------------------
    // Waste to Foundation
    // ---------------------------
    for (let i = visibleWaste.length - 1; i >= 0; i--) {
      const card = visibleWaste[i];
      for (let f of foundation.piles) {
        if (this.controller.isValidMoveToFoundation(card, f)) {
          wasteToFoundation.push({ from: "waste", to: "foundation", card });
        }
      }
    }

    // ---------------------------
    // Tableau to Foundation
    // ---------------------------
    for (let col of tableau.columns) {
      const topNodes = col.getTopNodes?.(1); // returns array of Nodes
      const topNode = topNodes?.[0]; // get the Node
      const topCard = topNode?.data; // extract Card object
      if (!topCard) continue;
      for (let f of foundation.piles) {
        if (this.controller.isValidMoveToFoundation(topCard, f)) {
          tableauToFoundation.push({
            from: "tableau",
            to: "foundation",
            card: topCard,
          });
        }
      }
    }

    // ---------------------------
    // Waste to Tableau
    // ---------------------------
    for (let i = visibleWaste.length - 1; i >= 0; i--) {
      const card = visibleWaste[i];
      for (let col of tableau.columns) {
        if (this.controller.isValidMoveToTableau(card, col)) {
          wasteToTableau.push({ from: "waste", to: "tableau", card });
        }
      }
    }

    // ---------------------------
    // Tableau to Tableau (any card in a face-up run, moved with the cards on top)
    // ---------------------------
    for (const srcCol of tableau.columns) {
      const allCards = srcCol.toArray();
      const run = srcCol.getTopNodes(allCards.length).map((node) => node.data);

      run.forEach((card, i) => {
        // Moving a run that already starts the column to an empty column does nothing
        const startsColumn = allCards.length - run.length + i === 0;

        for (const destCol of tableau.columns) {
          if (srcCol === destCol) continue;
          if (startsColumn && destCol.isEmpty()) continue;

          if (this.controller.isValidMoveToTableau(card, destCol)) {
            tableauToTableau.push({ from: "tableau", to: "tableau", card });
          }
        }
      });
    }

    // ---------------------------
    // Return first available move at highest priority
    // ---------------------------
    if (wasteToFoundation.length) return wasteToFoundation[0];
    if (tableauToFoundation.length) return tableauToFoundation[0];
    if (wasteToTableau.length) return wasteToTableau[0];
    if (tableauToTableau.length) return tableauToTableau[0];

    return null; // No valid moves anywhere
  }

  // Show a hint, then clear it after 3 seconds
  highlightHint(hint) {
    clearTimeout(this.hintTimer);
    this.hint = hint;
    this.updateState();

    if (hint) {
      this.hintTimer = setTimeout(() => this.highlightHint(null), 3000);
    }
  }
}
