import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Search, Clock, Trophy, Zap } from 'lucide-react-native';

export default function MultiplayerScreen() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  const handleQuickMatch = () => {
    setIsSearching(true);
    // Simulate matchmaking
    setTimeout(() => {
      setIsSearching(false);
      // Here you would navigate to the actual battle
    }, 3000);
  };

  const recentMatches = [
    { id: 1, opponent: 'Shadow Master', result: 'win', time: '2 minutes ago' },
    { id: 2, opponent: 'Fire Knight', result: 'loss', time: '1 hour ago' },
    { id: 3, opponent: 'Crystal Mage', result: 'win', time: '3 hours ago' },
  ];

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a1a', '#0a0a0a']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Multiplayer Arena</Text>
          <Text style={styles.subtitle}>Challenge players from around the world</Text>
        </View>

        {/* Matchmaking Status */}
        <View style={styles.matchmakingContainer}>
          <LinearGradient
            colors={isSearching ? ['#00ff88', '#00cc6a'] : ['#2a2a2a', '#1a1a1a']}
            style={styles.matchmakingCard}
          >
            <View style={styles.matchmakingHeader}>
              <Users size={32} color="#fff" />
              <Text style={styles.matchmakingTitle}>
                {isSearching ? 'Searching for opponent...' : 'Ready to Battle'}
              </Text>
            </View>
            
            {isSearching ? (
              <View style={styles.searchingContainer}>
                <View style={styles.searchingSpinner}>
                  <Search size={24} color="#fff" />
                </View>
                <Text style={styles.searchingText}>Finding the perfect match...</Text>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsSearching(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.quickMatchButton}
                onPress={handleQuickMatch}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#ff0066', '#cc0050']}
                  style={styles.quickMatchGradient}
                >
                  <Zap size={24} color="#fff" />
                  <Text style={styles.quickMatchText}>Quick Match</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>

        {/* Game Modes */}
        <View style={styles.gameModesContainer}>
          <Text style={styles.sectionTitle}>Game Modes</Text>
          
          <View style={styles.gameMode}>
            <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.gameModeCard}>
              <View style={styles.gameModeHeader}>
                <Zap size={24} color="#00ff88" />
                <Text style={styles.gameModeTitle}>Ranked Battle</Text>
              </View>
              <Text style={styles.gameModeDescription}>
                Compete in ranked matches to climb the leaderboard
              </Text>
              <TouchableOpacity style={styles.gameModeButton}>
                <Text style={styles.gameModeButtonText}>Coming Soon</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={styles.gameMode}>
            <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.gameModeCard}>
              <View style={styles.gameModeHeader}>
                <Users size={24} color="#ffd700" />
                <Text style={styles.gameModeTitle}>Tournament</Text>
              </View>
              <Text style={styles.gameModeDescription}>
                Join tournaments with multiple players for bigger rewards
              </Text>
              <TouchableOpacity style={styles.gameModeButton}>
                <Text style={styles.gameModeButtonText}>Coming Soon</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Recent Matches */}
        <View style={styles.recentMatchesContainer}>
          <Text style={styles.sectionTitle}>Recent Matches</Text>
          
          {recentMatches.map((match) => (
            <View key={match.id} style={styles.matchCard}>
              <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.matchCardGradient}>
                <View style={styles.matchHeader}>
                  <Text style={styles.matchOpponent}>{match.opponent}</Text>
                  <View style={[
                    styles.matchResult,
                    { backgroundColor: match.result === 'win' ? '#00ff88' : '#ff0066' }
                  ]}>
                    <Text style={styles.matchResultText}>
                      {match.result === 'win' ? 'W' : 'L'}
                    </Text>
                  </View>
                </View>
                <View style={styles.matchFooter}>
                  <Clock size={16} color="#ccc" />
                  <Text style={styles.matchTime}>{match.time}</Text>
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* Online Players */}
        <View style={styles.onlinePlayersContainer}>
          <Text style={styles.sectionTitle}>Online Players</Text>
          <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.onlinePlayersCard}>
            <View style={styles.onlinePlayersHeader}>
              <Users size={24} color="#00ff88" />
              <Text style={styles.onlinePlayersCount}>1,247 players online</Text>
            </View>
            <Text style={styles.onlinePlayersDescription}>
              Join the community and challenge other players!
            </Text>
          </LinearGradient>
        </View>
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
  matchmakingContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  matchmakingCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  matchmakingHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  matchmakingTitle: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
  },
  searchingContainer: {
    alignItems: 'center',
  },
  searchingSpinner: {
    marginBottom: 12,
  },
  searchingText: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#fff',
    marginBottom: 16,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Exo2-SemiBold',
    color: '#fff',
  },
  quickMatchButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickMatchGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  quickMatchText: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  gameModesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  gameMode: {
    marginBottom: 12,
  },
  gameModeCard: {
    borderRadius: 12,
    padding: 16,
  },
  gameModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  gameModeTitle: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  gameModeDescription: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    marginBottom: 12,
  },
  gameModeButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  gameModeButtonText: {
    fontSize: 12,
    fontFamily: 'Exo2-SemiBold',
    color: '#ccc',
  },
  recentMatchesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  matchCard: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  matchCardGradient: {
    padding: 12,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchOpponent: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  matchResult: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchResultText: {
    fontSize: 14,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  matchFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchTime: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
  },
  onlinePlayersContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  onlinePlayersCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  onlinePlayersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  onlinePlayersCount: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  onlinePlayersDescription: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    textAlign: 'center',
  },
});