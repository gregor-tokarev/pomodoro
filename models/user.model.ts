export type provider = 'google.com' | 'email' | 'facebook.com'

export interface User {
  id: string
  username: string
  email: string
  avatar: string
  provider: provider

  counters: {
    records: number
  }
}
