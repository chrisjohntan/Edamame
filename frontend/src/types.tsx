export type User = {
  username: string
}

export type Auth = {
  user: User
}

export type Card = {
  header: string;
  body: string;
  header_flipped: string;
  body_flipped: string;
}

export const EMPTY_AUTH = {
  user: {
    username: ""
  }
} as const