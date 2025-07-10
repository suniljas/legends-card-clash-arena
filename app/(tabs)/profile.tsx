import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useGame } from '@/context/GameContext';
import { User, Settings, Volume2, VolumeX, Bell, BellOff, Music, Music as MusicOff, CreditCard as Edit3, Save, Trophy, Star, Target, Zap } from 'lucide-react-native';

export default function ProfileScreen() {
  const { player, gameState, dispatch, updatePlayer } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(player.name);

  const handleSaveName = () => {
    if (editedName.trim()) {
      updatePlayer({ name: editedName.trim() });
      setIsEditing(false);
    }
  };

  const handleSettingToggle = (setting: keyof typeof gameState.settings) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { [setting]: !gameState.settings[setting] }
    });
  };

  const getNextLevelExp = () => {
    const currentLevel = player.level;
    return currentLevel * 1000;
  };

  const getCurrentLevelExp = () => {
    const currentLevel = player.level;
    return (currentLevel - 1) * 1000;
  };

  const getExpProgress = () => {
    const currentExp = player.experience;
    const currentLevelExp = getCurrentLevelExp();
    const nextLevelExp = getNextLevelExp();
    const progress = (currentExp - currentLevelExp) / (nextLevelExp - currentLevelExp);
    return Math.max(0, Math.min(1, progress));
  };

  const achievements = [
    { id: 1, title: 'First Victory', description: 'Win your first battle', completed: player.stats.gamesWon > 0 },
    { id: 2, title: 'Card Collector', description: 'Collect 10 cards', completed: player.cards.length >= 10 },
    { id: 3, title: 'Veteran', description: 'Play 10 games', completed: player.stats.gamesPlayed >= 10 },
    { id: 4, title: 'Champion', description: 'Reach level 5', completed: player.level >= 5 },
  ];

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a1a', '#0a0a0a']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Player Card */}
        <View style={styles.playerCardContainer}>
          <LinearGradient colors={['#00ff88', '#00cc6a']} style={styles.playerCard}>
            <View style={styles.playerHeader}>
              <View style={styles.playerAvatar}>
                <User size={32} color="#fff" />
              </View>
              <View style={styles.playerInfo}>
                {isEditing ? (
                  <View style={styles.editNameContainer}>
                    <TextInput
                      style={styles.nameInput}
                      value={editedName}
                      onChangeText={setEditedName}
                      placeholder="Enter your name"
                      placeholderTextColor="#ccc"
                      maxLength={20}
                    />
                    <TouchableOpacity onPress={handleSaveName} style={styles.saveButton}>
                      <Save size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.nameContainer}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                      <Edit3 size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.playerLevel}>Level {player.level}</Text>
              </View>
            </View>

            {/* Experience Bar */}
            <View style={styles.expContainer}>
              <View style={styles.expBar}>
                <View style={[styles.expFill, { width: `${getExpProgress() * 100}%` }]} />
              </View>
              <Text style={styles.expText}>
                {player.experience - getCurrentLevelExp()} / {getNextLevelExp() - getCurrentLevelExp()} XP
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.statCard}>
              <Trophy size={24} color="#ffd700" />
              <Text style={styles.statValue}>{player.stats.gamesWon}</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </LinearGradient>
            
            <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.statCard}>
              <Target size={24} color="#ff0066" />
              <Text style={styles.statValue}>{player.stats.gamesPlayed}</Text>
              <Text style={styles.statLabel}>Games</Text>
            </LinearGradient>
            
            <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.statCard}>
              <Star size={24} color="#8b5cf6" />
              <Text style={styles.statValue}>{player.cards.length}</Text>
              <Text style={styles.statLabel}>Cards</Text>
            </LinearGradient>
            
            <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.statCard}>
              <Zap size={24} color="#00ff88" />
              <Text style={styles.statValue}>
                {player.stats.gamesPlayed > 0 
                  ? Math.round((player.stats.gamesWon / player.stats.gamesPlayed) * 100)
                  : 0}%
              </Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Currency */}
        <View style={styles.currencyContainer}>
          <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.currencyCard}>
            <View style={styles.currencyItem}>
              <Text style={styles.currencyLabel}>Coins</Text>
              <Text style={styles.currencyValue}>{player.coins}</Text>
            </View>
            <View style={styles.currencyDivider} />
            <View style={styles.currencyItem}>
              <Text style={styles.currencyLabel}>Gems</Text>
              <Text style={styles.currencyValue}>{player.gems}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <LinearGradient 
                key={achievement.id}
                colors={achievement.completed ? ['#00ff88', '#00cc6a'] : ['#2a2a2a', '#1a1a1a']}
                style={styles.achievementCard}
              >
                <View style={styles.achievementIcon}>
                  <Trophy size={20} color={achievement.completed ? '#fff' : '#666'} />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={[
                    styles.achievementTitle,
                    { color: achievement.completed ? '#fff' : '#ccc' }
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    { color: achievement.completed ? '#fff' : '#999' }
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
              </LinearGradient>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                {gameState.settings.soundEnabled ? (
                  <Volume2 size={24} color="#00ff88" />
                ) : (
                  <VolumeX size={24} color="#666" />
                )}
                <Text style={styles.settingLabel}>Sound Effects</Text>
              </View>
              <Switch
                value={gameState.settings.soundEnabled}
                onValueChange={() => handleSettingToggle('soundEnabled')}
                trackColor={{ false: '#333', true: '#00ff88' }}
                thumbColor={gameState.settings.soundEnabled ? '#fff' : '#ccc'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                {gameState.settings.musicEnabled ? (
                  <Music size={24} color="#00ff88" />
                ) : (
                  <MusicOff size={24} color="#666" />
                )}
                <Text style={styles.settingLabel}>Background Music</Text>
              </View>
              <Switch
                value={gameState.settings.musicEnabled}
                onValueChange={() => handleSettingToggle('musicEnabled')}
                trackColor={{ false: '#333', true: '#00ff88' }}
                thumbColor={gameState.settings.musicEnabled ? '#fff' : '#ccc'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                {gameState.settings.notificationsEnabled ? (
                  <Bell size={24} color="#00ff88" />
                ) : (
                  <BellOff size={24} color="#666" />
                )}
                <Text style={styles.settingLabel}>Notifications</Text>
              </View>
              <Switch
                value={gameState.settings.notificationsEnabled}
                onValueChange={() => handleSettingToggle('notificationsEnabled')}
                trackColor={{ false: '#333', true: '#00ff88' }}
                thumbColor={gameState.settings.notificationsEnabled ? '#fff' : '#ccc'}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/deck-builder')}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#8b5cf6', '#7c3aed']} style={styles.quickActionGradient}>
              <Text style={styles.quickActionText}>Manage Cards</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/tutorial')}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.quickActionGradient}>
              <Text style={styles.quickActionText}>Tutorial</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  },
  playerCardContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  playerCard: {
    borderRadius: 12,
    padding: 20,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  playerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  playerInfo: {
    flex: 1,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameInput: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  saveButton: {
    padding: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerName: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginRight: 8,
  },
  editButton: {
    padding: 4,
  },
  playerLevel: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#fff',
    opacity: 0.8,
  },
  expContainer: {
    marginTop: 8,
  },
  expBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  expFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  expText: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#fff',
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    marginTop: 4,
  },
  currencyContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  currencyCard: {
    borderRadius: 12,
    flexDirection: 'row',
    padding: 16,
  },
  currencyItem: {
    flex: 1,
    alignItems: 'center',
  },
  currencyLabel: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    marginBottom: 4,
  },
  currencyValue: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#00ff88',
  },
  currencyDivider: {
    width: 1,
    backgroundColor: '#333',
    marginHorizontal: 16,
  },
  achievementsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  achievementsList: {
    gap: 8,
  },
  achievementCard: {
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'Orbitron-Bold',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
  },
  settingsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  settingsCard: {
    borderRadius: 12,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Exo2-Regular',
    color: '#fff',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 8,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  quickActionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  quickActionGradient: {
    padding: 16,
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
});