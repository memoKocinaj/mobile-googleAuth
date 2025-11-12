import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // Store user info in AsyncStorage
      if (currentUser) {
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          })
        );
      } else {
        await AsyncStorage.removeItem('user');
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
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
