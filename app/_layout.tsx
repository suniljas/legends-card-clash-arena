import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { LoadingScreen } from '@/components/LoadingScreen';
import { SoundManagerProvider } from '@/components/SoundManager';
import {
  Orbitron_400Regular,
  Orbitron_700Bold,
  Orbitron_900Black
} from '@expo-google-fonts/orbitron';
import {
  Exo2_400Regular,
  Exo2_600SemiBold,
  Exo2_700Bold
} from '@expo-google-fonts/exo-2';
import * as SplashScreen from 'expo-splash-screen';
import { GameProvider } from '@/context/GameContext';
import { Platform } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Orbitron-Regular': Orbitron_400Regular,
    'Orbitron-Bold': Orbitron_700Bold,
    'Orbitron-Black': Orbitron_900Black,
    'Exo2-Regular': Exo2_400Regular,
    'Exo2-SemiBold': Exo2_600SemiBold,
    'Exo2-Bold': Exo2_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return <LoadingScreen message="Loading fonts..." />;
  }

  return (
    <GameProvider>
      <SoundManagerProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="tutorial" />
          <Stack.Screen name="battle" />
          <Stack.Screen name="deck-builder" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" backgroundColor="#0a0a0a" />
      </SoundManagerProvider>
    </GameProvider>
  );
}