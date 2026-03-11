# DotFit Me (Expo)

React Native (Expo) version of the Pinpoint PRO app. Full-screen WebView loading the Pinpoint Guru PRO, with loading indicator and Android back-button handling.

## Run locally

```bash
npm install
npx expo start
```

Then press `a` for Android or `i` for iOS simulator, or scan the QR code with Expo Go.

## Build for release

- **EAS Build:** `npx eas build --platform android` (or `--platform ios` / `--platform all`).
- Configure `eas.json` and run `eas build:configure` if needed.

## App identity

- Android package: `com.proxi.pro`
- iOS bundle identifier: `com.proxi.pro`

## Behavior

- **URL:** `https://pro.pinpointguru.com/` (production). In dev mode, `https://pro.pinpointguru.com/`.
- **Loading:** Progress indicator at the top while the page loads.
- **Back (Android):** If the WebView can go back, it goes back; otherwise the app exits.