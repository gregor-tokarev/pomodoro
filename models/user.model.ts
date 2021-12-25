export type provider = 'google.com' | 'email' | 'facebook.com'

export interface User {
  id: string
  username: string
  email: string
  emailVerified: boolean
  avatar: string
  provider: provider
}
