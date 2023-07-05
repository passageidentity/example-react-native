import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
} from 'react-native';

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login: () => JSX.Element = () => {

  const [showLogin, setShowLogin] = React.useState(false);
  const [validEmail, setValidEmail] = React.useState(false);
  const [emailInput, setEmailInput] = React.useState('');

  const onChangeInput = (input: string) => {
    const inputIsValidEmail = emailRegex.test(input);
    setValidEmail(inputIsValidEmail);
    setEmailInput(emailInput);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ showLogin ? 'Login' : 'Register' }</Text>
      <TextInput
        style={styles.input}
        placeholder='example@email.com'
        keyboardType='email-address'
        returnKeyType='done'
        autoCorrect={false}
        textContentType='emailAddress'
        autoCapitalize='none'
        autoComplete='email'
        onChangeText={onChangeInput}
      />
      <Pressable
        style={[
          styles.primaryButton,
          { opacity: validEmail ? 1.0 : 0.3 }
        ]}
        disabled={!validEmail}
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
      </Pressable>
      <Pressable
        onPress={() => setShowLogin(!showLogin)}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>{ showLogin ? "Don't have an account? Register" : 'Already have an account? Login' }</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    padding: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 18,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 9,
    padding: 10,
    marginBottom: 12,
  },
  primaryButton: {
    height: 44,
    backgroundColor: '#3D53F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  secondaryButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#3D53F6',
    fontWeight: '600',
    opacity: 0.8,
  },
});

export default Login;
