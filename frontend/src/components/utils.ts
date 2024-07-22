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
    next_time_intervals: card.next_time_intervals as number[],
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

export function formatInterval(seconds: number): string {
  const MONTH = 60 * 60 * 24 * 30;
  const DAY = 60 * 60 * 24;
  const HOUR = 60 * 60;
  const MIN = 60;
  if (seconds >= MONTH) {
    return `${Math.round((seconds / MONTH + Number.EPSILON) * 10) / 10}mth`;
  } else if (seconds >= DAY) {
    return `${Math.round((seconds / DAY + Number.EPSILON) * 10) / 10}d`;
  } else if (seconds >= HOUR) {
    return `${Math.round((seconds / HOUR + Number.EPSILON) * 10) / 10}h`;
  } else if (seconds >= MIN) {
    return `${Math.round((seconds / MIN + Number.EPSILON) * 10) / 10}min`;
  } else {
    return "< 1min";
  }
}