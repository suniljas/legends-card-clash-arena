import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useGame } from '@/context/GameContext';
import { TutorialSystem } from '@/components/TutorialSystem';
import { RevenueSystem } from '@/components/RevenueSystem';
import { Play, BookOpen, Trophy, Settings, Star, Gift, Gem } from 'lucide-react-native';

export default function HomeScreen() {
  const { player, gameState, dispatch } = useGame();
  const [greeting, setGreeting] = useState(getGreeting());
  const [showRevenue, setShowRevenue] = useState<'shop' | 'premium' | 'rewards' | 'battlepass' | null>(null);
  const [showTutorial, setShowTutorial] = useState(!gameState.tutorial.completed);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  const quickActions = [
    {
      title: 'Quick Battle',
      description: 'Jump into battle against AI',
      icon: <Play size={32} color="#00ff88" />,
      action: () => router.push('/battle'),
      gradient: ['#00ff88', '#00cc6a'],
    },
    {
      title: 'Tutorial',
      description: 'Learn the basics',
      icon: <BookOpen size={32} color="#3b82f6" />,
      action: () => setShowTutorial(true),
      gradient: ['#3b82f6', '#2563eb'],
    },
    {
      title: 'Leaderboards',
      description: 'See top players',
      icon: <Trophy size={32} color="#ffd700" />,
      action: () => router.push('/(tabs)/leaderboard'),
      gradient: ['#ffd700', '#f59e0b'],
    },
    {
      title: 'Collection',
      description: 'Manage your cards',
      icon: <Star size={32} color="#8b5cf6" />,
      action: () => router.push('/deck-builder'),
      gradient: ['#8b5cf6', '#7c3aed'],
    },
    {
      title: 'Shop',
      description: 'Buy coins and gems',
      icon: <Gem size={32} color="#ffd700" />,
      action: () => setShowRevenue('shop'),
      gradient: ['#ffd700', '#f59e0b'],
    },
    {
      title: 'Daily Rewards',
      description: 'Claim free rewards',
      icon: <Gift size={32} color="#ff0066" />,
      action: () => setShowRevenue('rewards'),
      gradient: ['#ff0066', '#cc0050'],
    },
    {
      title: 'Battle Pass',
      description: 'Season rewards',
      icon: <Star size={32} color="#8b5cf6" />,
      action: () => setShowRevenue('battlepass'),
      gradient: ['#8b5cf6', '#7c3aed'],
    },
  ];

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a1a', '#0a0a0a']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.playerInfo}>
            <Text style={styles.greeting}>{greeting}, {player.name}!</Text>
            <Text style={styles.subtitle}>Ready for battle?</Text>
          </View>
          
          <View style={styles.currencyContainer}>
            <View style={styles.currencyItem}>
              <Text style={styles.currencyAmount}>{player.coins}</Text>
              <Text style={styles.currencyLabel}>Coins</Text>
            </View>
            <View style={styles.currencyItem}>
              <Text style={styles.currencyAmount}>{player.gems}</Text>
              <Text style={styles.currencyLabel}>Gems</Text>
            </View>
          </View>
        </View>

        {/* Player Stats */}
        <View style={styles.statsContainer}>
          <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{player.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{player.stats.gamesWon}</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{player.stats.gamesPlayed}</Text>
              <Text style={styles.statLabel}>Games</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {player.stats.gamesPlayed > 0 
                  ? Math.round((player.stats.gamesWon / player.stats.gamesPlayed) * 100)
                  : 0}%
              </Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={action.action}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={action.gradient}
                  style={styles.actionGradient}
                >
                  <View style={styles.actionIcon}>
                    {action.icon}
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Challenges */}
        <View style={styles.challengesContainer}>
          <Text style={styles.sectionTitle}>Daily Challenges</Text>
          <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <Text style={styles.challengeTitle}>Win 3 Battles</Text>
              <Text style={styles.challengeReward}>+100 Coins</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(player.stats.gamesWon % 3) * 33.33}%` }]} />
            </View>
            <Text style={styles.challengeProgress}>
              {player.stats.gamesWon % 3}/3 battles won
            </Text>
          </LinearGradient>
        </View>

        {/* News/Updates */}
        <View style={styles.newsContainer}>
          <Text style={styles.sectionTitle}>Latest News</Text>
          <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.newsCard}>
            <Text style={styles.newsTitle}>🎉 Welcome to Card Clash Legends!</Text>
            <Text style={styles.newsContent}>
              Battle with legendary cards, build powerful decks, and climb the leaderboards. 
              New updates and cards coming soon!
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>
      
      {/* Tutorial System */}
      <TutorialSystem
        visible={showTutorial}
        onComplete={() => {
          dispatch({ type: 'COMPLETE_TUTORIAL' });
          setShowTutorial(false);
        }}
        onSkip={() => {
          dispatch({ type: 'COMPLETE_TUTORIAL' });
          setShowTutorial(false);
        }}
      />
      
      {/* Revenue System */}
      {showRevenue && (
        <RevenueSystem
          visible={!!showRevenue}
          type={showRevenue}
          onClose={() => setShowRevenue(null)}
        />
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  playerInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
  },
  currencyContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  currencyItem: {
    alignItems: 'center',
  },
  currencyAmount: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#00ff88',
  },
  currencyLabel: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#00ff88',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    marginTop: 4,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 8,
  },
  actionButton: {
    width: '48%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 10,
    fontFamily: 'Exo2-Regular',
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
  },
  challengesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  challengeCard: {
    borderRadius: 12,
    padding: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  challengeReward: {
    fontSize: 14,
    fontFamily: 'Exo2-Bold',
    color: '#ffd700',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 4,
  },
  challengeProgress: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
  },
  newsContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  newsCard: {
    borderRadius: 12,
    padding: 16,
  },
  newsTitle: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  newsContent: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    lineHeight: 20,
  },
});