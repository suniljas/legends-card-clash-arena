import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, BackHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useGame } from '@/context/GameContext';
import { BattleSystem } from '@/components/BattleSystem';
import { Card } from '@/types/game';

export default function BattleScreen() {
  const { battle, endBattle, gameState, updatePlayer, player } = useGame();

  useEffect(() => {
    if (!battle) {
      router.replace('/(tabs)/battle');
      return;
    }

    // Handle back button on Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleSurrender();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  if (!battle) {
    return null;
  }

  const handleCardPlay = (card: Card) => {
    // Calculate damage
    let damage = card.attack;
    let healing = 0;

    if (card.abilities?.includes('Heal')) {
      const healAmount = parseInt(card.abilities.find(a => a.startsWith('Heal:'))?.split(':')[1] || '0');
      healing = healAmount;
    }

    // Simulate card play (in real implementation, this would update battle state)
    console.log(`Playing card: ${card.name}, Damage: ${damage}, Healing: ${healing}`);
  };

  const handleEndTurn = () => {
    // Simulate turn end
    console.log('Turn ended');
  };

  const handleSurrender = () => {
    Alert.alert(
      'Surrender',
      'Are you sure you want to surrender this battle?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Surrender', 
          style: 'destructive',
          onPress: () => {
            // Give small consolation reward
            updatePlayer({ 
              coins: player.coins + 10,
              experience: player.experience + 25 
            });
            endBattle('opponent');
            router.replace('/(tabs)');
          }
        },
      ]
    );
  };

  return (
    <BattleSystem
      battle={battle}
      onCardPlay={handleCardPlay}
      onEndTurn={handleEndTurn}
      onSurrender={handleSurrender}
      soundEnabled={gameState.settings.soundEnabled}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});