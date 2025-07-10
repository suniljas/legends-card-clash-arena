import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, BattleState } from '@/types/game';
import { GameCard } from './GameCard';
import { Sword, Shield, Zap, Heart, Clock, Volume2 } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface BattleSystemProps {
  battle: BattleState;
  onCardPlay: (card: Card) => void;
  onEndTurn: () => void;
  onSurrender: () => void;
  soundEnabled: boolean;
}

export function BattleSystem({ 
  battle, 
  onCardPlay, 
  onEndTurn, 
  onSurrender, 
  soundEnabled 
}: BattleSystemProps) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [turnTimer, setTurnTimer] = useState(30);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation values
  const playerHealthAnim = useRef(new Animated.Value(1)).current;
  const opponentHealthAnim = useRef(new Animated.Value(1)).current;
  const cardPlayAnim = useRef(new Animated.Value(0)).current;
  const turnIndicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Turn timer
    const timer = setInterval(() => {
      setTurnTimer(prev => {
        if (prev <= 1) {
          onEndTurn();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [battle.turn]);

  useEffect(() => {
    // Turn indicator animation
    Animated.timing(turnIndicatorAnim, {
      toValue: battle.turn === 'player' ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [battle.turn]);

  const playSound = (frequency: number, duration: number) => {
    if (!soundEnabled || Platform.OS === 'web') return;
    
    // Web Audio API implementation for cross-platform sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Audio not supported:', error);
    }
  };

  const animateHealthChange = (isPlayer: boolean) => {
    const anim = isPlayer ? playerHealthAnim : opponentHealthAnim;
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateCardPlay = () => {
    Animated.sequence([
      Animated.timing(cardPlayAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cardPlayAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCardPlay = (card: Card) => {
    if (battle.turn !== 'player' || isAnimating || battle.gameOver) return;
    if (battle.player.energy < card.cost) return;

    setIsAnimating(true);
    playSound(440, 0.2);
    animateCardPlay();
    
    setTimeout(() => {
      onCardPlay(card);
      setIsAnimating(false);
    }, 300);
  };

  const getTimerColor = () => {
    if (turnTimer > 20) return '#00ff88';
    if (turnTimer > 10) return '#ffd700';
    return '#ff0066';
  };

  return (
    <View style={styles.container}>
      {/* Turn Indicator */}
      <Animated.View 
        style={[
          styles.turnIndicator,
          {
            opacity: turnIndicatorAnim,
            transform: [{
              translateY: turnIndicatorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              })
            }]
          }
        ]}
      >
        <LinearGradient colors={['#00ff88', '#00cc6a']} style={styles.turnIndicatorGradient}>
          <Text style={styles.turnIndicatorText}>Your Turn</Text>
          <View style={styles.timerContainer}>
            <Clock size={16} color="#fff" />
            <Text style={[styles.timerText, { color: getTimerColor() }]}>
              {turnTimer}s
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Opponent Area */}
      <View style={styles.opponentArea}>
        <Animated.View style={[styles.playerCard, { transform: [{ scale: opponentHealthAnim }] }]}>
          <LinearGradient colors={['#ff0066', '#cc0050']} style={styles.playerCardGradient}>
            <Text style={styles.playerName}>{battle.opponent.name}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Heart size={16} color="#fff" />
                <Text style={styles.statText}>{battle.opponent.health}/100</Text>
              </View>
              <View style={styles.statItem}>
                <Zap size={16} color="#fff" />
                <Text style={styles.statText}>{battle.opponent.energy}/10</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Opponent Hand (face down) */}
        <View style={styles.opponentHand}>
          {battle.opponent.hand.map((_, index) => (
            <View key={index} style={styles.faceDownCard}>
              <LinearGradient colors={['#333', '#555']} style={styles.cardBack}>
                <Text style={styles.cardBackText}>?</Text>
              </LinearGradient>
            </View>
          ))}
        </View>
      </View>

      {/* Battle Log */}
      <View style={styles.battleLogContainer}>
        <LinearGradient colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']} style={styles.battleLog}>
          {battle.battleLog.slice(-3).map((log, index) => (
            <Text key={index} style={styles.logText}>{log}</Text>
          ))}
        </LinearGradient>
      </View>

      {/* Player Area */}
      <View style={styles.playerArea}>
        <View style={styles.playerHand}>
          {battle.player.hand.map((card) => (
            <TouchableOpacity
              key={card.id}
              onPress={() => handleCardPlay(card)}
              disabled={battle.turn !== 'player' || isAnimating || battle.player.energy < card.cost}
              style={[
                styles.handCard,
                battle.player.energy < card.cost && styles.unaffordableCard,
                selectedCard?.id === card.id && styles.selectedCard,
              ]}
            >
              <GameCard 
                card={card} 
                size="small" 
                disabled={battle.player.energy < card.cost}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Animated.View style={[styles.playerCard, { transform: [{ scale: playerHealthAnim }] }]}>
          <LinearGradient colors={['#00ff88', '#00cc6a']} style={styles.playerCardGradient}>
            <Text style={styles.playerName}>{battle.player.name}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Heart size={16} color="#fff" />
                <Text style={styles.statText}>{battle.player.health}/100</Text>
              </View>
              <View style={styles.statItem}>
                <Zap size={16} color="#fff" />
                <Text style={styles.statText}>{battle.player.energy}/10</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={onEndTurn}
          disabled={battle.turn !== 'player' || isAnimating}
          style={[styles.actionButton, styles.endTurnButton]}
        >
          <Text style={styles.actionButtonText}>End Turn</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={onSurrender}
          style={[styles.actionButton, styles.surrenderButton]}
        >
          <Text style={styles.actionButtonText}>Surrender</Text>
        </TouchableOpacity>
      </View>

      {/* Card Play Animation */}
      <Animated.View 
        style={[
          styles.cardPlayEffect,
          {
            opacity: cardPlayAnim,
            transform: [{ scale: cardPlayAnim }],
          }
        ]}
      >
        <Sword size={48} color="#fff" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  turnIndicator: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 100,
  },
  turnIndicatorGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  turnIndicatorText: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'Exo2-Bold',
  },
  opponentArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 120,
    justifyContent: 'flex-start',
  },
  playerArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
    justifyContent: 'flex-end',
  },
  playerCard: {
    marginVertical: 12,
  },
  playerCardGradient: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  playerName: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Exo2-SemiBold',
    color: '#fff',
  },
  opponentHand: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  playerHand: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  faceDownCard: {
    width: 60,
    height: 80,
  },
  cardBack: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#666',
  },
  cardBackText: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#999',
  },
  handCard: {
    transform: [{ scale: 1 }],
  },
  selectedCard: {
    transform: [{ scale: 1.05 }],
  },
  unaffordableCard: {
    opacity: 0.5,
  },
  battleLogContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    height: 80,
  },
  battleLog: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  logText: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    marginBottom: 4,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  endTurnButton: {
    backgroundColor: '#00ff88',
  },
  surrenderButton: {
    backgroundColor: '#ff0066',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  cardPlayEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -24,
    marginLeft: -24,
    zIndex: 1000,
  },
});