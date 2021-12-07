export interface User {
  id: string;
  username: string;
  email: string;
  authMethod: 'google' | 'email' | 'facebook'
}
