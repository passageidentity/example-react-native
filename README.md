<img src="https://storage.googleapis.com/passage-docs/passage-logo-gradient.svg" alt="Passage logo" style="width:250px;"/>

# Example React Native App with Passage Auth

### 🔑 The easiest way to get passkeys up and running for React Native

[Passage](https://passage.id/) and the [](https://github.com/passageidentity/passage-android)[Passage React Native SDK](https://github.com/passageidentity/passage-react-native) were built to make passkey authentication as fast, simple, and secure as possible. This example application is a great place to start. Before using Passage in your own React Native app, you can use this example app to:

- Plug in your own Passage app credentials to see passkeys in action
- Learn basic implementation of the Passage React Native SDK

A successful registration flow will look like this:

<img width="1069" alt="Screenshot 2023-05-15 at 5 42 31 PM" src="https://github.com/passageidentity/example-android/assets/16176400/22c00338-2912-4275-a3a3-02282aa85e66">

## Requirements

- Android Studio Electric Eel or newer
- Xcode 14 or newer
- A Passage account and Passage app (you can register for a free account [here](https://passage.id/))
- Completed registration of this example mobile app with your Passage app (view instructions [here](https://docs.passage.id/mobile/android/add-passage))

## Installation

```bash
npm install
cd ios && pod install && cd ..
```

## Configuration

### Add app id and auth origin

In the `strings.xml` file (ADD LINK) and `Passage.plist` file (ADD LINK) replace `YOUR_APP_ID` and `YOUR_AUTH_ORIGIN` with your app’s Passage app id and auth origin, respectively. Learn more about Passage app ids and auth origins [here](https://docs.passage.id/getting-started/creating-a-new-app).

<img width="1011" alt="Screenshot 2023-05-15 at 5 54 58 PM" src="https://github.com/passageidentity/example-android/assets/16176400/6bd89ecd-12c7-4f1f-a2cc-2c2e1daa9dfc">

(IOS SCREENSHOT HERE)

### Add iOS entitlement

(SCREENSHOT HERE)

### 🚀 Run the app!

```bash
npm run start
```

If all of the configuration was setup correctly, you should be able to run this application in the simulator or a real device!
