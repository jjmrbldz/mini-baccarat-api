export interface BaccaratCard {
  card: string;
}

export interface BaccaratHand {
  player: BaccaratCard[];
  banker: BaccaratCard[];
}

export interface BaccaratResult {
  playerCards: string[];
  playerScore: number;
  playerPair: boolean;
  bankerCards: string[];
  bankerScore: number;
  bankerPair: boolean;
  winner: "PLAYER" | "BANKER" | "TIE";
}