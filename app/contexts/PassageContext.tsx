import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert, AlertButton } from 'react-native';
import {
  Passage,
  CurrentUser as PassageUser,
  PassageError,
  PassageErrorCode,
  SocialConnection,
} from '@passageidentity/passage-react-native';

interface PassageContextType {
  authState: AuthState;
  currentUser: PassageUser | null;
  userIdentifer: string | null;
  otpId: string | null;
  magicLinkId: string | null;
  passkeyAuth: (identifier: string, login: boolean) => Promise<void>;
  otpAuth: (identifier: string, login: boolean) => Promise<void>;
  magicLinkAuth: (identifier: string, login: boolean) => Promise<void>;
  activateOTP: (otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  checkMagicLink: (magicLinkId: string | null) => Promise<void>;
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

  const passage = new Passage('YOUR_APP_ID');
  const [currentUser, setCurrentUser] = useState<PassageUser | null>(null);
  const [authState, setAuthState] = useState<AuthState>(AuthState.Unauthenticated);
  const [otpId, setOtpId] = useState<string | null>(null);
  const [magicLinkId, setMagicLinkId] = useState<string | null>(null);
  const [userIdentifer, setUserIdentifier] = useState<string | null>(null);

  useEffect(() => {
    onAppStart();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setAuthState(AuthState.Authenticated);
    } else {
      setAuthState(AuthState.Unauthenticated);
      setUserIdentifier(null);
    }
  }, [currentUser]);

  const onAppStart = async () => {
    await checkAndRefreshToken();
    await checkForAuthenticatedUser();
  };

  const checkAndRefreshToken = async () => {
    const authToken = await passage.tokenStore.getValidAuthToken();
    if (authToken) {
      const authTokenIsValid = await passage.tokenStore.isAuthTokenValid();
      if (!authTokenIsValid) {
        try {
          await passage.tokenStore.refreshAuthToken();
        } catch (error) {
          // If error, refresh token is likely expired. User will be signed out.
        }
      }
    }
  };

  const checkForAuthenticatedUser = async () => {
    const user = await passage.currentUser.userInfo();
    setCurrentUser(user);
  };

  const passkeyAuth = async (identifier: string, login: boolean) => {
    try {
      if (login) {
        await passage.passkey.login(identifier);
      } else {
        await passage.passkey.register(identifier);
      }
      const user = await passage.currentUser.userInfo();
      setCurrentUser(user);
    } catch (error) {
      if (error instanceof PassageError) {
        presentAlert(error.toString(), error.message);
      } else {
        presentAlert('Problem with passkey authentication.', 'Please try again');
      }
    }
  };

  const otpAuth = async (identifier: string, login: boolean) => {
    try {
      const otpId = login ?
        await passage.oneTimePasscode.login(identifier) :
        await passage.oneTimePasscode.register(identifier);
      setOtpId(otpId.otpId);
      setAuthState(AuthState.AwaitingLoginVerificationOTP);
      setUserIdentifier(identifier);
    } catch (error) {
      presentAlert('Problem with OTP authentication.', 'Please try again');
    }
  };

  const magicLinkAuth = async (identifier: string, login: boolean) => {
    try {
      const otpId = login ?
        await passage.magicLink.login(identifier) :
        await passage.magicLink.register(identifier);
      setMagicLinkId(otpId.id);
      setAuthState(AuthState.AwaitingLoginVerificationOTP);
      setUserIdentifier(identifier);
    } catch (error) {
      presentAlert('Problem with Magic Link authentication.', 'Please try again');
    }
  };

  const activateOTP = async (otp: string) => {
    try {
      await passage.oneTimePasscode.activate(otp, otpId!);
      const user = await passage.currentUser.userInfo();
      setCurrentUser(user);
    } catch (error) {
      presentAlert('Problem with passcode', 'Please try again');
    }
  };

  const resendOTP = async () => {
    const login = authState === AuthState.AwaitingRegisterVerificationOTP;
    try {
      const newOtpId = login ?
        await passage.oneTimePasscode.register(userIdentifer!) :
        await passage.oneTimePasscode.login(userIdentifer!);
      setOtpId(newOtpId.otpId);
    } catch (error) {
      presentAlert('Problem resending passcode', 'Please try again');
    }
  };

  const checkMagicLink = async (magicLinkId: string | null) => {
    try {
      const authResult = await passage.magicLink.status(magicLinkId!);
      if (authResult !== null) {
        const user = await passage.currentUser.userInfo();
        setCurrentUser(user);
      }
    } catch (error) {
      // Magic link not activated yet, do nothing.
    }
  };

  const resendMagicLink = async () => {
    const login = authState === AuthState.AwaitingRegisterVerificationMagicLink;
    try {
      const newMagicLinkId = login ?
        await passage.magicLink.register(userIdentifer!) :
        await passage.magicLink.login(userIdentifer!);
      setMagicLinkId(newMagicLinkId.id);
      presentAlert('Success', 'Magic link resent');
    } catch (error) {
      presentAlert('Problem resending magic link', 'Please try again');
    }
  }

  /**
   * This example app does not include deep link handling.
   * If you set up deep linking for your app, you'll be able to extract the magic link from the url
   * and activate it like this.
   */
  const handleDeepMagicLink = async (magicLink: string) => {
    try {
      await passage.magicLink.activate(magicLink);
      const user = await passage.currentUser.userInfo();
      setCurrentUser(user);
    } catch (error) {
      presentAlert('Invalid magic link', 'Magic link is no longer active.');
    }
  };

  const addPasskey = async () => {
    try {
      await passage.tokenStore.refreshAuthToken();
      // Get updated user to get new list of passkeys.
      const user = await passage.currentUser.userInfo();
      setCurrentUser(user);
    } catch (error) {
      presentAlert('Problem adding passkey', 'Please try again.');
    }
  };

  const signOut = async () => {
    setCurrentUser(null);
    await passage.currentUser.logout();
  };

  const presentAlert = (title: string, message: string) => {
    const button: AlertButton = { text: 'Okay', style: 'cancel' };
    Alert.alert(title, message, [button]);
  };

  const value = {
    authState,
    currentUser,
    userIdentifer,
    otpId,
    magicLinkId,
    signOut,
    passkeyAuth,
    otpAuth,
    magicLinkAuth,
    activateOTP,
    resendOTP,
    checkMagicLink,
    resendMagicLink,
    addPasskey
  };

  return <PassageContext.Provider value={value}>{children}</PassageContext.Provider>;
}
