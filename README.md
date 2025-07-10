# Card Clash Legends Arena

A strategic card battle game built with React Native and Expo. Battle with legendary creatures, build powerful decks, and climb the leaderboards!

## 🎮 Features

### Core Gameplay
- **Strategic Card Battles**: Turn-based combat with energy management
- **Deck Building**: Create custom decks from your card collection
- **Card Rarities**: Common, Rare, Epic, and Legendary cards with unique abilities
- **AI Opponents**: Battle against challenging AI with different difficulty levels

### Player Progression
- **Experience System**: Level up by playing battles and completing challenges
- **Achievement System**: Unlock rewards by completing various objectives
- **Daily Rewards**: Login bonuses and daily challenges
- **Battle Pass**: Seasonal progression with exclusive rewards

### Monetization Features
- **In-App Purchases**: Coins, gems, and card packs (RevenueCat integration ready)
- **Premium Battle Pass**: Enhanced rewards and progression
- **Shop System**: Various purchase options with special offers
- **Currency System**: Dual currency (coins and gems) for different purchase tiers

### Technical Features
- **Cross-Platform**: Runs on iOS, Android, and Web
- **Performance Optimized**: Virtualized lists, memoized components, lazy loading
- **Offline Support**: Local storage for game progress
- **Sound System**: Dynamic audio feedback with web compatibility
- **Responsive Design**: Optimized for all screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/card-clash-legends-arena.git
cd card-clash-legends-arena
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open the app:
   - **Web**: Opens automatically in your browser
   - **iOS**: Press `i` in the terminal or scan QR code with Expo Go
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go

## 📱 Building for Production

### Development Build
```bash
eas build --profile development --platform all
```

### Production Build
```bash
eas build --profile production --platform all
```

### Submit to App Stores
```bash
eas submit --platform all
```

## 💰 Monetization Setup

This app is designed for monetization through RevenueCat. To set up payments:

1. **Create RevenueCat Account**: Sign up at [revenuecat.com](https://revenuecat.com)

2. **Install RevenueCat SDK**:
```bash
npx expo install react-native-purchases
```

3. **Configure Products**: Set up your products in RevenueCat dashboard

4. **Update Configuration**: Add your RevenueCat API keys to environment variables

5. **Test Purchases**: Use RevenueCat's sandbox environment for testing

> **Note**: RevenueCat requires native code and won't work in Expo Go. Use a development build for testing purchases.

## 🎨 Design System

### Colors
- **Primary**: `#00ff88` (Neon Green)
- **Secondary**: `#8b5cf6` (Purple)
- **Accent**: `#ffd700` (Gold)
- **Error**: `#ff0066` (Red)
- **Background**: `#0a0a0a` (Dark)

### Typography
- **Headers**: Orbitron (Futuristic)
- **Body**: Exo 2 (Clean, readable)

### Card Rarities
- **Common**: `#9CA3AF` (Gray)
- **Rare**: `#3B82F6` (Blue)
- **Epic**: `#8B5CF6` (Purple)
- **Legendary**: `#F59E0B` (Gold)

## 🏗️ Architecture

### File Structure
```
app/
├── (tabs)/           # Tab navigation screens
├── battle/           # Battle system
├── deck-builder/     # Deck management
└── _layout.tsx       # Root layout

components/
├── BattleSystem.tsx      # Core battle mechanics
├── TutorialSystem.tsx    # Onboarding flow
├── RevenueSystem.tsx     # Monetization UI
├── PerformanceOptimizer.tsx # Performance utilities
└── GameCard.tsx          # Card component

context/
└── GameContext.tsx   # Global game state

types/
└── game.ts          # TypeScript definitions

utils/
└── gameUtils.ts     # Game logic utilities
```

### State Management
- **React Context**: Global game state
- **AsyncStorage**: Persistent data storage
- **Reducers**: Predictable state updates

### Performance Optimizations
- **Memoized Components**: Prevent unnecessary re-renders
- **Virtualized Lists**: Handle large card collections
- **Lazy Loading**: Load components on demand
- **Image Preloading**: Smooth visual experience

## 🎯 MVP Checklist

### ✅ Completed Features
- [x] Core battle system with turn-based gameplay
- [x] Card collection and deck building
- [x] Player progression (levels, experience, stats)
- [x] Tutorial system for new players
- [x] Sound system with web compatibility
- [x] Responsive design for all platforms
- [x] Performance optimizations
- [x] Monetization framework (RevenueCat ready)
- [x] Battle Pass system
- [x] Achievement system
- [x] Daily rewards

### 🔄 In Progress
- [ ] Multiplayer matchmaking
- [ ] Advanced AI difficulty scaling
- [ ] Social features (friends, chat)
- [ ] Tournament system

### 📋 Future Enhancements
- [ ] Card trading system
- [ ] Guild/clan features
- [ ] Seasonal events
- [ ] Advanced analytics
- [ ] Push notifications
- [ ] Leaderboard seasons

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Performance Testing
```bash
npm run test:performance
```

## 📊 Analytics & Monitoring

The app includes hooks for analytics and performance monitoring:

- **Performance Metrics**: Render times, memory usage
- **User Events**: Battle outcomes, purchases, progression
- **Error Tracking**: Crash reports and error logs
- **A/B Testing**: Feature flag support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team**: For the amazing development platform
- **RevenueCat**: For monetization infrastructure
- **Lucide Icons**: For beautiful iconography
- **Google Fonts**: For typography (Orbitron, Exo 2)

## 📞 Support

For support and questions:
- **Email**: support@cardclashlegends.com
- **Discord**: [Join our community](https://discord.gg/cardclash)
- **Issues**: [GitHub Issues](https://github.com/yourusername/card-clash-legends-arena/issues)

---

**Ready to become a legend? Download Card Clash Legends Arena and start your journey!** ⚔️✨