export type User = {
  username: string
}

export type Auth = {
  user: User
}

export type Card = {
  header: string;
  body: string;
  headerFlipped: string;
  bodyFlipped: string;
}

export const EMPTY_AUTH = {
  user: {
    username: ""
  }
} as const