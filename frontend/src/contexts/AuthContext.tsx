import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getStoredToken,
  getStoredUser,
  login,
  logout as clearStoredAuth,
  register,
  type AuthUser,
} from '../services/authService';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: typeof login;
  signUp: typeof register;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user && getStoredToken()),
    signIn: async (payload) => {
      const response = await login(payload);
      setUser(response.user);
      return response;
    },
    signUp: async (payload) => {
      const response = await register(payload);
      setUser(response.user);
      return response;
    },
    signOut: () => {
      clearStoredAuth();
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
