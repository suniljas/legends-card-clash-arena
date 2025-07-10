import { Card, Deck, Player } from '@/types/game';

export const CARD_RARITIES = {
  common: { color: '#9CA3AF', probability: 0.6 },
  rare: { color: '#3B82F6', probability: 0.25 },
  epic: { color: '#8B5CF6', probability: 0.12 },
  legendary: { color: '#F59E0B', probability: 0.03 },
};

export function generateInitialCards(): Card[] {
  const starterCards: Card[] = [
    {
      id: 'warrior-1',
      name: 'Brave Warrior',
      description: 'A stalwart defender with balanced stats',
      cost: 2,
      attack: 3,
      health: 4,
      rarity: 'common',
      type: 'creature',
      abilities: ['Taunt'],
    },
    {
      id: 'mage-1',
      name: 'Frost Mage',
      description: 'Deals magical damage and freezes enemies',
      cost: 3,
      attack: 4,
      health: 2,
      rarity: 'common',
      type: 'creature',
      abilities: ['Freeze'],
    },
    {
      id: 'archer-1',
      name: 'Swift Archer',
      description: 'Quick attacks with ranged damage',
      cost: 1,
      attack: 2,
      health: 1,
      rarity: 'common',
      type: 'creature',
      abilities: ['Quick'],
    },
    {
      id: 'heal-1',
      name: 'Healing Potion',
      description: 'Restore health to yourself',
      cost: 1,
      attack: 0,
      health: 0,
      rarity: 'common',
      type: 'spell',
      abilities: ['Heal: 5'],
    },
    {
      id: 'dragon-1',
      name: 'Fire Dragon',
      description: 'Mighty dragon with devastating attacks',
      cost: 6,
      attack: 8,
      health: 8,
      rarity: 'legendary',
      type: 'creature',
      abilities: ['Flying', 'Burn'],
    },
  ];

  // Generate more cards for variety
  const additionalCards = generateRandomCards(15);
  return [...starterCards, ...additionalCards];
}

export function generateRandomCards(count: number): Card[] {
  const cards: Card[] = [];
  const cardTypes = ['creature', 'spell', 'artifact'] as const;
  const abilities = ['Taunt', 'Quick', 'Flying', 'Burn', 'Heal', 'Shield', 'Poison'];

  for (let i = 0; i < count; i++) {
    const rarity = getRandomRarity();
    const type = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    const cost = Math.floor(Math.random() * 8) + 1;
    
    cards.push({
      id: `random-${i}`,
      name: generateCardName(type),
      description: generateCardDescription(type),
      cost,
      attack: type === 'spell' ? 0 : Math.floor(Math.random() * cost) + 1,
      health: type === 'spell' ? 0 : Math.floor(Math.random() * cost) + 1,
      rarity,
      type,
      abilities: [abilities[Math.floor(Math.random() * abilities.length)]],
    });
  }

  return cards;
}

function getRandomRarity(): 'common' | 'rare' | 'epic' | 'legendary' {
  const random = Math.random();
  if (random < 0.6) return 'common';
  if (random < 0.85) return 'rare';
  if (random < 0.97) return 'epic';
  return 'legendary';
}

function generateCardName(type: string): string {
  const prefixes = ['Ancient', 'Mystic', 'Dark', 'Golden', 'Shadow', 'Crystal', 'Storm'];
  const creatures = ['Warrior', 'Mage', 'Dragon', 'Knight', 'Archer', 'Beast', 'Spirit'];
  const spells = ['Bolt', 'Shield', 'Heal', 'Curse', 'Blast', 'Ward', 'Strike'];
  const artifacts = ['Sword', 'Shield', 'Orb', 'Ring', 'Amulet', 'Crown', 'Staff'];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  
  let suffix: string;
  switch (type) {
    case 'creature':
      suffix = creatures[Math.floor(Math.random() * creatures.length)];
      break;
    case 'spell':
      suffix = spells[Math.floor(Math.random() * spells.length)];
      break;
    default:
      suffix = artifacts[Math.floor(Math.random() * artifacts.length)];
  }

  return `${prefix} ${suffix}`;
}

function generateCardDescription(type: string): string {
  const descriptions = {
    creature: [
      'A mighty warrior ready for battle',
      'Swift and deadly in combat',
      'Protects allies with unwavering loyalty',
      'Strikes fear into enemies',
    ],
    spell: [
      'Unleash magical energy',
      'Bend reality to your will',
      'Channel ancient powers',
      'Cast devastating magic',
    ],
    artifact: [
      'A legendary item of power',
      'Enchanted with mystical properties',
      'Forged by ancient masters',
      'Holds incredible magical energy',
    ],
  };

  const typeDescriptions = descriptions[type as keyof typeof descriptions] || descriptions.creature;
  return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
}

export function generateRandomDeck(availableCards: Card[]): Deck {
  const deckSize = 20;
  const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
  
  return {
    id: `deck-${Date.now()}`,
    name: 'Main Deck',
    cards: shuffled.slice(0, deckSize),
    isActive: true,
  };
}

export function calculatePlayerLevel(experience: number): number {
  return Math.floor(experience / 1000) + 1;
}

export function getExperienceForNextLevel(currentLevel: number): number {
  return currentLevel * 1000;
}

export function generateOpponents(): Player[] {
  const opponents: Player[] = [];
  const names = ['AI Warrior', 'Shadow Master', 'Crystal Mage', 'Fire Knight', 'Ice Queen'];
  
  for (let i = 0; i < names.length; i++) {
    const cards = generateRandomCards(20);
    const deck = generateRandomDeck(cards);
    
    opponents.push({
      id: `opponent-${i}`,
      name: names[i],
      level: Math.floor(Math.random() * 10) + 1,
      experience: 0,
      coins: 0,
      gems: 0,
      cards,
      decks: [deck],
      stats: {
        gamesPlayed: Math.floor(Math.random() * 100),
        gamesWon: Math.floor(Math.random() * 50),
        totalDamageDealt: Math.floor(Math.random() * 10000),
        favoriteCard: null,
      },
    });
  }
  
  return opponents;
}