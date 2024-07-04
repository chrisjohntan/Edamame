import { Card, Deck } from "../types";
import { format } from "date-fns";

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

export function dateToIso(date: Date): string {
  const yr = String(date.getFullYear());
  let month = String(date.getMonth()+1);
  month = month.length === 1 ? "0" + month : month;
  let day = String(date.getDate());
  day = day.length === 1 ? "0" + day : day;

  return `${yr}-${month}-${day}`;
}