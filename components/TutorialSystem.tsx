import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameCard } from './GameCard';
import { ArrowRight, ArrowLeft, Play, Target, Zap, Heart, Star, Trophy } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  highlight?: 'card' | 'energy' | 'health' | 'battle' | 'rarity';
  action?: 'next' | 'complete';
  component?: React.ReactNode;
}

interface TutorialSystemProps {
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Welcome to Card Clash Legends!',
    description: 'Master the art of strategic card battles. Build powerful decks, summon legendary creatures, and defeat your opponents!',
    action: 'next',
  },
  {
    id: 2,
    title: 'Understanding Cards',
    description: 'Each card has three key stats:\n• Cost (top-left): Energy needed to play\n• Attack (bottom-left): Damage dealt\n• Health (bottom-right): Durability',
    highlight: 'card',
  },
  {
    id: 3,
    title: 'Energy System',
    description: 'You start each turn with energy that increases over time. Spend energy wisely to play your most powerful cards at the right moment.',
    highlight: 'energy',
  },
  {
    id: 4,
    title: 'Battle Mechanics',
    description: 'Take turns playing cards to reduce your opponent\'s health to zero. Use creatures to attack and spells for special effects.',
    highlight: 'battle',
  },
  {
    id: 5,
    title: 'Card Rarities',
    description: 'Cards come in four rarities:\n• Common (Gray) - Basic cards\n• Rare (Blue) - Enhanced abilities\n• Epic (Purple) - Powerful effects\n• Legendary (Gold) - Game-changing cards',
    highlight: 'rarity',
  },
  {
    id: 6,
    title: 'Ready to Battle!',
    description: 'You\'ve learned the basics! Now build your deck, challenge opponents, and climb the leaderboards. Good luck, champion!',
    action: 'complete',
  },
];

