import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/types/game';
import { CARD_RARITIES } from '@/utils/gameUtils';

interface GameCardProps {
  card: Card;
  onPress?: () => void;
  disabled?: boolean;
  showCost?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function GameCard({ card, onPress, disabled = false, showCost = true, size = 'medium' }: GameCardProps) {
  const rarityColor = CARD_RARITIES[card.rarity].color;
  const isCreature = card.type === 'creature';
  
  const cardStyles = {
    small: { width: 120, height: 160 },
    medium: { width: 140, height: 200 },
    large: { width: 180, height: 240 },
  };

  const textStyles = {
    small: { name: 12, description: 8, stats: 14 },
    medium: { name: 14, description: 10, stats: 16 },
    large: { name: 16, description: 12, stats: 18 },
  };

  return (
    <TouchableOpacity
      style={[styles.container, cardStyles[size], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a', '#1a1a1a']}
        style={[styles.card, { borderColor: rarityColor }]}
      >
        {/* Cost Badge */}
        {showCost && (
          <View style={[styles.costBadge, { backgroundColor: rarityColor }]}>
            <Text style={[styles.costText, { fontSize: textStyles[size].stats }]}>
              {card.cost}
            </Text>
          </View>
        )}

        {/* Card Image */}
        <View style={styles.imageContainer}>
          <LinearGradient
            colors={[rarityColor + '20', rarityColor + '10']}
            style={styles.imagePlaceholder}
          >
            <Text style={[styles.cardType, { color: rarityColor, fontSize: textStyles[size].name }]}>
              {card.type.toUpperCase()}
            </Text>
          </LinearGradient>
        </View>

        {/* Card Info */}
        <View style={styles.cardInfo}>
          <Text style={[styles.cardName, { fontSize: textStyles[size].name }]} numberOfLines={2}>
            {card.name}
          </Text>
          
          <Text style={[styles.cardDescription, { fontSize: textStyles[size].description }]} numberOfLines={3}>
            {card.description}
          </Text>

          {/* Abilities */}
          {card.abilities && card.abilities.length > 0 && (
            <View style={styles.abilities}>
              {card.abilities.map((ability, index) => (
                <View key={index} style={[styles.abilityTag, { backgroundColor: rarityColor + '30' }]}>
                  <Text style={[styles.abilityText, { color: rarityColor, fontSize: textStyles[size].description }]}>
                    {ability}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Stats */}
        {isCreature && (
          <View style={styles.stats}>
            <View style={[styles.statBox, { backgroundColor: '#ff4444' }]}>
              <Text style={[styles.statText, { fontSize: textStyles[size].stats }]}>
                {card.attack}
              </Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: '#44ff44' }]}>
              <Text style={[styles.statText, { fontSize: textStyles[size].stats }]}>
                {card.health}
              </Text>
            </View>
          </View>
        )}

        {/* Rarity Indicator */}
        <View style={[styles.rarityIndicator, { backgroundColor: rarityColor }]} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    padding: 8,
    position: 'relative',
  },
  disabled: {
    opacity: 0.5,
  },
  costBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  costText: {
    color: '#fff',
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    marginBottom: 8,
  },
  imagePlaceholder: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardType: {
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardInfo: {
    marginBottom: 8,
  },
  cardName: {
    color: '#fff',
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDescription: {
    color: '#ccc',
    fontFamily: 'Exo2-Regular',
    textAlign: 'center',
    marginBottom: 4,
  },
  abilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2,
  },
  abilityTag: {
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  abilityText: {
    fontFamily: 'Exo2-SemiBold',
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statText: {
    color: '#fff',
    fontFamily: 'Orbitron-Bold',
    fontWeight: 'bold',
  },
  rarityIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});