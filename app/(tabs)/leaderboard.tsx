import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Medal, Crown, Star } from 'lucide-react-native';
import { useGame } from '@/context/GameContext';

export default function LeaderboardScreen() {
  const { player } = useGame();
  const [selectedTab, setSelectedTab] = useState<'global' | 'friends' | 'weekly'>('global');

  // Mock leaderboard data
  const globalLeaderboard = [
    { id: 1, name: 'DragonSlayer', level: 25, wins: 1250, rank: 1, rating: 2850 },
    { id: 2, name: 'ShadowMaster', level: 23, wins: 1100, rank: 2, rating: 2720 },
    { id: 3, name: 'CrystalMage', level: 22, wins: 1050, rank: 3, rating: 2650 },
    { id: 4, name: 'FireKnight', level: 21, wins: 980, rank: 4, rating: 2580 },
    { id: 5, name: 'IceQueen', level: 20, wins: 920, rank: 5, rating: 2520 },
    { id: 6, name: 'StormLord', level: 19, wins: 850, rank: 6, rating: 2450 },
    { id: 7, name: 'NightHawk', level: 18, wins: 780, rank: 7, rating: 2380 },
    { id: 8, name: 'GoldRush', level: 17, wins: 720, rank: 8, rating: 2320 },
    { id: 9, name: 'SilverBlade', level: 16, wins: 680, rank: 9, rating: 2280 },
    { id: 10, name: 'BronzeWarrior', level: 15, wins: 640, rank: 10, rating: 2240 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={24} color="#ffd700" />;
      case 2:
        return <Trophy size={24} color="#c0c0c0" />;
      case 3:
        return <Medal size={24} color="#cd7f32" />;
      default:
        return <Star size={24} color="#666" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#ffd700';
      case 2:
        return '#c0c0c0';
      case 3:
        return '#cd7f32';
      default:
        return '#666';
    }
  };

  const tabs = [
    { id: 'global', label: 'Global', icon: <Trophy size={20} color="#fff" /> },
    { id: 'friends', label: 'Friends', icon: <Star size={20} color="#fff" /> },
    { id: 'weekly', label: 'Weekly', icon: <Medal size={20} color="#fff" /> },
  ];

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a1a', '#0a0a0a']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>See how you rank against other players</Text>
        </View>

        {/* Player Rank Card */}
        <View style={styles.playerRankContainer}>
          <LinearGradient colors={['#00ff88', '#00cc6a']} style={styles.playerRankCard}>
            <View style={styles.playerRankHeader}>
              <View style={styles.playerRankInfo}>
                <Text style={styles.playerRankName}>{player.name}</Text>
                <Text style={styles.playerRankLevel}>Level {player.level}</Text>
              </View>
              <View style={styles.playerRankPosition}>
                <Text style={styles.playerRankNumber}>#247</Text>
                <Text style={styles.playerRankLabel}>Global Rank</Text>
              </View>
            </View>
            <View style={styles.playerRankStats}>
              <View style={styles.playerRankStat}>
                <Text style={styles.playerRankStatValue}>{player.stats.gamesWon}</Text>
                <Text style={styles.playerRankStatLabel}>Wins</Text>
              </View>
              <View style={styles.playerRankStat}>
                <Text style={styles.playerRankStatValue}>1847</Text>
                <Text style={styles.playerRankStatLabel}>Rating</Text>
              </View>
              <View style={styles.playerRankStat}>
                <Text style={styles.playerRankStatValue}>
                  {player.stats.gamesPlayed > 0
                    ? Math.round((player.stats.gamesWon / player.stats.gamesPlayed) * 100)
                    : 0}%
                </Text>
                <Text style={styles.playerRankStatLabel}>Win Rate</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                selectedTab === tab.id && styles.activeTab
              ]}
              onPress={() => setSelectedTab(tab.id as any)}
              activeOpacity={0.8}
            >
              {tab.icon}
              <Text style={[
                styles.tabText,
                selectedTab === tab.id && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Leaderboard List */}
        <View style={styles.leaderboardContainer}>
          {selectedTab === 'global' && (
            <>
              {globalLeaderboard.map((entry, index) => (
                <View key={entry.id} style={styles.leaderboardEntry}>
                  <LinearGradient
                    colors={index < 3 ? ['#2a2a2a', '#3a3a3a'] : ['#1a1a1a', '#2a2a2a']}
                    style={styles.leaderboardEntryGradient}
                  >
                    <View style={styles.leaderboardRank}>
                      {getRankIcon(entry.rank)}
                      <Text style={[
                        styles.leaderboardRankText,
                        { color: getRankColor(entry.rank) }
                      ]}>
                        #{entry.rank}
                      </Text>
                    </View>

                    <View style={styles.leaderboardInfo}>
                      <Text style={styles.leaderboardName}>{entry.name}</Text>
                      <Text style={styles.leaderboardLevel}>Level {entry.level}</Text>
                    </View>

                    <View style={styles.leaderboardStats}>
                      <View style={styles.leaderboardStat}>
                        <Text style={styles.leaderboardStatValue}>{entry.wins}</Text>
                        <Text style={styles.leaderboardStatLabel}>Wins</Text>
                      </View>
                      <View style={styles.leaderboardStat}>
                        <Text style={styles.leaderboardStatValue}>{entry.rating}</Text>
                        <Text style={styles.leaderboardStatLabel}>Rating</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              ))}
            </>
          )}

          {selectedTab === 'friends' && (
            <View style={styles.emptyState}>
              <Star size={48} color="#666" />
              <Text style={styles.emptyStateTitle}>No Friends Yet</Text>
              <Text style={styles.emptyStateDescription}>
                Add friends to see how you compare!
              </Text>
            </View>
          )}

          {selectedTab === 'weekly' && (
            <View style={styles.emptyState}>
              <Medal size={48} color="#666" />
              <Text style={styles.emptyStateTitle}>Weekly Reset</Text>
              <Text style={styles.emptyStateDescription}>
                Weekly leaderboard resets every Monday
              </Text>
            </View>
          )}
        </View>

        {/* Season Info */}
        <View style={styles.seasonContainer}>
          <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.seasonCard}>
            <View style={styles.seasonHeader}>
              <Trophy size={24} color="#ffd700" />
              <Text style={styles.seasonTitle}>Season 1: Rise of Legends</Text>
            </View>
            <Text style={styles.seasonDescription}>
              Climb the ranks and earn exclusive rewards! Season ends in 23 days.
            </Text>
            <View style={styles.seasonRewards}>
              <Text style={styles.seasonRewardsTitle}>Season Rewards:</Text>
              <Text style={styles.seasonRewardsText}>
                • Top 100: Legendary Card Pack
                • Top 1000: Epic Card Pack
                • Top 10000: Rare Card Pack
              </Text>
            </View>
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
  playerRankContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  playerRankCard: {
    borderRadius: 12,
    padding: 16,
  },
  playerRankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  playerRankInfo: {
    flex: 1,
  },
  playerRankName: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  playerRankLevel: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#fff',
  },
  playerRankPosition: {
    alignItems: 'center',
  },
  playerRankNumber: {
    fontSize: 24,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  playerRankLabel: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#fff',
  },
  playerRankStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  playerRankStat: {
    alignItems: 'center',
  },
  playerRankStatValue: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  playerRankStatLabel: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#333',
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#00ff88',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Exo2-SemiBold',
    color: '#ccc',
  },
  activeTabText: {
    color: '#fff',
  },
  leaderboardContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  leaderboardEntry: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  leaderboardEntryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  leaderboardRank: {
    alignItems: 'center',
    width: 60,
  },
  leaderboardRankText: {
    fontSize: 12,
    fontFamily: 'Orbitron-Bold',
    marginTop: 4,
  },
  leaderboardInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  leaderboardName: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  leaderboardLevel: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
  },
  leaderboardStats: {
    flexDirection: 'row',
    gap: 16,
  },
  leaderboardStat: {
    alignItems: 'center',
  },
  leaderboardStatValue: {
    fontSize: 14,
    fontFamily: 'Orbitron-Bold',
    color: '#00ff88',
  },
  leaderboardStatLabel: {
    fontSize: 10,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    textAlign: 'center',
  },
  seasonContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  seasonCard: {
    borderRadius: 12,
    padding: 16,
  },
  seasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  seasonTitle: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  seasonDescription: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    marginBottom: 16,
  },
  seasonRewards: {
    marginTop: 8,
  },
  seasonRewardsTitle: {
    fontSize: 14,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  seasonRewardsText: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    lineHeight: 18,
  },
});