export function TutorialSystem({ visible, onComplete, onSkip }: TutorialSystemProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(screenHeight));

  const step = tutorialSteps[currentStep];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  };

  const handleSkip = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onSkip();
    });
  };

  const renderStepContent = () => {
    switch (step.highlight) {
      case 'card':
        return (
          <View style={styles.cardDemo}>
            <GameCard
              card={{
                id: 'demo-1',
                name: 'Fire Warrior',
                description: 'A brave warrior wielding flames',
                cost: 3,
                attack: 4,
                health: 3,
                rarity: 'rare',
                type: 'creature',
                abilities: ['Burn'],
              }}
              size="large"
            />
            <View style={styles.cardAnnotations}>
              <View style={[styles.annotation, styles.costAnnotation]}>
                <Text style={styles.annotationText}>Cost: 3</Text>
              </View>
              <View style={[styles.annotation, styles.attackAnnotation]}>
                <Text style={styles.annotationText}>Attack: 4</Text>
              </View>
              <View style={[styles.annotation, styles.healthAnnotation]}>
                <Text style={styles.annotationText}>Health: 3</Text>
              </View>
            </View>
          </View>
        );

      case 'energy':
        return (
          <View style={styles.energyDemo}>
            <LinearGradient colors={['#00ff88', '#00cc6a']} style={styles.energyBar}>
              <View style={styles.energyContent}>
                <Zap size={32} color="#fff" />
                <Text style={styles.energyText}>Energy: 5/10</Text>
              </View>
            </LinearGradient>
            <Text style={styles.energyExplanation}>
              Energy increases each turn, allowing you to play more powerful cards as the battle progresses.
            </Text>
          </View>
        );

      case 'battle':
        return (
          <View style={styles.battleDemo}>
            <View style={styles.battlePlayer}>
              <Text style={styles.battlePlayerName}>Opponent</Text>
              <View style={styles.battleHealth}>
                <Heart size={20} color="#ff0066" />
                <Text style={styles.battleHealthText}>75/100</Text>
              </View>
            </View>
            
            <View style={styles.battleArrow}>
              <Target size={32} color="#ffd700" />
            </View>
            
            <View style={styles.battlePlayer}>
              <Text style={styles.battlePlayerName}>You</Text>
              <View style={styles.battleHealth}>
                <Heart size={20} color="#00ff88" />
                <Text style={styles.battleHealthText}>100/100</Text>
              </View>
            </View>
          </View>
        );

      case 'rarity':
        return (
          <View style={styles.rarityDemo}>
            {[
              { name: 'Common', color: '#9CA3AF', icon: <Star size={24} color="#9CA3AF" /> },
              { name: 'Rare', color: '#3B82F6', icon: <Star size={24} color="#3B82F6" /> },
              { name: 'Epic', color: '#8B5CF6', icon: <Star size={24} color="#8B5CF6" /> },
              { name: 'Legendary', color: '#F59E0B', icon: <Trophy size={24} color="#F59E0B" /> },
            ].map((rarity, index) => (
              <LinearGradient
                key={index}
                colors={[rarity.color + '20', rarity.color + '10']}
                style={[styles.rarityCard, { borderColor: rarity.color }]}
              >
                {rarity.icon}
                <Text style={[styles.rarityName, { color: rarity.color }]}>
                  {rarity.name}
                </Text>
              </LinearGradient>
            ))}
          </View>
        );

      default:
        return (
          <View style={styles.welcomeDemo}>
            <LinearGradient colors={['#00ff88', '#00cc6a']} style={styles.welcomeIcon}>
              <Play size={48} color="#fff" />
            </LinearGradient>
          </View>
        );
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View 
          style={[
            styles.tutorialContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <LinearGradient colors={['#0a0a0a', '#1a1a1a']} style={styles.tutorialContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.stepCounter}>
                {currentStep + 1} of {tutorialSteps.length}
              </Text>
              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressFill, 
                    { width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }
                  ]} 
                />
              </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
              
              <View style={styles.demoContainer}>
                {renderStepContent()}
              </View>
            </View>

            {/* Navigation */}
            <View style={styles.navigation}>
              <TouchableOpacity
                onPress={handlePrevious}
                disabled={currentStep === 0}
                style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
              >
                <ArrowLeft size={20} color={currentStep === 0 ? '#666' : '#fff'} />
                <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={step.action === 'complete' ? handleComplete : handleNext}
                style={[styles.navButton, styles.nextButton]}
              >
                <Text style={styles.navButtonText}>
                  {step.action === 'complete' ? 'Start Playing' : 'Next'}
                </Text>
                {step.action === 'complete' ? (
                  <Play size={20} color="#fff" />
                ) : (
                  <ArrowRight size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialContainer: {
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tutorialContent: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepCounter: {
    fontSize: 14,
    fontFamily: 'Exo2-SemiBold',
    color: '#ccc',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Exo2-SemiBold',
    color: '#00ff88',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  demoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  welcomeDemo: {
    alignItems: 'center',
  },
  welcomeIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDemo: {
    alignItems: 'center',
    position: 'relative',
  },
  cardAnnotations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  annotation: {
    position: 'absolute',
    backgroundColor: '#00ff88',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  costAnnotation: {
    top: -10,
    left: -10,
  },
  attackAnnotation: {
    bottom: 10,
    left: -10,
  },
  healthAnnotation: {
    bottom: 10,
    right: -10,
  },
  annotationText: {
    fontSize: 12,
    fontFamily: 'Exo2-Bold',
    color: '#fff',
  },
  energyDemo: {
    alignItems: 'center',
    width: '100%',
  },
  energyBar: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    width: 250,
  },
  energyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  energyText: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  energyExplanation: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    color: '#ccc',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  battleDemo: {
    alignItems: 'center',
    width: '100%',
  },
  battlePlayer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    width: 180,
  },
  battlePlayerName: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  battleHealth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  battleHealthText: {
    fontSize: 14,
    fontFamily: 'Exo2-SemiBold',
    color: '#fff',
  },
  battleArrow: {
    marginVertical: 12,
  },
  rarityDemo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  rarityCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    alignItems: 'center',
    width: 120,
    height: 80,
    justifyContent: 'center',
  },
  rarityName: {
    fontSize: 12,
    fontFamily: 'Orbitron-Bold',
    marginTop: 8,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: '#00ff88',
  },
  navButtonDisabled: {
    backgroundColor: '#1a1a1a',
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: 'Exo2-SemiBold',
    color: '#fff',
  },
  navButtonTextDisabled: {
    color: '#666',
  },
});