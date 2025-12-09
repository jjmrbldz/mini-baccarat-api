import { baccaratBetHistory, baccaratTournamentBetHistory, db } from "../../db";
import { BaccaratCard, BaccaratHand, BaccaratResult, TournamentRegisterSchema } from "../../types";
import { createDeck, drawFromDeck } from "../../utils/baccarat";
import { TBetBody } from "./bacc.schema";
import { FastifyRequest } from "fastify";
import * as betHistoryRepo from "../bet-history/bethistory.repository";
import * as userRepo from "../user/user.repository";
import * as pointsRepo from "../point-log/points.repository";
import * as settingsRepo from "../minigame/minigame.repository";
import { MODULE_SERVICE_CODES } from "../../constants";
import { getTableName } from "drizzle-orm";
import dayjs from "dayjs";

function parseCardValue(card: string): number {
  const value = card.slice(0, -1);
  if (["K", "Q", "J", "10"].includes(value)) return 0;
  if (value === "A") return 1;
  return parseInt(value, 10);
}

function calculateBaccarat(hand: BaccaratHand): BaccaratResult {
  const playerCards = hand.player.map((c) => c.card);
  const bankerCards = hand.banker.map((c) => c.card);

  const playerScore =
    playerCards.map(parseCardValue).reduce((a, b) => a + b, 0) % 10;

  const bankerScore =
    bankerCards.map(parseCardValue).reduce((a, b) => a + b, 0) % 10;

  const playerPair =
    playerCards.length >= 2 &&
    playerCards[0].slice(0, -1) === playerCards[1].slice(0, -1);

  const bankerPair =
    bankerCards.length >= 2 &&
    bankerCards[0].slice(0, -1) === bankerCards[1].slice(0, -1);

  let winner: "player" | "banker" | "tie" = "tie";
  if (playerScore > bankerScore) winner = "player";
  else if (bankerScore > playerScore) winner = "banker";

  return {
    playerCards,
    playerScore,
    playerPair,
    bankerCards,
    bankerScore,
    bankerPair,
    winner: winner.toUpperCase() as BaccaratResult["winner"],
  };
}

function evaluateDrawRules(hand: BaccaratHand) {
  const cardValue = (card: string) => {
    const rank = card.slice(0, -1);
    if (rank === "A") return 1;
    if (["10", "J", "Q", "K"].includes(rank)) return 0;
    return parseInt(rank, 10);
  };

  const getTotal = (cards: BaccaratCard[]): number =>
    cards.reduce((s, c) => s + cardValue(c.card), 0) % 10;

  const playerHand = hand.player;
  const bankerHand = hand.banker;

  const playerTotal = getTotal(playerHand);
  const bankerTotal = getTotal(bankerHand);

  // Rule 1 — Natural
  if (playerTotal >= 8 || bankerTotal >= 8) {
    return {
      playerNeedsThirdCard: false,
      bankerNeedsThirdCard: false,
      playerScore: playerTotal,
      bankerScore: bankerTotal,
      winner:
        playerTotal > bankerTotal
          ? "player"
          : bankerTotal > playerTotal
          ? "banker"
          : "tie",
    } as const;
  }

  // Player draw rule
  const playerNeedsThirdCard = playerTotal <= 5 && playerHand.length < 3;

  // Player 3rd card value
  let playerThirdCardValue: number | null = null;
  if (playerHand.length === 3) {
    playerThirdCardValue = cardValue(playerHand[2].card);
  }

  // Banker draw logic
  let bankerNeedsThirdCard = false;

  if (bankerHand.length >= 3) {
    bankerNeedsThirdCard = false;
  } else {
    if (!playerNeedsThirdCard && playerThirdCardValue === null) {
      bankerNeedsThirdCard = bankerTotal <= 5;
    } else if (playerThirdCardValue !== null) {
      switch (bankerTotal) {
        case 0:
        case 1:
        case 2:
          bankerNeedsThirdCard = true;
          break;
        case 3:
          bankerNeedsThirdCard = playerThirdCardValue !== 8;
          break;
        case 4:
          bankerNeedsThirdCard = [2, 3, 4, 5, 6, 7].includes(playerThirdCardValue);
          break;
        case 5:
          bankerNeedsThirdCard = [4, 5, 6, 7].includes(playerThirdCardValue);
          break;
        case 6:
          bankerNeedsThirdCard = [6, 7].includes(playerThirdCardValue);
          break;
        case 7:
          bankerNeedsThirdCard = false;
          break;
      }
    } else {
      bankerNeedsThirdCard = bankerTotal <= 5;
    }
  }

  return {
    playerNeedsThirdCard,
    bankerNeedsThirdCard,
    playerScore: playerTotal,
    bankerScore: bankerTotal,
    winner:
      playerTotal > bankerTotal
        ? "player"
        : bankerTotal > playerTotal
        ? "banker"
        : "tie",
  } as const;
}

