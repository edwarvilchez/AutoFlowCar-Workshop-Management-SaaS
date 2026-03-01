import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Profile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated check of session
    const storedUser = localStorage.getItem('sgt:user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      setProfile({ 
        ...u, 
        workshopName: 'Workshop Premium Demo',
        workshopLogo: 'https://images.unsplash.com/photo-1596496332152-7a8e2b868677?w=100'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (pass.length < 4) {
          setLoading(false);
          reject(new Error('Password too short'));
          return;
        }

        let mockRole: 'admin' | 'analyst' | 'client' = 'admin';
        if (email.startsWith('analyst')) mockRole = 'analyst';
        if (email.startsWith('client')) mockRole = 'client';

        const mockUser: User = {
          id: '1',
          email,
          role: mockRole,
          name: email.split('@')[0].toUpperCase(),
          photoUrl: `https://ui-avatars.com/api/?name=${email}&background=0D8ABC&color=fff`,
          phone: '+58 414-0000000'
        };
        localStorage.setItem('sgt:user', JSON.stringify(mockUser));
        setUser(mockUser);
        setProfile({
          ...mockUser,
          workshopName: 'Workshop Premium Demo',
          workshopLogo: 'https://images.unsplash.com/photo-1596496332152-7a8e2b868677?w=100'
        });
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const register = async (email: string, pass: string, name: string) => {
    setLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          role: 'admin',
          name,
          photoUrl: `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff`
        };
        localStorage.setItem('sgt:user', JSON.stringify(mockUser));
        setUser(mockUser);
        setProfile({
          ...mockUser,
          workshopName: 'New Workshop Demo',
          workshopLogo: 'https://images.unsplash.com/photo-1596496332152-7a8e2b868677?w=100'
        });
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('sgt:user');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
