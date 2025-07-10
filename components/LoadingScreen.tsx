import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sword, Shield, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface LoadingScreenProps {
  message?: string;
  progress?: number;
}

export function LoadingScreen({ message = 'Loading...', progress }: LoadingScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Continuous rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a1a', '#0a0a0a']} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Logo/Icon */}
        <Animated.View 
          style={[
            styles.logoContainer,
            { 
              transform: [
                { rotate: spin },
                { scale: pulseAnim }
              ]
            }
          ]}
        >
          <LinearGradient colors={['#00ff88', '#00cc6a']} style={styles.logoBackground}>
            <Sword size={48} color="#fff" />
          </LinearGradient>
        </Animated.View>

        {/* Game Title */}
        <Text style={styles.title}>Card Clash Legends</Text>
        <Text style={styles.subtitle}>Arena</Text>

        {/* Loading Message */}
        <Text style={styles.message}>{message}</Text>

        {/* Progress Bar */}
        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { width: `${Math.max(0, Math.min(100, progress))}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}

        {/* Animated Icons */}
        <View style={styles.iconsContainer}>
          <Animated.View style={[styles.icon, { opacity: pulseAnim }]}>
            <Shield size={24} color="#3B82F6" />
          </Animated.View>
          <Animated.View style={[styles.icon, { opacity: pulseAnim, animationDelay: '0.5s' }]}>
            <Zap size={24} color="#8B5CF6" />
          </Animated.View>
          <Animated.View style={[styles.icon, { opacity: pulseAnim, animationDelay: '1s' }]}>
            <Sword size={24} color="#F59E0B" />
          </Animated.View>
        </View>

        {/* Loading Dots */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity: pulseAnim,
                  transform: [
                    {
                      translateY: Animated.multiply(
                        pulseAnim,
                        new Animated.Value(index * 2)
                      )
                    }
                  ]
                }
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Orbitron-Regular',
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 1,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 24,
  },
  progressContainer: {
    width: width * 0.7,
    alignItems: 'center',
    marginBottom: 32,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Exo2-SemiBold',
    color: '#00ff88',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 32,
  },
  icon: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff88',
  },
});