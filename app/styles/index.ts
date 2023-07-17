import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  app: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    alignItems: 'stretch',
    padding: 22,
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 18,
    textAlign: 'center',
  },
  body: {
    color: 'black',
    fontSize: 14,
    marginVertical: 18,
    textAlign: 'center',
  },
  input: {
    borderColor: 'lightgray',
    borderRadius: 9,
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#3D53F6',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#3D53F6',
    fontWeight: '600',
    opacity: 0.8,
  },
});
