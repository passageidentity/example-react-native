import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { styles } from '../styles';
import { usePassage } from '../contexts/PassageContext';

export const Login: () => JSX.Element = () => {

  const {
    passkeyAuth,
    otpAuth,
    magicLinkAuth
  } = usePassage();

  const [showLogin, setShowLogin] = React.useState(false);
  const [validEmail, setValidEmail] = React.useState(false);
  const [emailInput, setEmailInput] = React.useState('');

  const onChangeInput = (input: string) => {
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const inputIsValidEmail = emailRegex.test(input);
    setValidEmail(inputIsValidEmail);
    setEmailInput(input);
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
        placeholder='example@email.com'
        returnKeyType='done'
        style={styles.input}
        textContentType='emailAddress'
      />
      <Pressable
        disabled={!validEmail}
        onPress={() => passkeyAuth(emailInput, showLogin)}
        style={[
          styles.primaryButton,
          { opacity: validEmail ? 1.0 : 0.3 }
        ]}
      >
        <Text style={styles.primaryButtonText}>Continue with Passkey</Text>
      </Pressable>
      <Pressable
        disabled={!validEmail}
        onPress={() => otpAuth(emailInput, showLogin)}
        style={[
          styles.primaryButton,
          { opacity: validEmail ? 1.0 : 0.3 }
        ]}
      >
        <Text style={styles.primaryButtonText}>Continue with One-Time Passcode</Text>
      </Pressable>
      <Pressable
        disabled={!validEmail}
        onPress={() => magicLinkAuth(emailInput, showLogin)}
        style={[
          styles.primaryButton,
          { opacity: validEmail ? 1.0 : 0.3 }
        ]}
      >
        <Text style={styles.primaryButtonText}>Continue with Magic Link</Text>
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
