import React, { memo, useMemo, useCallback } from 'react';
import { View, FlatList, VirtualizedList } from 'react-native';
import { Card } from '@/types/game';

// Memoized card component for better performance
export const OptimizedGameCard = memo(({ card, onPress, disabled, size }: {
  card: Card;
  onPress?: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}) => {
  const handlePress = useCallback(() => {
    if (onPress && !disabled) {
      onPress();
    }
  }, [onPress, disabled]);

  return (
    <GameCard
      card={card}
      onPress={handlePress}
      disabled={disabled}
      size={size}
    />
  );
});

// Optimized card list with virtualization
export const OptimizedCardList = memo(({ 
  cards, 
  onCardPress, 
  numColumns = 2,
  horizontal = false 
}: {
  cards: Card[];
  onCardPress: (card: Card) => void;
  numColumns?: number;
  horizontal?: boolean;
}) => {
  const renderCard = useCallback(({ item }: { item: Card }) => (
    <OptimizedGameCard
      card={item}
      onPress={() => onCardPress(item)}
      size="medium"
    />
  ), [onCardPress]);

  const keyExtractor = useCallback((item: Card) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: horizontal ? 160 : 220,
    offset: (horizontal ? 160 : 220) * index,
    index,
  }), [horizontal]);

  return (
    <FlatList
      data={cards}
      renderItem={renderCard}
      keyExtractor={keyExtractor}
      numColumns={horizontal ? 1 : numColumns}
      horizontal={horizontal}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={6}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
});

// Performance monitoring hook
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = React.useState({
    renderTime: 0,
    memoryUsage: 0,
    frameDrops: 0,
  });

  React.useEffect(() => {
    const startTime = performance.now();
    
    const updateMetrics = () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Basic memory usage estimation (web only)
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
      
      setMetrics(prev => ({
        ...prev,
        renderTime,
        memoryUsage: memoryUsage / 1024 / 1024, // Convert to MB
      }));
    };

    const timeoutId = setTimeout(updateMetrics, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return metrics;
}

// Image preloader for better performance
export class ImagePreloader {
  private static cache = new Map<string, boolean>();

  static preloadImages(urls: string[]): Promise<void[]> {
    return Promise.all(
      urls.map(url => this.preloadImage(url))
    );
  }

  static preloadImage(url: string): Promise<void> {
    if (this.cache.has(url)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(url, true);
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  static isImageCached(url: string): boolean {
    return this.cache.has(url);
  }
}

// Debounced search hook for better performance
export function useDebouncedSearch(searchTerm: string, delay: number = 300) {
  const [debouncedTerm, setDebouncedTerm] = React.useState(searchTerm);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  return debouncedTerm;
}

// Memoized filter function for card lists
export function useFilteredCards(cards: Card[], filters: {
  search?: string;
  rarity?: string;
  type?: string;
}) {
  return useMemo(() => {
    return cards.filter(card => {
      if (filters.search && !card.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.rarity && filters.rarity !== 'all' && card.rarity !== filters.rarity) {
        return false;
      }
      if (filters.type && filters.type !== 'all' && card.type !== filters.type) {
        return false;
      }
      return true;
    });
  }, [cards, filters.search, filters.rarity, filters.type]);
}

// Lazy loading wrapper component
export const LazyComponent = memo(({ 
  children, 
  fallback = null,
  threshold = 100 
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<View>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (ref.current) {
      observer.observe(ref.current as any);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <View ref={ref}>
      {isVisible ? children : fallback}
    </View>
  );
});

import { GameCard } from './GameCard';