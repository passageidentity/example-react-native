import React from 'react';
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Passage from 'passage-react-native';

import { styles } from '../styles';

export const Welcome: () => JSX.Element = () => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      {/* <Text style={styles.body}>
        {
          `A one-time code has been sent to\n${identifier}\nEnter the code here to ${isNewUser ? 'register' : 'login'}.`
        }
      </Text>
      <TextInput
        autoCapitalize='none'
        autoComplete='one-time-code'
        autoCorrect={false}
        keyboardType='number-pad'
        onChangeText={onChangeInput}
        placeholder='Your code'
        returnKeyType='done'
        style={styles.input}
        textContentType='oneTimeCode'
      />
      <Pressable
        disabled={!isOtpValid}
        onPress={onPressContinue}
        style={[
          styles.primaryButton,
          { opacity: isOtpValid ? 1.0 : 0.3 }
        ]}
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
      </Pressable>
      <Pressable
        onPress={onPressResend}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>Resend code</Text>
      </Pressable> */}
    </View>
  );
};
