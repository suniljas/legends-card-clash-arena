import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { X, Gem, Coins, Star, Crown, Gift, Zap, Shield, Trophy } from 'lucide-react-native';

interface RevenueSystemProps {
  visible: boolean;
  onClose: () => void;
  type: 'shop' | 'premium' | 'rewards' | 'battlepass';
}

interface PurchaseItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'gems' | 'real';
  value: number;
  type: 'coins' | 'gems' | 'cards' | 'premium' | 'battlepass';
  icon: React.ReactNode;
  popular?: boolean;
  discount?: number;
  tier?: 'basic' | 'premium' | 'legendary';
}

const shopItems: PurchaseItem[] = [
  {
    id: 'coins-starter',
    name: 'Starter Coins',
    description: 'Perfect for new players',
    price: 99,
    currency: 'real',
    value: 1000,
    type: 'coins',
    icon: <Coins size={32} color="#ffd700" />,
    tier: 'basic',
  },
  {
    id: 'coins-value',
    name: 'Coin Bundle',
    description: 'Great value for active players',
    price: 499,
    currency: 'real',
    value: 6000,
    type: 'coins',
    icon: <Coins size={32} color="#ffd700" />,
    popular: true,
    discount: 20,
    tier: 'premium',
  },
  {
    id: 'gems-starter',
    name: 'Gem Pouch',
    description: 'Premium currency for exclusive items',
    price: 199,
    currency: 'real',
    value: 100,
    type: 'gems',
    icon: <Gem size={32} color="#8b5cf6" />,
    tier: 'basic',
  },
  {
    id: 'gems-mega',
    name: 'Gem Vault',
    description: 'Maximum value for serious players',
    price: 2999,
    currency: 'real',
    value: 2000,
    type: 'gems',
    icon: <Gem size={32} color="#8b5cf6" />,
    discount: 35,
    tier: 'legendary',
  },
  {
    id: 'card-pack-basic',
    name: 'Basic Card Pack',
    description: '5 random cards',
    price: 100,
    currency: 'coins',
    value: 5,
    type: 'cards',
    icon: <Star size={32} color="#3b82f6" />,
    tier: 'basic',
  },
  {
    id: 'card-pack-premium',
    name: 'Premium Card Pack',
    description: '5 cards with guaranteed rare+',
    price: 50,
    currency: 'gems',
    value: 5,
    type: 'cards',
    icon: <Crown size={32} color="#f59e0b" />,
    tier: 'premium',
  },
  {
    id: 'card-pack-legendary',
    name: 'Legendary Card Pack',
    description: '3 cards with guaranteed legendary',
    price: 150,
    currency: 'gems',
    value: 3,
    type: 'cards',
    icon: <Trophy size={32} color="#f59e0b" />,
    tier: 'legendary',
  },
];

const battlePassTiers = [
  {
    level: 1,
    freeReward: { type: 'coins', amount: 50 },
    premiumReward: { type: 'gems', amount: 10 },
    xpRequired: 100,
  },
  {
    level: 5,
    freeReward: { type: 'cards', amount: 1, rarity: 'rare' },
    premiumReward: { type: 'cards', amount: 2, rarity: 'rare' },
    xpRequired: 500,
  },
  {
    level: 10,
    freeReward: { type: 'coins', amount: 200 },
    premiumReward: { type: 'cards', amount: 1, rarity: 'epic' },
    xpRequired: 1000,
  },
  {
    level: 20,
    freeReward: { type: 'gems', amount: 25 },
    premiumReward: { type: 'cards', amount: 1, rarity: 'legendary' },
    xpRequired: 2000,
  },
];

