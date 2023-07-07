import React, { createContext, useState, useContext, useEffect } from 'react';
import Passage, { PassageUser } from 'passage-react-native';

interface PassageContextType {
  authState: AuthState;
  isNewUser: boolean;
  setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: PassageUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<PassageUser | null>>;
  authFallbackId: string | null;
  setAuthFallbackId: React.Dispatch<React.SetStateAction<string | null>>;
  userIdentifer: string | null;
  setUserIdentifier: React.Dispatch<React.SetStateAction<string | null>>;
}

export enum AuthState {
  Unauthenticated,
  AwaitingVerificationMagicLink,
  AwaitingVerificationOTP,
  Authenticated,
}

const PassageContext = createContext<PassageContextType | undefined>(undefined);

export function usePassage() {
  const context = useContext(PassageContext);
  if (!context) {
    throw new Error('usePassage must be used within an PassageProvider');
  }
  return context;
}

export function PassageProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<PassageUser | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [authState, setAuthState] = useState<AuthState>(AuthState.Unauthenticated);
  const [authFallbackId, setAuthFallbackId] = useState<string | null>(null);
  const [userIdentifer, setUserIdentifier] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setAuthState(AuthState.Authenticated);
    } else {
      setAuthState(AuthState.Unauthenticated);
    }
  }, [currentUser]);

  const value = {
    authState,
    setAuthState,
    isNewUser,
    setIsNewUser,
    currentUser,
    setCurrentUser,
    authFallbackId,
    setAuthFallbackId,
    userIdentifer,
    setUserIdentifier,
  };

  return <PassageContext.Provider value={value}>{children}</PassageContext.Provider>;
}
