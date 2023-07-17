import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { styles } from '../styles';
import { usePassage } from '../contexts/PassageContext';

export const Login: () => JSX.Element = () => {

  const { login, register } = usePassage();

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
    if (showLogin) {
      await login(emailInput);
    } else {
      await register(emailInput);
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
