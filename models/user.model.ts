export interface IUser {
  id: string;
  username: string;
  email: string;
  authMethod: 'google' | 'email' | 'facebook'
}
