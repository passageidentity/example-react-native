import React from 'react';
import {
  Alert,
  Pressable,
  Text,
  View,
} from 'react-native';
import Passage from 'passage-react-native';

import { styles } from '../styles';

type MagicLinkProps = {
  magicLinkId: string,
  identifier: string,
  isNewUser: boolean,
};

const MagicLink: (props: MagicLinkProps) => JSX.Element = ({ magicLinkId, identifier, isNewUser }) => {

  const [newMagicLinkId, setNewMagicLinkId] = React.useState<string | null>(null);

  const checkMagicLink = async () => {
    try {
      const authResult = await Passage.getMagicLinkStatus(newMagicLinkId || magicLinkId);
      if (authResult?.authToken !== null) {
        console.log(authResult!.authToken);
        // TODO: Handle successful auth event (PSG-2252)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMagicLinkInApp = async (magicLink: string) => {
    try {
      const authResult = await Passage.magicLinkActivate(magicLink);
      console.log(authResult.authToken);
      // TODO: Handle successful auth event (PSG-2252)
    } catch (error) {
      console.error(error);
    }
  };

  const onPressResend = async () => {
    try {
      const id = isNewUser
        ? await Passage.newRegisterMagicLink(identifier)
        : await Passage.newLoginMagicLink(identifier);
      setNewMagicLinkId(id);
      Alert.alert(
        'Magic link resent',
        undefined,
        [{
          text: 'Okay',
          style: 'cancel',
        }]
      );
    } catch (error) {
      Alert.alert(
        'Problem resending magic link',
        'Please try again',
        [{
          text: 'Dismiss',
          style: 'cancel',
        }]
      );
      console.error(error);
    }
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
          `A one-time link has been sent to\n${identifier}\nYou will be logged in here once you click that link.`
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

export default MagicLink;