function simulateBaccaratRound() {
  const deck = createDeck();

  const hand: BaccaratHand = {
    player: [],
    banker: [],
  };

  // Deal initial 4 cards
  hand.player.push(drawFromDeck(deck));
  hand.banker.push(drawFromDeck(deck));
  hand.player.push(drawFromDeck(deck));
  hand.banker.push(drawFromDeck(deck));

  // First evaluation
  let evalResult = evaluateDrawRules(hand);

  // Not natural → Player draw
  if (!(evalResult.playerScore >= 8 || evalResult.bankerScore >= 8)) {
    if (evalResult.playerNeedsThirdCard) {
      hand.player.push(drawFromDeck(deck));
    }

    // Recalculate banker rules after player 3rd card
    evalResult = evaluateDrawRules(hand);

    // Banker draw
    if (evalResult.bankerNeedsThirdCard) {
      hand.banker.push(drawFromDeck(deck));
    }
  }

  const result = calculateBaccarat(hand);

  return {
    hand,
    result,
  };
}

function computeWin(
  betOption: string,
  betAmount: number,
  winner: "PLAYER" | "BANKER" | "TIE",
  playerPair: boolean,
  bankerPair: boolean
): number {
  let win = 0;
  const opt = betOption.toUpperCase().replace("_", " ");

  if (opt === 'PLAYER' && winner === 'PLAYER') win += betAmount * 2;
  if (opt === 'BANKER' && winner === 'BANKER') win += betAmount * 1.95;
  if (opt === 'TIE'     && winner === 'TIE')   win += betAmount * 9;
  if (opt === 'PLAYER PAIR' && playerPair) win += betAmount * 12;
  if (opt === 'BANKER PAIR' && bankerPair) win += betAmount * 12;
  if (opt === 'BANKER' && winner === 'TIE') win += betAmount;
  if (opt === 'PLAYER' && winner === 'TIE') win += betAmount;

  return win;
}

function computeMultiBetWins(
  bets: { betOption: string; betAmount: number }[],
  winner: "PLAYER" | "BANKER" | "TIE",
  playerPair: boolean,
  bankerPair: boolean
) {
  let totalWin = 0; // total payout returned
  let totalBet = 0; // total stake

  const betResult = bets.map((b) => {
    const win = computeWin(
      b.betOption,
      b.betAmount,
      winner,
      playerPair,
      bankerPair
    );

    totalWin += win;
    totalBet += b.betAmount;

    const status = win > 0 ? "WIN" : "LOSE";

    return {
      betOption: b.betOption,
      betAmount: b.betAmount,
      win,                                 // full returned amount
      status
    };
  });

  const netLoss = totalBet - totalWin;         // + = gain, - = loss

  return {
    totalWin,                                  // total chips returned
    totalBet,                                  // total chips wagered
    netLoss,                                   // final change to user balance
    betResult
  };
}

function getTotalBetAmount(bets: { betOption: string; betAmount: number }[]) {
  return bets.reduce((sum, b) => sum + b.betAmount, 0);
}

async function checkBetLimit(minigameId = 1, userId: number) {
  let minBetMinigame: number = -1;
  let maxBetMinigame: number = -1;

  const [settings]  = await settingsRepo.getMinigameSettings(minigameId);

  if (!settings) {
    throw { code: "MINIGAME_NOT_FOUND" };
  }

  const { minBet, maxBet, scheduleOpen, scheduleClose, name } = settings;

  const now = dayjs();
  if (scheduleOpen && now.isBefore(dayjs(scheduleOpen))) {
    throw { code: "MINIGAME_NOT_OPEN" };
  }
  if (scheduleClose && now.isAfter(dayjs(scheduleClose))) {
    throw { code: "MINIGAME_CLOSED" };
  }
  minBetMinigame = minBet || minBetMinigame;
  maxBetMinigame = maxBet || maxBetMinigame;

  const [user] = await userRepo.findUser(userId);

  if (!user) {
    throw { code: "USER_NOT_FOUND" };
  }

  const isTournament = name?.toLowerCase().includes("tournament");

  const { 
    minBetMinigame: userMinBetMinigame, 
    maxBetMinigame: userMaxBetMinigame, 
    minBetTournament, 
    maxBetTournament
  } = user;

  if (isTournament) {
    if (minBetTournament != null && minBetTournament >= 0) {
      minBetMinigame = minBetTournament;
    }
    if (maxBetTournament != null && maxBetTournament >= 0) {
      maxBetMinigame = maxBetTournament;
    }
  } else {
    if (userMinBetMinigame != null && userMinBetMinigame >= 0) {
      minBetMinigame = userMinBetMinigame;
    }
    if (userMaxBetMinigame != null && userMaxBetMinigame >= 0) {
      maxBetMinigame = userMaxBetMinigame;
    }
  }

  return {
    minBetMinigame,
    maxBetMinigame
  }
}

