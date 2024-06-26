import { Card } from "../types";

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

