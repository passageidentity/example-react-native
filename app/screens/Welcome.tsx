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
import { usePassage } from '../contexts/PassageContext';

export const Welcome: () => JSX.Element = () => {

  const { currentUser, signOut } = usePassage();

  if (!currentUser) {
    return <></>;
  }

  const addPasskey = async () => {
    try {
      const passkey = await Passage.addDevicePasskey();
      console.log(passkey);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.body}>{currentUser.email}</Text>
      {currentUser.webauthnDevices.map((device) => (
        <Text key={device.id} style={styles.body}>{device.friendlyName}</Text>
      ))}
      <Pressable
        onPress={addPasskey}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonText}>Add passkey</Text>
      </Pressable>
      <Pressable
        onPress={signOut}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>Sign out</Text>
      </Pressable>
    </View>
  );
};