export async function getSettings(request: FastifyRequest, body: TournamentRegisterSchema) {
  if (!request.authUser?.token) throw { statusCode: 401, code: MODULE_SERVICE_CODES["invalidToken"] };
  const user = request.authUser?.payload;
  if (!user || !user.id || !user.group)  throw { statusCode: 404, code: MODULE_SERVICE_CODES["userNotFound"] };
  
  const [settings] = await settingsRepo.getMinigameSettings(body.tournamentId);
  if (!settings) throw { statusCode: 404, message: "No settings found" };  

  const isTournament = settings.name?.toLowerCase().includes("tournament");

  const checkIsRegistered = await pointsRepo.checkTournamentRegistration(user.id, settings.settingsId!, user.group);

  const isRegistered = !isTournament ? true : checkIsRegistered && checkIsRegistered.length > 0 ? true : false;

  let minBet = user.minBet > 0 ? user.minBet : (settings.minBet || 10);
  let maxBet = user.maxBet > 0 ? user.maxBet : (settings.maxBet || 1000);

  if (isTournament) {
    minBet = user.minBetTournament > 0 ? user.minBetTournament : (settings.minBet || 10);
    maxBet = user.maxBetTournament > 0 ? user.maxBetTournament : (settings.maxBet || 10);
  }

  let isOpen: boolean = true;

  const now = dayjs();
  if (settings.scheduleOpen && now.isBefore(dayjs(settings.scheduleOpen))) {
    isOpen = false;
  }
  if (settings.scheduleClose && now.isAfter(dayjs(settings.scheduleClose))) {
    isOpen = false;
  }

  return {
    statusCode: 200,
    data: {
      ...settings,
      minBet,
      maxBet,
      isTournament,
      isRegistered,
      isOpen
    },
    message: "Get settings."
  }
}

export async function bet(data: TBetBody, request: FastifyRequest, query?: {id?: number}) {
  if (!request.authUser?.token) throw { code: MODULE_SERVICE_CODES["invalidToken"] };
  const user = request.authUser?.payload;
  if (!user || !user.id || !user.group)  throw { code: MODULE_SERVICE_CODES["userNotFound"] };  

  const totalBetAmount = getTotalBetAmount(data);
  const {data: settings} = await getSettings(request, {tournamentId: query?.id || 1});

  const isTournament = settings.isTournament;

  if (!settings.isOpen) throw { statusCode: 401, message: "Game not open." }
  if (!settings.isRegistered) throw { statusCode: 401, message: "You are not registered to this game." }
  
  if (totalBetAmount > settings.maxBet) throw { statusCode: 400, message: `Maximum Bet is ${settings.maxBet}` };  
  if (totalBetAmount < settings.minBet) throw { statusCode: 400, message: `Minimum Bet is ${settings.minBet}` };  

  const { result } = simulateBaccaratRound();

  const payout = computeMultiBetWins(
    data,
    result.winner,
    result.playerPair,
    result.bankerPair
  );

  const pointsBefore = await pointsRepo.findUserLatestPoints(user.id, user.group);
  const pointsAfter = (pointsBefore - payout.totalBet) + payout.totalWin;
  const isGain = (payout.netLoss * -1) >= 0;

  await db.transaction(async (tx) => {
    let returningId: number;

    if (!isTournament) {
      returningId = await betHistoryRepo.insertBetHistory(tx, {
        userId: request.authUser?.payload.id,
        betAmount: payout.totalBet,
        winAmount: payout.totalWin,
        userCashBefore: pointsBefore,
        userCashAfter: pointsAfter,
        netLoss: payout.netLoss,
        betOption: data.map(item => item.betOption).join(", "),
        betStatus: "FINISH",
        betDetails: {
          ...result,
          ...payout,
        },
        // settingsId: settings.settingsId,
      });
    } else {
      returningId = await betHistoryRepo.insertTournamentBetHistory(tx, {
        userId: request.authUser?.payload.id,
        betAmount: payout.totalBet,
        winAmount: payout.totalWin,
        userCashBefore: pointsBefore,
        userCashAfter: pointsAfter,
        netLoss: payout.netLoss,
        betOption: data.map(item => item.betOption).join(", "),
        betStatus: "FINISH",
        betDetails: {
          ...result,
          ...payout,
        },
        settingsId: settings.settingsId,
      });
    }

    await pointsRepo.insertPointLog(tx, {
      userId: user.id,
      type: isGain ? "add" : "deduct",
      amount: payout.netLoss * -1,
      prevBalance: pointsBefore,
      afterBalance: pointsAfter,
      note: settings.settingsId || "baccarat",
      note2: "",
      note3: "",
      referenceTable: getTableName(!isTournament ? baccaratBetHistory : baccaratTournamentBetHistory),
      referenceId: returningId
    }, user.group!)

    await userRepo.updateUserPoints(tx, user.id, pointsAfter);
  })

  return { 
    statusCode: 200, 
    data: {
      ...result,
      ...payout,
      balance: pointsAfter,
    },
    message: "Bet success!" 
  }
}

