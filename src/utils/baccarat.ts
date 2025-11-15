import { NUM_DECKS, RANKS, SUITS } from "../constants";
import { BaccaratCard } from "../types";

export function createDeck(): string[] {
  const deck: string[] = [];
  for (let d = 0; d < NUM_DECKS; d++) {
    for (const rank of RANKS) {
      for (const suit of SUITS) {
        deck.push(`${rank}${suit}`);
      }
    }
  }
  return deck;
}

export function drawFromDeck(deck: string[]): BaccaratCard {
  const index = Math.floor(Math.random() * deck.length);
  const [card] = deck.splice(index, 1);
  return { card };
}