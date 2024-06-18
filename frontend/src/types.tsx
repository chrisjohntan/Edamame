export type User = {
  username: string
}

export type Auth = {
  user: User
}

export const EMPTY_AUTH = {
  user: {
    username: ""
  }
} as const

export type Card = {
  header: string;
  body: string;
  header_flipped: string;
  body_flipped: string;
}

export type Deck = {
  id: number;
  deckName: string;
  size: number;
}