import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Player, GameState, BattleState } from '@/types/game';
import { generateInitialCards, generateRandomDeck } from '@/utils/gameUtils';
import { Platform } from 'react-native';

interface GameContextType {
  gameState: GameState;
  dispatch: React.Dispatch<any>;
  player: Player;
  updatePlayer: (updates: Partial<Player>) => void;
  battle: BattleState | null;
  startBattle: (opponent: Player) => void;
  endBattle: (winner: 'player' | 'opponent') => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialPlayer: Player = {
  id: 'player-1',
  name: 'Player',
  level: 1,
  experience: 0,
  coins: 500,
  gems: 50,
  cards: [],
  decks: [],
  stats: {
    gamesPlayed: 0,
    gamesWon: 0,
    totalDamageDealt: 0,
    favoriteCard: null,
  },
};

const initialGameState: GameState = {
  player: initialPlayer,
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    notificationsEnabled: true,
  },
  tutorial: {
    completed: false,
    currentStep: 0,
  },
};

function gameReducer(state: GameState, action: any): GameState {
  switch (action.type) {
    case 'LOAD_GAME':
      return { ...state, ...action.payload };
    case 'UPDATE_PLAYER':
      return {
        ...state,
        player: { ...state.player, ...action.payload },
      };
    case 'ADD_CARD':
      return {
        ...state,
        player: {
          ...state.player,
          cards: [...state.player.cards, action.payload],
        },
      };
    case 'COMPLETE_TUTORIAL':
      return {
        ...state,
        tutorial: { ...state.tutorial, completed: true },
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [battle, setBattle] = React.useState<BattleState | null>(null);

  useEffect(() => {
    loadGameData();
  }, []);

  useEffect(() => {
    saveGameData();
  }, [gameState]);

  const loadGameData = async () => {
    try {
      let savedData: string | null = null;
      
      if (Platform.OS !== 'web') {
        savedData = await AsyncStorage.getItem('gameData');
      } else {
        // Use localStorage for web
        savedData = localStorage.getItem('gameData');
      }
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_GAME', payload: parsedData });
      } else {
        // First time player - give them starter cards
        const starterCards = generateInitialCards();
        const starterDeck = generateRandomDeck(starterCards);
        dispatch({
          type: 'UPDATE_PLAYER',
          payload: {
            cards: starterCards,
            decks: [starterDeck],
          },
        });
      }
    } catch (error) {
      console.error('Failed to load game data:', error);
    }
  };

  const saveGameData = async () => {
    try {
      if (Platform.OS !== 'web') {
        await AsyncStorage.setItem('gameData', JSON.stringify(gameState));
      } else {
        // Use localStorage for web
        localStorage.setItem('gameData', JSON.stringify(gameState));
      }
    } catch (error) {
      console.error('Failed to save game data:', error);
    }
  };

  const updatePlayer = (updates: Partial<Player>) => {
    dispatch({ type: 'UPDATE_PLAYER', payload: updates });
  };

  const startBattle = (opponent: Player) => {
    const playerDeck = gameState.player.decks[0] || generateRandomDeck(gameState.player.cards);
    const opponentDeck = opponent.decks[0] || generateRandomDeck(opponent.cards);
    
    setBattle({
      player: {
        ...gameState.player,
        currentDeck: playerDeck,
        health: 100,
        energy: 3,
        hand: playerDeck.cards.slice(0, 5),
      },
      opponent: {
        ...opponent,
        currentDeck: opponentDeck,
        health: 100,
        energy: 3,
        hand: opponentDeck.cards.slice(0, 5),
      },
      turn: 'player',
      turnCount: 1,
      battleLog: [],
      gameOver: false,
    });
  };

  const endBattle = (winner: 'player' | 'opponent') => {
    if (battle) {
      const expGained = winner === 'player' ? 100 : 50;
      const coinsGained = winner === 'player' ? 50 : 10;
      
      updatePlayer({
        experience: gameState.player.experience + expGained,
        coins: gameState.player.coins + coinsGained,
        stats: {
          ...gameState.player.stats,
          gamesPlayed: gameState.player.stats.gamesPlayed + 1,
          gamesWon: gameState.player.stats.gamesWon + (winner === 'player' ? 1 : 0),
        },
      });
      
      setBattle(null);
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        dispatch,
        player: gameState.player,
        updatePlayer,
        battle,
        startBattle,
        endBattle,
      }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}