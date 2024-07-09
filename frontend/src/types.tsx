export type User = {
  username: string,
  email: string,
}

export type Auth = {
  user: User
}

export const EMPTY_AUTH = {
  user: {
    username: "",
    email: "",
  }
} as const

export type Card = {
  id: number;
  header: string;
  body: string;
  header_flipped: string;
  body_flipped: string;
  time_created: Date;
  time_for_review: Date;
  time_interval: Date;
  last_reviewed: Date;
  last_modified: Date;
  reviews_done: number;
}

export type Deck = {
  id: number;
  deck_name: string;
  size: number;
  time_created: Date,
  last_reviewed: Date,
  last_modified: Date,
  reviews_done: number

}