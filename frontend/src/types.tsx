export type User = {
  username: string,
  email: string,
  daily_target: number
}

export type Auth = {
  user: User
}

export const EMPTY_AUTH: Auth = {
  user: {
    username: "",
    email: "",
    daily_target: 0
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
  times_remembered_consecutive: number;
  times_forgot: number;
  new: boolean;
  steps: number;
  next_time_intervals: number[];
}

export type Deck = {
  id: number;
  deck_name: string;
  size: number;
  time_created: Date,
  last_reviewed: Date,
  last_modified: Date,
  reviews_done: number,
  forgot_multiplier: number,
  hard_multiplier: number,
  okay_multiplier: number,
  easy_multiplier: number,
  ignore_review_time: boolean,
}