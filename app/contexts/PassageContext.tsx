import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert, AlertButton } from 'react-native';
import Passage, {
  PassageUser,
  AllowedFallbackAuth,
  PassageError,
  PassageErrorCode,
} from 'passage-react-native';

interface PassageContextType {
  authState: AuthState;
  currentUser: PassageUser | null;
  userIdentifer: string | null;
  login: (identifier: string) => Promise<void>;
  register: (identifier: string) => Promise<void>;
  activateOTP: (otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  checkMagicLink: () => Promise<void>;
  resendMagicLink: () => Promise<void>;
  addPasskey: () => Promise<void>;
  signOut: () => void;
}

export enum AuthState {
  Unauthenticated,
  AwaitingRegisterVerificationMagicLink,
  AwaitingLoginVerificationMagicLink,
  AwaitingRegisterVerificationOTP,
  AwaitingLoginVerificationOTP,
  Authenticated,
}

const PassageContext = createContext<PassageContextType | undefined>(undefined);

export const usePassage = () => {
  const context = useContext(PassageContext);
  if (!context) {
    throw new Error('usePassage must be used within an PassageProvider');
  }
  return context;;
}

export function PassageProvider({ children }: { children: React.ReactNode }) {

  const [currentUser, setCurrentUser] = useState<PassageUser | null>(null);
  const [authState, setAuthState] = useState<AuthState>(AuthState.Unauthenticated);
  const [authFallbackId, setAuthFallbackId] = useState<string | null>(null);
  const [userIdentifer, setUserIdentifier] = useState<string | null>(null);

  useEffect(() => {
    checkForAuthenticatedUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setAuthState(AuthState.Authenticated);
    } else {
      setAuthState(AuthState.Unauthenticated);
      setUserIdentifier(null);
    }
  }, [currentUser]);

  const checkForAuthenticatedUser = async () => {
    try {
      const user = await Passage.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        await Passage.refreshAuthToken();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (identifier: string) => {
    try {
      await Passage.loginWithPasskey();
      const user = await Passage.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      if (error instanceof PassageError && error.code === PassageErrorCode.UserCancelled) {
        // User cancelled native passkey prompt, do nothing.
      } else {
        fallbackLogin(identifier);
      }
    }
  };

  const fallbackLogin = async (identifier: string) => {
    try {
      const appInfo = await Passage.getAppInfo();
      if (appInfo.authFallbackMethod === AllowedFallbackAuth.LoginCode) {
        const otpId = await Passage.newLoginOneTimePasscode(identifier);
        setAuthFallbackId(otpId);
        setAuthState(AuthState.AwaitingLoginVerificationOTP);
      } else if (appInfo.authFallbackMethod === AllowedFallbackAuth.MagicLink) {
        const magicLinkId = await Passage.newLoginMagicLink(identifier);
        setAuthFallbackId(magicLinkId);
        setAuthState(AuthState.AwaitingLoginVerificationMagicLink);
      }
      setUserIdentifier(identifier);
    } catch (error) {
      console.error(error);
    }
  };

  const register = async (identifier: string) => {
    try {
      await Passage.registerWithPasskey(identifier);
      const user = await Passage.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      if (error instanceof PassageError && error.code === PassageErrorCode.UserCancelled) {
        // User cancelled native passkey prompt, do nothing.
      } else {
        fallbackRegister(identifier);
      }
    }
  };

  const fallbackRegister = async (identifier: string) => {
    try {
      const appInfo = await Passage.getAppInfo();
      if (appInfo.authFallbackMethod === AllowedFallbackAuth.LoginCode) {
        const otpId = await Passage.newRegisterOneTimePasscode(identifier);
        setAuthFallbackId(otpId);
        setAuthState(AuthState.AwaitingRegisterVerificationOTP);
      } else if (appInfo.authFallbackMethod === AllowedFallbackAuth.MagicLink) {
        const magicLinkId = await Passage.newRegisterMagicLink(identifier);
        setAuthFallbackId(magicLinkId);
        setAuthState(AuthState.AwaitingRegisterVerificationMagicLink);
      }
      setUserIdentifier(identifier);
    } catch (error) {
      console.error(error);
    }
  };

  const activateOTP = async (otp: string) => {
    try {
      await Passage.oneTimePasscodeActivate(otp, authFallbackId!);
      const user = await Passage.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      presentAlert('Problem with passcode', 'Please try again');
    }
  };

  const resendOTP = async () => {
    const isNewUser = authState === AuthState.AwaitingRegisterVerificationOTP;
    try {
      const newOtpId = isNewUser ?
        await Passage.newRegisterOneTimePasscode(userIdentifer!) :
        await Passage.newLoginOneTimePasscode(userIdentifer!);
      setAuthFallbackId(newOtpId);
    } catch (error) {
      presentAlert('Problem resending passcode', 'Please try again');
    }
  };

  const checkMagicLink = async () => {
    try {
      const authResult = await Passage.getMagicLinkStatus(authFallbackId!);
      if (authResult !== null) {
        const user = await Passage.getCurrentUser();
        setCurrentUser(user);
      }
    } catch (error) {
      // Magic link not activated yet, do nothing.
    }
  };

  const resendMagicLink = async () => {
    const isNewUser = authState === AuthState.AwaitingRegisterVerificationMagicLink;
    try {
      const newMagicLinkId = isNewUser ?
        await Passage.newRegisterMagicLink(userIdentifer!) :
        await Passage.newLoginMagicLink(userIdentifer!);
      setAuthFallbackId(newMagicLinkId);
      presentAlert('Success', 'Magic link resent');
    } catch (error) {
      presentAlert('Problem resending magic link', 'Please try again');
    }
  }

  /**
   * This example app does not include deep link handling.
   * If you set up deep linking for your app, you'll be able to extract the magic link from the url
   * and use activate it like this.
   */
  const handleDeepMagicLink = async (magicLink: string) => {
    try {
      await Passage.magicLinkActivate(magicLink);
      const user = await Passage.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      presentAlert('Invalid magic link', 'Magic link is no longer active.');
    }
  };

  const addPasskey = async () => {
    try {
      await Passage.addDevicePasskey();
      // Get updated user to get new list of passkeys.
      const user = await Passage.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      presentAlert('Problem adding passkey', 'Please try again.');
    }
  };

  const signOut = async () => {
    setCurrentUser(null);
    await Passage.signOut();
  };

  const presentAlert = (title: string, message: string) => {
    const button: AlertButton = { text: 'Okay', style: 'cancel' };
    Alert.alert(title, message, [button]);
  };

  const value = {
    authState,
    currentUser,
    userIdentifer,
    signOut,
    login,
    register,
    activateOTP,
    resendOTP,
    checkMagicLink,
    resendMagicLink,
    addPasskey,
  };

  return <PassageContext.Provider value={value}>{children}</PassageContext.Provider>;
}
