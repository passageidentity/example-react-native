import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

import { PassageProvider, usePassage, AuthState } from './contexts/PassageContext';
import {
  Login,
  MagicLink,
  OneTimePasscode,
  Welcome,
} from './screens';
import { styles } from './styles';

const Screen: () => JSX.Element = () => {
  const { authState } = usePassage();
  switch (+authState) {
    case AuthState.Unauthenticated:
      return <Login />;
    case AuthState.AwaitingRegisterVerificationMagicLink, AuthState.AwaitingLoginVerificationMagicLink:
      return <MagicLink />;
    case AuthState.AwaitingRegisterVerificationOTP, AuthState.AwaitingLoginVerificationOTP:
      return <OneTimePasscode />;
    case AuthState.Authenticated:
      return <Welcome />;
    default: return <></>;
  }
};

const App: () => JSX.Element = () => {
  return (
    <SafeAreaView style={styles.app}>
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

export default App;
