import React from 'react';
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Passage, { AllowedFallbackAuth } from 'passage-react-native';

import { styles } from '../styles';
import { usePassage, AuthState } from '../contexts/PassageContext';

export const Login: () => JSX.Element = () => {

  const { setCurrentUser, setAuthFallbackId, setAuthState, setIsNewUser, setUserIdentifier } = usePassage();

  const [showLogin, setShowLogin] = React.useState(false);
  const [validEmail, setValidEmail] = React.useState(false);
  const [emailInput, setEmailInput] = React.useState('');

  const onChangeInput = (input: string) => {
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const inputIsValidEmail = emailRegex.test(input);
    setValidEmail(inputIsValidEmail);
    setEmailInput(input);
  };

  const onPressContinue = async () => {
    try {
      showLogin
        ? await Passage.loginWithPasskey()
        : await Passage.registerWithPasskey(emailInput);
      const user = await Passage.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      await attemptFallbackAuth();
      // TODO: Handle more granular errors once they're available (PSG-2281)
      console.error(error);
    }
  };

  const attemptFallbackAuth = async () => {
    try {
      const appInfo = await Passage.getAppInfo();
      if (appInfo.authFallbackMethod === AllowedFallbackAuth.LoginCode) {
        const otpId = showLogin
          ? await Passage.newLoginOneTimePasscode(emailInput)
          : await Passage.newRegisterOneTimePasscode(emailInput)
          setAuthFallbackId(otpId);
          setAuthState(AuthState.AwaitingVerificationOTP);
      } else if (appInfo.authFallbackMethod === AllowedFallbackAuth.MagicLink) {
        const magicLinkId = showLogin
          ? await Passage.newLoginMagicLink(emailInput)
          : await Passage.newRegisterMagicLink(emailInput)
        setAuthFallbackId(magicLinkId);
        setAuthState(AuthState.AwaitingVerificationMagicLink);
      }
      setIsNewUser(!showLogin);
      setUserIdentifier(emailInput);
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Problem authenticating',
        'Please try again',
        [{
          text: 'Dismiss',
          style: 'cancel',
        }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ showLogin ? 'Login' : 'Register' }</Text>
      <TextInput
        autoCapitalize='none'
        autoComplete='email'
        autoCorrect={false}
        keyboardType='email-address'
        onChangeText={onChangeInput}
        onFocus={() => showLogin && onPressContinue()}
        placeholder='example@email.com'
        returnKeyType='done'
        style={styles.input}
        textContentType='emailAddress'
      />
      <Pressable
        disabled={!validEmail}
        onPress={onPressContinue}
        style={[
          styles.primaryButton,
          { opacity: validEmail ? 1.0 : 0.3 }
        ]}
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
      </Pressable>
      <Pressable
        onPress={() => setShowLogin(!showLogin)}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>
          {
            showLogin
              ? "Don't have an account? Register"
              : 'Already have an account? Login'
          }
        </Text>
      </Pressable>
    </View>
  );
};