export function RevenueSystem({ visible, onClose, type }: RevenueSystemProps) {
  const { player, updatePlayer } = useGame();
  const [selectedItem, setSelectedItem] = useState<PurchaseItem | null>(null);
  const [hasBattlePass, setHasBattlePass] = useState(false);

  const handlePurchase = (item: PurchaseItem) => {
    if (item.currency === 'real') {
      // In production, this would integrate with RevenueCat
      Alert.alert(
        'Purchase Confirmation',
        `This would initiate a purchase for ${item.name} at $${(item.price / 100).toFixed(2)}.\n\nNote: This app requires RevenueCat integration for real purchases. For demo purposes, you'll receive the items for free!`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Get Demo Items',
            onPress: () => {
              processPurchase(item);
            }
          }
        ]
      );
    } else {
      // Handle in-game currency purchases
      const canAfford = item.currency === 'coins' 
        ? player.coins >= item.price 
        : player.gems >= item.price;

      if (!canAfford) {
        Alert.alert(
          'Insufficient Funds', 
          `You need ${item.price} ${item.currency} to purchase this item.`
        );
        return;
      }

      Alert.alert(
        'Confirm Purchase',
        `Purchase ${item.name} for ${item.price} ${item.currency}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Purchase',
            onPress: () => processPurchase(item)
          }
        ]
      );
    }
  };

  const processPurchase = (item: PurchaseItem) => {
    // Deduct currency for in-game purchases
    if (item.currency !== 'real') {
      if (item.currency === 'coins') {
        updatePlayer({ coins: player.coins - item.price });
      } else {
        updatePlayer({ gems: player.gems - item.price });
      }
    }

    // Add purchased items
    if (item.type === 'coins') {
      updatePlayer({ coins: player.coins + item.value });
    } else if (item.type === 'gems') {
      updatePlayer({ gems: player.gems + item.value });
    } else if (item.type === 'battlepass') {
      setHasBattlePass(true);
    }

    Alert.alert('Success!', `You received ${item.name}!`);
    onClose();
  };

  const handleBattlePassPurchase = () => {
    Alert.alert(
      'Battle Pass',
      'Purchase the Premium Battle Pass for $9.99?\n\nUnlocks premium rewards for all tiers and 2x XP boost!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase',
          onPress: () => {
            setHasBattlePass(true);
            Alert.alert('Success!', 'Premium Battle Pass activated!');
          }
        }
      ]
    );
  };

  const renderShop = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.currencyDisplay}>
        <View style={styles.currencyItem}>
          <Coins size={20} color="#ffd700" />
          <Text style={styles.currencyText}>{player.coins.toLocaleString()}</Text>
        </View>
        <View style={styles.currencyItem}>
          <Gem size={20} color="#8b5cf6" />
          <Text style={styles.currencyText}>{player.gems.toLocaleString()}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Featured Items</Text>
      
      {shopItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.shopItem, 
            item.popular && styles.popularItem,
            item.tier === 'legendary' && styles.legendaryItem
          ]}
          onPress={() => handlePurchase(item)}
        >
          <LinearGradient
            colors={
              item.tier === 'legendary' 
                ? ['#f59e0b', '#d97706'] 
                : item.popular 
                  ? ['#00ff88', '#00cc6a'] 
                  : ['#2a2a2a', '#1a1a1a']
            }
            style={styles.shopItemGradient}
          >
            {item.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>POPULAR</Text>
              </View>
            )}
            
            {item.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{item.discount}%</Text>
              </View>
            )}

            {item.tier === 'legendary' && (
              <View style={styles.legendaryBadge}>
                <Trophy size={16} color="#fff" />
                <Text style={styles.legendaryText}>LEGENDARY</Text>
              </View>
            )}

            <View style={styles.shopItemContent}>
              <View style={styles.shopItemIcon}>
                {item.icon}
              </View>
              
              <View style={styles.shopItemInfo}>
                <Text style={[
                  styles.shopItemName, 
                  (item.popular || item.tier === 'legendary') && styles.specialItemText
                ]}>
                  {item.name}
                </Text>
                <Text style={[
                  styles.shopItemDescription, 
                  (item.popular || item.tier === 'legendary') && styles.specialItemText
                ]}>
                  {item.description}
                </Text>
              </View>
              
              <View style={styles.shopItemPrice}>
                {item.currency === 'real' ? (
                  <Text style={[
                    styles.priceText, 
                    (item.popular || item.tier === 'legendary') && styles.specialItemText
                  ]}>
                    ${(item.price / 100).toFixed(2)}
                  </Text>
                ) : (
                  <View style={styles.currencyPrice}>
                    {item.currency === 'coins' ? (
                      <Coins size={16} color={(item.popular || item.tier === 'legendary') ? "#fff" : "#ffd700"} />
                    ) : (
                      <Gem size={16} color={(item.popular || item.tier === 'legendary') ? "#fff" : "#8b5cf6"} />
                    )}
                    <Text style={[
                      styles.priceText, 
                      (item.popular || item.tier === 'legendary') && styles.specialItemText
                    ]}>
                      {item.price.toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}

      <View style={styles.revenueCatNotice}>
        <Text style={styles.revenueCatTitle}>💡 Developer Note</Text>
        <Text style={styles.revenueCatText}>
          For production deployment, integrate RevenueCat for secure in-app purchases and subscription management. 
          This handles App Store/Play Store billing, receipt validation, and cross-platform user management.
        </Text>
      </View>
    </ScrollView>
  );

  const renderBattlePass = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.battlePassHeader}>
        <LinearGradient colors={['#8b5cf6', '#7c3aed']} style={styles.battlePassBanner}>
          <Shield size={32} color="#fff" />
          <Text style={styles.battlePassTitle}>Season 1 Battle Pass</Text>
          <Text style={styles.battlePassSubtitle}>23 days remaining</Text>
        </LinearGradient>
      </View>

      {!hasBattlePass && (
        <TouchableOpacity style={styles.purchaseBattlePass} onPress={handleBattlePassPurchase}>
          <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.purchaseBattlePassGradient}>
            <Crown size={24} color="#fff" />
            <Text style={styles.purchaseBattlePassText}>Upgrade to Premium - $9.99</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Battle Pass Tiers</Text>
      
      {battlePassTiers.map((tier, index) => (
        <View key={index} style={styles.battlePassTier}>
          <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.battlePassTierGradient}>
            <View style={styles.tierHeader}>
              <Text style={styles.tierLevel}>Level {tier.level}</Text>
              <Text style={styles.tierXP}>{tier.xpRequired} XP</Text>
            </View>
            
            <View style={styles.tierRewards}>
              <View style={styles.rewardColumn}>
                <Text style={styles.rewardLabel}>Free</Text>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardText}>
                    {tier.freeReward.amount} {tier.freeReward.type}
                  </Text>
                </View>
              </View>
              
              <View style={styles.rewardColumn}>
                <Text style={styles.rewardLabel}>Premium</Text>
                <View style={[styles.rewardItem, styles.premiumReward]}>
                  <Text style={styles.rewardText}>
                    {tier.premiumReward.amount} {tier.premiumReward.type}
                    {tier.premiumReward.rarity && ` (${tier.premiumReward.rarity})`}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      ))}
    </ScrollView>
  );

  const renderRewards = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Daily Rewards</Text>
      
      <View style={styles.rewardCard}>
        <LinearGradient colors={['#ffd700', '#f59e0b']} style={styles.rewardGradient}>
          <Gift size={48} color="#fff" />
          <Text style={styles.rewardTitle}>Daily Login Bonus</Text>
          <Text style={styles.rewardDescription}>
            Come back every day to claim increasing rewards!
          </Text>
          
          <TouchableOpacity
            style={styles.claimButton}
            onPress={() => {
              const dailyCoins = 50 + (new Date().getDay() * 10);
              updatePlayer({ coins: player.coins + dailyCoins });
              Alert.alert('Reward Claimed!', `You received ${dailyCoins} coins!`);
              onClose();
            }}
          >
            <Text style={styles.claimButtonText}>Claim Today's Reward</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <Text style={styles.sectionTitle}>Achievement Rewards</Text>
      
      <View style={styles.achievementsList}>
        {[
          { 
            title: 'First Victory', 
            reward: '100 Coins', 
            completed: player.stats.gamesWon > 0,
            description: 'Win your first battle'
          },
          { 
            title: 'Card Collector', 
            reward: '5 Gems', 
            completed: player.cards.length >= 10,
            description: 'Collect 10 different cards'
          },
          { 
            title: 'Battle Veteran', 
            reward: '200 Coins', 
            completed: player.stats.gamesPlayed >= 10,
            description: 'Play 10 battles'
          },
          { 
            title: 'Deck Master', 
            reward: '1 Epic Card', 
            completed: player.decks.length >= 3,
            description: 'Create 3 different decks'
          },
        ].map((achievement, index) => (
          <View key={index} style={[
            styles.achievementItem, 
            achievement.completed && styles.completedAchievement
          ]}>
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
            <View style={styles.achievementReward}>
              <Text style={[
                styles.achievementRewardText,
                { color: achievement.completed ? '#ffd700' : '#666' }
              ]}>
                {achievement.reward}
              </Text>
              {achievement.completed && (
                <Text style={styles.completedText}>✓</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient colors={['#0a0a0a', '#1a1a1a']} style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {type === 'shop' && 'Shop'}
                {type === 'premium' && 'Premium'}
                {type === 'rewards' && 'Rewards'}
                {type === 'battlepass' && 'Battle Pass'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            {type === 'shop' && renderShop()}
            {type === 'battlepass' && renderBattlePass()}
            {type === 'rewards' && renderRewards()}
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    maxHeight: '90%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modal: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  currencyDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyText: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  shopItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  popularItem: {
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  legendaryItem: {
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  shopItemGradient: {
    padding: 16,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff0066',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  popularText: {
    fontSize: 10,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    fontSize: 10,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  legendaryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendaryText: {
    fontSize: 10,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  shopItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopItemIcon: {
    marginRight: 16,
  },
  shopItemInfo: {
    flex: 1,
  },
  shopItemName: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  shopItemDescription: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
  },
  specialItemText: {
    color: '#fff',
  },
  shopItemPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#00ff88',
  },
  currencyPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  revenueCatNotice: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff88',
  },
  revenueCatTitle: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#00ff88',
    marginBottom: 8,
  },
  revenueCatText: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    lineHeight: 20,
  },
  battlePassHeader: {
    marginBottom: 24,
  },
  battlePassBanner: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  battlePassTitle: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginTop: 8,
  },
  battlePassSubtitle: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#fff',
    marginTop: 4,
  },
  purchaseBattlePass: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  purchaseBattlePassGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  purchaseBattlePassText: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  battlePassTier: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  battlePassTierGradient: {
    padding: 16,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tierLevel: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  tierXP: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
  },
  tierRewards: {
    flexDirection: 'row',
    gap: 16,
  },
  rewardColumn: {
    flex: 1,
  },
  rewardLabel: {
    fontSize: 12,
    fontFamily: 'Exo2-SemiBold',
    color: '#ccc',
    marginBottom: 8,
  },
  rewardItem: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  premiumReward: {
    backgroundColor: '#8b5cf6',
  },
  rewardText: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#fff',
    textAlign: 'center',
  },
  rewardCard: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  rewardGradient: {
    padding: 24,
    alignItems: 'center',
  },
  rewardTitle: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
  },
  rewardDescription: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  claimButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  claimButtonText: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#ffd700',
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedAchievement: {
    backgroundColor: '#00ff88',
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
  achievementReward: {
    alignItems: 'flex-end',
  },
  achievementRewardText: {
    fontSize: 12,
    fontFamily: 'Exo2-Bold',
  },
  completedText: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginTop: 4,
  },
});