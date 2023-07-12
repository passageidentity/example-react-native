import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

import {
  Login,
  MagicLink,
  OneTimePasscode,
  Welcome,
} from './screens';

import { PassageProvider, usePassage, AuthState } from './contexts/PassageContext';

const Screen: () => JSX.Element = () => {
  const { authState } = usePassage();
  switch (+authState) {
    case AuthState.Unauthenticated:
      return <Login />;
    case AuthState.AwaitingVerificationMagicLink:
      return <MagicLink />;
    case AuthState.AwaitingVerificationOTP:
      return <OneTimePasscode />;
    case AuthState.Authenticated:
      return <Welcome />;
    default: return <></>;
  }
};


const App: () => JSX.Element = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor='white'
      />
      <PassageProvider>
        <Screen />
      </PassageProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
});

export default App;
