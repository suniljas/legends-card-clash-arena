import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useGame } from '@/context/GameContext';
import { GameCard } from '@/components/GameCard';
import { Card, Deck } from '@/types/game';
import { ArrowLeft, Plus, Save, Trash2, Search, Filter, Shuffle } from 'lucide-react-native';

export default function DeckBuilderScreen() {
  const { player, updatePlayer } = useGame();
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(
    player.decks.length > 0 ? player.decks[0] : null
  );
  const [deckCards, setDeckCards] = useState<Card[]>(
    selectedDeck ? selectedDeck.cards : []
  );
  const [availableCards, setAvailableCards] = useState<Card[]>(player.cards);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [deckName, setDeckName] = useState(selectedDeck?.name || 'New Deck');
  const [isEditing, setIsEditing] = useState(false);

  const maxDeckSize = 30;
  const minDeckSize = 20;

  useEffect(() => {
    filterCards();
  }, [searchQuery, filterRarity, filterType, player.cards]);

  const filterCards = () => {
    let filtered = player.cards.filter(card => {
      // Exclude cards already in deck
      const isInDeck = deckCards.some(deckCard => deckCard.id === card.id);
      if (isInDeck) return false;

      // Search filter
      if (searchQuery && !card.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Rarity filter
      if (filterRarity !== 'all' && card.rarity !== filterRarity) {
        return false;
      }

      // Type filter
      if (filterType !== 'all' && card.type !== filterType) {
        return false;
      }

      return true;
    });

    setAvailableCards(filtered);
  };

  const addCardToDeck = (card: Card) => {
    if (deckCards.length >= maxDeckSize) {
      Alert.alert('Deck Full', `Maximum deck size is ${maxDeckSize} cards.`);
      return;
    }

    setDeckCards([...deckCards, card]);
    filterCards();
  };

  const removeCardFromDeck = (cardId: string) => {
    setDeckCards(deckCards.filter(card => card.id !== cardId));
    filterCards();
  };

  const saveDeck = () => {
    if (deckCards.length < minDeckSize) {
      Alert.alert('Deck Too Small', `Minimum deck size is ${minDeckSize} cards.`);
      return;
    }

    const newDeck: Deck = {
      id: selectedDeck?.id || `deck-${Date.now()}`,
      name: deckName,
      cards: deckCards,
      isActive: true,
    };

    let updatedDecks;
    if (selectedDeck) {
      // Update existing deck
      updatedDecks = player.decks.map(deck => 
        deck.id === selectedDeck.id ? newDeck : { ...deck, isActive: false }
      );
    } else {
      // Create new deck
      updatedDecks = [
        ...player.decks.map(deck => ({ ...deck, isActive: false })),
        newDeck
      ];
    }

    updatePlayer({ decks: updatedDecks });
    setSelectedDeck(newDeck);
    setIsEditing(false);
    Alert.alert('Success', 'Deck saved successfully!');
  };

  const deleteDeck = () => {
    if (!selectedDeck) return;

    Alert.alert(
      'Delete Deck',
      `Are you sure you want to delete "${selectedDeck.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedDecks = player.decks.filter(deck => deck.id !== selectedDeck.id);
            updatePlayer({ decks: updatedDecks });
            
            if (updatedDecks.length > 0) {
              setSelectedDeck(updatedDecks[0]);
              setDeckCards(updatedDecks[0].cards);
              setDeckName(updatedDecks[0].name);
            } else {
              setSelectedDeck(null);
              setDeckCards([]);
              setDeckName('New Deck');
            }
          }
        }
      ]
    );
  };

  const createNewDeck = () => {
    setSelectedDeck(null);
    setDeckCards([]);
    setDeckName('New Deck');
    setIsEditing(true);
  };

  const shuffleDeck = () => {
    const shuffled = [...deckCards].sort(() => Math.random() - 0.5);
    setDeckCards(shuffled);
  };

  const getCardCount = (cardId: string) => {
    return deckCards.filter(card => card.id === cardId).length;
  };

  const getDeckStats = () => {
    const totalCost = deckCards.reduce((sum, card) => sum + card.cost, 0);
    const avgCost = deckCards.length > 0 ? (totalCost / deckCards.length).toFixed(1) : '0';
    
    const typeCount = deckCards.reduce((acc, card) => {
      acc[card.type] = (acc[card.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { avgCost, typeCount };
  };

  const stats = getDeckStats();

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a1a', '#0a0a0a']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Deck Builder</Text>
        
        <TouchableOpacity onPress={createNewDeck} style={styles.newDeckButton}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Deck Selection */}
      <View style={styles.deckSelection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {player.decks.map((deck) => (
            <TouchableOpacity
              key={deck.id}
              onPress={() => {
                setSelectedDeck(deck);
                setDeckCards(deck.cards);
                setDeckName(deck.name);
                setIsEditing(false);
              }}
              style={[
                styles.deckTab,
                selectedDeck?.id === deck.id && styles.activeDeckTab
              ]}
            >
              <Text style={[
                styles.deckTabText,
                selectedDeck?.id === deck.id && styles.activeDeckTabText
              ]}>
                {deck.name}
              </Text>
              <Text style={styles.deckTabCount}>{deck.cards.length} cards</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Deck Info */}
      <View style={styles.deckInfo}>
        <LinearGradient colors={['#2a2a2a', '#1a1a1a']} style={styles.deckInfoCard}>
          <View style={styles.deckHeader}>
            {isEditing ? (
              <TextInput
                style={styles.deckNameInput}
                value={deckName}
                onChangeText={setDeckName}
                placeholder="Deck Name"
                placeholderTextColor="#666"
              />
            ) : (
              <Text style={styles.deckNameText}>{deckName}</Text>
            )}
            
            <View style={styles.deckActions}>
              <TouchableOpacity onPress={shuffleDeck} style={styles.actionButton}>
                <Shuffle size={20} color="#fff" />
              </TouchableOpacity>
              
              {selectedDeck && (
                <TouchableOpacity onPress={deleteDeck} style={styles.actionButton}>
                  <Trash2 size={20} color="#ff0066" />
                </TouchableOpacity>
              )}
              
              <TouchableOpacity onPress={saveDeck} style={[styles.actionButton, styles.saveButton]}>
                <Save size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.deckStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Cards</Text>
              <Text style={[
                styles.statValue,
                { color: deckCards.length >= minDeckSize ? '#00ff88' : '#ff0066' }
              ]}>
                {deckCards.length}/{maxDeckSize}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Avg Cost</Text>
              <Text style={styles.statValue}>{stats.avgCost}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Creatures</Text>
              <Text style={styles.statValue}>{stats.typeCount.creature || 0}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Spells</Text>
              <Text style={styles.statValue}>{stats.typeCount.spell || 0}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.content}>
        {/* Current Deck */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Deck ({deckCards.length})</Text>
          <ScrollView horizontal style={styles.cardList} showsHorizontalScrollIndicator={false}>
            {deckCards.map((card, index) => (
              <TouchableOpacity
                key={`${card.id}-${index}`}
                onPress={() => removeCardFromDeck(card.id)}
                style={styles.deckCard}
              >
                <GameCard card={card} size="small" />
                <View style={styles.removeIndicator}>
                  <Text style={styles.removeText}>-</Text>
                </View>
              </TouchableOpacity>
            ))}
            {deckCards.length === 0 && (
              <View style={styles.emptyDeck}>
                <Text style={styles.emptyText}>Add cards to your deck</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cards..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => setFilterRarity('all')}
              style={[styles.filterButton, filterRarity === 'all' && styles.activeFilter]}
            >
              <Text style={[styles.filterText, filterRarity === 'all' && styles.activeFilterText]}>
                All
              </Text>
            </TouchableOpacity>
            
            {['common', 'rare', 'epic', 'legendary'].map((rarity) => (
              <TouchableOpacity
                key={rarity}
                onPress={() => setFilterRarity(rarity)}
                style={[styles.filterButton, filterRarity === rarity && styles.activeFilter]}
              >
                <Text style={[styles.filterText, filterRarity === rarity && styles.activeFilterText]}>
                  {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Available Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Cards ({availableCards.length})</Text>
          <ScrollView style={styles.availableCards} showsVerticalScrollIndicator={false}>
            <View style={styles.cardGrid}>
              {availableCards.map((card) => (
                <TouchableOpacity
                  key={card.id}
                  onPress={() => addCardToDeck(card)}
                  style={styles.availableCard}
                >
                  <GameCard card={card} size="small" />
                  <View style={styles.addIndicator}>
                    <Text style={styles.addText}>+</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  newDeckButton: {
    padding: 8,
  },
  deckSelection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  deckTab: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    minWidth: 100,
  },
  activeDeckTab: {
    backgroundColor: '#00ff88',
  },
  deckTabText: {
    fontSize: 14,
    fontFamily: 'Orbitron-Bold',
    color: '#ccc',
    textAlign: 'center',
  },
  activeDeckTabText: {
    color: '#fff',
  },
  deckTabCount: {
    fontSize: 10,
    fontFamily: 'Exo2-Regular',
    color: '#999',
    textAlign: 'center',
    marginTop: 2,
  },
  deckInfo: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  deckInfoCard: {
    borderRadius: 12,
    padding: 16,
  },
  deckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deckNameInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  deckNameText: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  deckActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#00ff88',
  },
  deckStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 12,
  },
  cardList: {
    maxHeight: 180,
  },
  deckCard: {
    marginRight: 8,
    position: 'relative',
  },
  removeIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff0066',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  emptyDeck: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 160,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#666',
  },
  filters: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#fff',
    paddingVertical: 12,
    paddingLeft: 8,
  },
  filterButton: {
    backgroundColor: '#333',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#00ff88',
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Exo2-SemiBold',
    color: '#ccc',
  },
  activeFilterText: {
    color: '#fff',
  },
  availableCards: {
    flex: 1,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  availableCard: {
    width: '48%',
    marginBottom: 12,
    position: 'relative',
  },
  addIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#00ff88',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
});