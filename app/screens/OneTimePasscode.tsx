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

type OneTimePasscodeProps = {
  otpId: string,
  identifier: string,
  isNewUser: boolean,
};

const OneTimePasscode: (props: OneTimePasscodeProps) => JSX.Element = ({ otpId, identifier, isNewUser }) => {

  const [otpInput, setOtpInput] = React.useState('');
  const [isOtpValid, setIsOtpValid] = React.useState(false);
  const [newOtpId, setNewOtpId] = React.useState<string | null>(null);

  const onChangeInput = (input: string) => {
    const inputIsValidOTP = input.length > 5;
    setIsOtpValid(inputIsValidOTP);
    setOtpInput(input);
  };

  const onPressContinue = async () => {
    try {
      const authResult = await Passage.oneTimePasscodeActivate(otpInput, newOtpId || otpId);
      console.log(authResult.authToken);
      // TODO: Handle successful auth event (PSG-2252)
    } catch (error) {
      Alert.alert(
        'Problem with passcode',
        'Please try again',
        [{
          text: 'Dismiss',
          style: 'cancel',
        }]
      );
      console.error(error)
    }
  };

  const onPressResend = async () => {
    try {
      const id = isNewUser
        ? await Passage.newRegisterOneTimePasscode(identifier)
        : await Passage.newLoginOneTimePasscode(identifier);
      setNewOtpId(id);
      Alert.alert(
        'Passcode resent',
        undefined,
        [{
          text: 'Okay',
          style: 'cancel',
        }]
      );
    } catch (error) {
      Alert.alert(
        'Problem resending passcode',
        'Please try again',
        [{
          text: 'Dismiss',
          style: 'cancel',
        }]
      );
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter code</Text>
      <Text style={styles.body}>
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
      </Pressable>
    </View>
  );
};

export default OneTimePasscode;
