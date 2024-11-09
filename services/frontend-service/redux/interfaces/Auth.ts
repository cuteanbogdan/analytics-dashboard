export interface User {
  id: string;
  email: string;
  fullName?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
}
