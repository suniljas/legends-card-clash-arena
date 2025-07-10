import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useGame } from '@/context/GameContext';
import { generateOpponents } from '@/utils/gameUtils';
import { Player } from '@/types/game';
import { Sword, Shield, Zap, Crown } from 'lucide-react-native';

export default function BattleScreen() {
  const { player, startBattle } = useGame();
  const [opponents] = useState<Player[]>(generateOpponents());
  const [selectedOpponent, setSelectedOpponent] = useState<Player | null>(null);

  const handleBattleStart = (opponent: Player) => {
    if (player.decks.length === 0) {
      Alert.alert(
        'No Deck Available',
        'You need to build a deck first. Would you like to go to the deck builder?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Build Deck', onPress: () => router.push('/deck-builder') },
        ]
      );
      return;
    }

    startBattle(opponent);
    router.push('/battle');
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 3) return '#00ff88';
    if (level <= 6) return '#ffd700';
    if (level <= 9) return '#ff6b35';
    return '#ff0066';
  };

  const getDifficultyLabel = (level: number) => {
    if (level <= 3) return 'Easy';
    if (level <= 6) return 'Medium';
    if (level <= 9) return 'Hard';
    return 'Expert';
  };

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a1a', '#0a0a0a']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Opponent</Text>
          <Text style={styles.subtitle}>Select an opponent to battle against</Text>
        </View>

        {/* Player Info */}
        <View style={styles.playerInfoContainer}>
          <LinearGradient colors={['#00ff88', '#00cc6a']} style={styles.playerCard}>
            <View style={styles.playerHeader}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerLevel}>Level {player.level}</Text>
            </View>
            <View style={styles.playerStats}>
              <View style={styles.statItem}>
                <Sword size={16} color="#fff" />
                <Text style={styles.statText}>{player.stats.gamesWon} Wins</Text>
              </View>
              <View style={styles.statItem}>
                <Shield size={16} color="#fff" />
                <Text style={styles.statText}>{player.cards.length} Cards</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Opponents List */}
        <View style={styles.opponentsContainer}>
          <Text style={styles.sectionTitle}>Available Opponents</Text>
          
          {opponents.map((opponent, index) => (
            <TouchableOpacity
              key={opponent.id}
              style={[
                styles.opponentCard,
                selectedOpponent?.id === opponent.id && styles.selectedOpponent
              ]}
              onPress={() => setSelectedOpponent(opponent)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#2a2a2a', '#1a1a1a']}
                style={styles.opponentGradient}
              >
                <View style={styles.opponentHeader}>
                  <View style={styles.opponentInfo}>
                    <Text style={styles.opponentName}>{opponent.name}</Text>
                    <Text style={[
                      styles.opponentLevel,
                      { color: getDifficultyColor(opponent.level) }
                    ]}>
                      Level {opponent.level} • {getDifficultyLabel(opponent.level)}
                    </Text>
                  </View>
                  
                  <View style={styles.opponentBadge}>
                    {opponent.level >= 10 && <Crown size={20} color="#ffd700" />}
                    {opponent.level >= 7 && opponent.level < 10 && <Zap size={20} color="#ff6b35" />}
                    {opponent.level < 7 && <Shield size={20} color="#00ff88" />}
                  </View>
                </View>

                <View style={styles.opponentStats}>
                  <View style={styles.opponentStatItem}>
                    <Text style={styles.opponentStatValue}>{opponent.stats.gamesWon}</Text>
                    <Text style={styles.opponentStatLabel}>Wins</Text>
                  </View>
                  <View style={styles.opponentStatItem}>
                    <Text style={styles.opponentStatValue}>{opponent.stats.gamesPlayed}</Text>
                    <Text style={styles.opponentStatLabel}>Games</Text>
                  </View>
                  <View style={styles.opponentStatItem}>
                    <Text style={styles.opponentStatValue}>
                      {opponent.stats.gamesPlayed > 0
                        ? Math.round((opponent.stats.gamesWon / opponent.stats.gamesPlayed) * 100)
                        : 0}%
                    </Text>
                    <Text style={styles.opponentStatLabel}>Win Rate</Text>
                  </View>
                </View>

                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardLabel}>Victory Rewards:</Text>
                  <Text style={styles.rewardText}>
                    {50 + opponent.level * 10} Coins • {10 + opponent.level * 5} XP
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Battle Button */}
        {selectedOpponent && (
          <View style={styles.battleButtonContainer}>
            <TouchableOpacity
              style={styles.battleButton}
              onPress={() => handleBattleStart(selectedOpponent)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ff0066', '#cc0050']}
                style={styles.battleButtonGradient}
              >
                <Sword size={24} color="#fff" />
                <Text style={styles.battleButtonText}>Start Battle</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    textAlign: 'center',
  },
  playerInfoContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  playerCard: {
    borderRadius: 12,
    padding: 16,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerName: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  playerLevel: {
    fontSize: 14,
    fontFamily: 'Exo2-Bold',
    color: '#fff',
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Exo2-SemiBold',
    color: '#fff',
  },
  opponentsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  opponentCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedOpponent: {
    borderColor: '#00ff88',
    borderWidth: 2,
  },
  opponentGradient: {
    padding: 16,
  },
  opponentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  opponentInfo: {
    flex: 1,
  },
  opponentName: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  opponentLevel: {
    fontSize: 14,
    fontFamily: 'Exo2-SemiBold',
  },
  opponentBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  opponentStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  opponentStatItem: {
    alignItems: 'center',
  },
  opponentStatValue: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#00ff88',
  },
  opponentStatLabel: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
  },
  rewardInfo: {
    alignItems: 'center',
  },
  rewardLabel: {
    fontSize: 14,
    fontFamily: 'Exo2-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#ffd700',
  },
  battleButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  battleButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  battleButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  battleButtonText: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
});