import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { usePassage } from '../contexts/PassageContext';
import { styles } from '../styles';

export const Welcome: () => JSX.Element = () => {

  const { currentUser, signOut, addPasskey } = usePassage();

  if (!currentUser) {
    return <></>;
  }

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
