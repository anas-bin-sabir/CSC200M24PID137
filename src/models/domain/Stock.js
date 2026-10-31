import Queue from "../data structures/Queue.js";
import Card from "./Card.js";

export default class Stock {
  constructor(deck = null) {
    this.stockPile = new Queue();
    this.wastePile = new Queue();

    if (deck) {
      while (deck.cards.length > 0) {
        this.stockPile.enqueue(deck.dealOneCard());
      }
    }
  }

  toJSON() {
    return {
      stockPile: this.stockPile.toArray().map((card) => card.toJSON()),
      wastePile: this.wastePile.toArray().map((card) => card.toJSON()),
    };
  }

  static fromJSON(data) {
    const stock = new Stock();
    stock.stockPile = new Queue();
    stock.wastePile = new Queue();

    data.stockPile.forEach((cardData) =>
      stock.stockPile.enqueue(Card.fromJSON(cardData))
    );
    data.wastePile.forEach((cardData) =>
      stock.wastePile.enqueue(Card.fromJSON(cardData))
    );

    return stock;
  }

  /** Returns the stock pile as an array for the UI */
  getStockCards() {
    return this.stockPile.toArray();
  }

  /** Returns the waste pile as an array for UI */
  getWasteCards() {
    return this.wastePile.toArray();
  }

  peekTopThree() {
    const cards = [];
    let current = this.stockPile.front;
    let count = 0;
    while (current && count < 3) {
      cards.push(current.data);
      current = current.next;
      count++;
    }
    return cards;
  }

  drawThree() {
    const drawn = [];
    for (let i = 0; i < 3 && !this.stockPile.isEmpty(); i++) {
      const card = this.stockPile.dequeue();
      card.faceUp = true;
      this.wastePile.enqueue(card);
      drawn.push(card);
    }
    return drawn;
  }

  resetFromWaste() {
    if (!this.wastePile.isEmpty() && this.stockPile.isEmpty()) {
      const cards = [];
      while (!this.wastePile.isEmpty()) {
        const c = this.wastePile.dequeue();
        c.faceUp = false;
        cards.push(c);
      }
      cards.reverse().forEach((c) => this.stockPile.enqueue(c));
    }
  }

  isEmpty() {
    return this.stockPile.isEmpty();
  }
}
