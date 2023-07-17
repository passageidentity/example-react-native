import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { usePassage, AuthState } from '../contexts/PassageContext';
import { styles } from '../styles';

export const MagicLink: () => JSX.Element = () => {

  const {
    authState,
    checkMagicLink,
    resendMagicLink,
    userIdentifer,
  } = usePassage();

  const isNewUser = authState === AuthState.AwaitingRegisterVerificationMagicLink;

  const onPressResend = async () => {
    await resendMagicLink();
  };

  // Check if magic link has been activated outside of app every 2 seconds.
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      checkMagicLink();
    }, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Check email to ${isNewUser ? 'Register' : 'Login'}`}</Text>
      <Text style={styles.body}>
        {
          `A one-time link has been sent to\n${userIdentifer}\nYou will be logged in here once you click that link.`
        }
      </Text>
      <Pressable
        onPress={onPressResend}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>Resend link</Text>
      </Pressable>
    </View>
  );
};
