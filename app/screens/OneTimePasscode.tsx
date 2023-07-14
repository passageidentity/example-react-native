import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { styles } from '../styles';
import { usePassage, AuthState } from '../contexts/PassageContext';

export const OneTimePasscode: () => JSX.Element = () => {

  const {
    activateOTP,
    resendOTP,
    authState,
    userIdentifer,
  } = usePassage();

  const [otpInput, setOtpInput] = React.useState('');
  const [isOtpValid, setIsOtpValid] = React.useState(false);

  const isNewUser = authState === AuthState.AwaitingRegisterVerificationOTP;

  const onChangeInput = (input: string) => {
    const inputIsValidOTP = input.length > 5;
    setIsOtpValid(inputIsValidOTP);
    setOtpInput(input);
  };

  const onPressContinue = async () => {
    await activateOTP(otpInput);
  };

  const onPressResend = async () => {
    await resendOTP();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter code</Text>
      <Text style={styles.body}>
        {
          `A one-time code has been sent to\n${userIdentifer}\nEnter the code here to ${isNewUser ? 'register' : 'login'}.`
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
      </Pressable>
    </View>
  );
};
