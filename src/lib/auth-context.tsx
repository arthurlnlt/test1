import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from './auth';

type User = {
  username: string;
  email: string;
  createdAt: string;
  token?: string;
} | null;

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  currentUsername: string;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        const user = await auth.verifySession(token);
        if (user) {
          setUser({ ...user, token });
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      }
    };

    initAuth();
  }, []);

  const handleSetUser = (newUser: User) => {
    if (newUser?.token) {
      localStorage.setItem(TOKEN_KEY, newUser.token);
    }
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser: handleSetUser, 
        isAuthenticated: !!user,
        currentUsername: user?.username || 'Unknown',
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}