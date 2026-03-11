import { useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

export const getSubdomain = (url: string): string => {
	const hostname = url.split('.')[0];
	return hostname;
};

export const industryHeaderColor = (subdomain: string) => {
const sub = subdomain.split('//')[1];
	if (sub	 === 'cln') return '#07275c';
	if (sub	 === 'med') return '#002B5D';
	if (sub === 'vivos') return '#001E41';
	if (sub === 'fit') return '#2E2E43';
	if (sub === 'pro') return '#333C50';
	if (sub	 === 'craft') return '#4A494B';
	if (sub	 === 'go') return '#F3F9FD';

	return '#F3F9FD';
};


// Keep native splash visible until we hide it (after WebView loads)
SplashScreen.preventAutoHideAsync();

const PROD_HOST = 'https://program.dotfit.com';
const DEV_HOST = 'https://pro.pinpointguru.com/';


const SPLASH_HIDE_TIMEOUT_MS = 6000;
const DEFAULT_COLOR = '#333C50';

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const splashHiddenRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [currentWebViewUrl, setCurrentWebViewUrl] = useState('');

  const hideSplashOnce = useRef(() => {
    if (splashHiddenRef.current) return;
    splashHiddenRef.current = true;
    SplashScreen.hideAsync();
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      hideSplashOnce.current();
    }, SPLASH_HIDE_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (canGoBack) {
        webViewRef.current?.goBack();
      } else {
        BackHandler.exitApp();
      }
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [canGoBack]);

  const updateUrlFromWebView = (url?: string) => {
    if (!url) return;
    setCurrentWebViewUrl((prev) => (prev === url ? prev : url));
  };

  const subdomain = getSubdomain(currentWebViewUrl);
  const safeAreaColor = industryHeaderColor(subdomain);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: safeAreaColor }]}
        edges={['top', 'left', 'right']}
      >
        <StatusBar style="light" />
        {loading && (
          <View style={[styles.loadingBar, { backgroundColor: safeAreaColor }]}>
            <ActivityIndicator size="small" color="#FFF" />
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{ uri:DEV_HOST }}
          style={styles.webView}
          javaScriptEnabled
          domStorageEnabled
          onLoadStart={({ nativeEvent }) => {
            setLoading(true);
            updateUrlFromWebView(nativeEvent.url);
          }}
          onLoadEnd={() => {
            setLoading(false);
            hideSplashOnce.current();
          }}
          onLoadProgress={({ nativeEvent }) => {
            updateUrlFromWebView(nativeEvent.url);
            if (nativeEvent.progress === 1) {
              setLoading(false);
              hideSplashOnce.current();
            }
          }}
          onError={() => hideSplashOnce.current()}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
            updateUrlFromWebView(navState.url);
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DEFAULT_COLOR,
  },
  loadingBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: DEFAULT_COLOR,
  },
  webView: {
    flex: 1,
  },
});
