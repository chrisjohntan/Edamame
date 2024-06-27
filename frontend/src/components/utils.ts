import { Card, Deck } from "../types";

export function dataToCard(card: any): Card {
  return {
    ...card,
    time_created: new Date(card.time_created),
    time_for_review: new Date(card.time_for_review),
    time_interval: new Date(card.time_interval),
    last_modified: new Date(card.last_modified),
    last_reviewed: new Date(card.last_reviewed),
  }
}

export function dataToDeck(deck: any): Deck {
  return {
    ...deck,
    time_created: new Date(deck.time_created),
    last_reviewed: new Date(deck.last_reviewed),
    last_modified: new Date(deck.last_modified)
  }
}