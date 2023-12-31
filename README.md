<img src="https://storage.googleapis.com/passage-docs/Lockup%20Vertical%20color.png" alt="Passage logo" style="width:250px;"/>

# Example React Native App with Passage Auth

### 🔑 The easiest way to get passkeys up and running for React Native

[Passage](https://passage.id/) and the [Passage React Native SDK](https://github.com/passageidentity/passage-react-native) were built to make passkey authentication as fast, simple, and secure as possible. This example application is a great place to start. Before using Passage in your own React Native app, you can use this example app to:

- Plug in your own Passage app credentials to see passkeys in action
- Learn basic implementation of the Passage React Native SDK

A successful registration flow will look like this:

<img src="https://storage.googleapis.com/passage-docs/passage_react_native_example_screens.png" alt="Passage React Native Example" />


## Requirements

- Android Studio Electric Eel or newer
- Xcode 14 or newer
- A Passage account and Passage app (you can register for a free account [here](https://passage.id/))
- Completed setup of
  - Associated Domains file (iOS) ([view instructions](https://docs.passage.id/mobile/ios/add-passage#step-1-publish-associated-domains-file))
  - Asset Links file (Android) ([view instructions](https://docs.passage.id/mobile/android/add-passage#step-1-publish-digital-asset-links-file))
  - Key hash registration (Android) ([view instructions](https://docs.passage.id/mobile/android/add-passage#step-2-register-your-android-app-with-passage))

## Installation

```bash
npm install
cd ios && pod install && cd ..
```

## Configuration
To get this example React Native app working with your Passage account/app, you'll need to swap out the placeholder authentication origin with your own. Learn more about Passage auth origins [here](https://docs.passage.id/console-administration/apps#app-core-settings).


### iOS
You'll need to open up Xcode and replace `YOUR_AUTH_ORIGIN` in the Associated Domains section.
<img width="600" alt="Passage iOS entitlement setup" src="https://storage.googleapis.com/passage-docs/passage-ios-entitlements.png">

### Android

In the `strings.xml` file ([found here](https://github.com/passageidentity/example-react-native/blob/main/android/app/src/main/res/values/strings.xml)) replace `YOUR_AUTH_ORIGIN` with your app’s Passage app id and auth origin, respectively.

```xml
<resources>
    <string name="app_name">ExampleReactNative</string>

    <!-- Required Passage app settings -->
    <string name="passage_auth_origin">YOUR_APP_ORIGIN</string>
    ...
</resources>
```

### Final step
Lastly, replace `YOUR_APP_ID` in the `PassageContext.tsx` file [here](https://github.com/passageidentity/example-react-native/blob/main/app/contexts/PassageContext.tsx).

```typescript
const passage = new Passage('YOUR_APP_ID');
```

## 🚀 Run the app!

```bash
npm run start
```

If all of the configuration was setup correctly, you should be able to run this application in the simulator or a real device!
