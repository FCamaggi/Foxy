import { AnimalType, CardData, EnvironmentType, DifficultyLevel } from './types';

// Helper to create card
const createCard = (env: EnvironmentType, animals: AnimalType[]): CardData => ({
  id: Math.random().toString(36).substr(2, 9),
  isFoxy: false,
  environment: env,
  animals
});

// Generate complete card pool with all combinations
const generateCardPool = (): CardData[] => {
  const pool: CardData[] = [];
  
  // Define animals by environment
  const envAnimals: Record<EnvironmentType, AnimalType[]> = {
    farm: ['pig', 'rooster', 'cat'],
    savanna: ['zebra', 'giraffe', 'cat'],
    ocean: ['dolphin', 'octopus', 'cat'],
    forest: ['bear', 'rabbit', 'cat']
  };

  // For each environment, create all combinations
  Object.entries(envAnimals).forEach(([env, animals]) => {
    const environment = env as EnvironmentType;
    
    // 1-animal cards: 4 copies of each primary animal
    animals.forEach(animal => {
      const count = animal === 'cat' ? 2 : 4; // Fewer cat-only cards
      for (let i = 0; i < count; i++) {
        pool.push(createCard(environment, [animal]));
      }
    });
    
    // 2-animal combinations: All pairs
    for (let i = 0; i < animals.length; i++) {
      for (let j = i + 1; j < animals.length; j++) {
        for (let k = 0; k < 2; k++) { // 2 copies of each pair
          pool.push(createCard(environment, [animals[i], animals[j]]));
        }
      }
    }
    
    // 3-animal combinations: All animals from the environment
    if (animals.length === 3) {
      for (let i = 0; i < 1; i++) { // 1 copy of the trio
        pool.push(createCard(environment, [...animals]));
      }
    }
  });

  return pool;
};

export const generateDeck = (difficulty: DifficultyLevel = 'medium', variance: number = 0.1): CardData[] => {
  const pool = generateCardPool();
  
  // Define weights for card complexity based on difficulty
  const weights = {
    easy: { one: 0.70, two: 0.25, three: 0.05 },
    medium: { one: 0.50, two: 0.30, three: 0.20 },
    hard: { one: 0.40, two: 0.35, three: 0.25 }
  };
  
  const baseWeights = weights[difficulty];
  
  // Apply random variance to weights
  const randomVariance = () => 1 + (Math.random() - 0.5) * variance * 2;
  const variedWeights = {
    one: baseWeights.one * randomVariance(),
    two: baseWeights.two * randomVariance(),
    three: baseWeights.three * randomVariance()
  };
  
  // Normalize weights to sum to 1
  const total = variedWeights.one + variedWeights.two + variedWeights.three;
  const normalizedWeights = {
    one: variedWeights.one / total,
    two: variedWeights.two / total,
    three: variedWeights.three / total
  };
  
  // Separate pool by animal count
  const poolByCount = {
    one: pool.filter(c => c.animals.length === 1),
    two: pool.filter(c => c.animals.length === 2),
    three: pool.filter(c => c.animals.length === 3)
  };
  
  // Select 19 cards based on weights
  const selectedCards: CardData[] = [];
  const targetCounts = {
    one: Math.round(19 * normalizedWeights.one),
    two: Math.round(19 * normalizedWeights.two),
    three: 0 // Will be calculated
  };
  
  // Ensure we have exactly 19 cards
  targetCounts.three = 19 - targetCounts.one - targetCounts.two;
  
  // Helper to shuffle array
  const shuffle = <T,>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Select cards from each category
  const selectFromPool = (cardPool: CardData[], count: number): CardData[] => {
    const shuffled = shuffle(cardPool);
    return shuffled.slice(0, count).map(card => ({
      ...card,
      id: Math.random().toString(36).substr(2, 9) // New ID for each instance
    }));
  };
  
  selectedCards.push(...selectFromPool(poolByCount.one, targetCounts.one));
  selectedCards.push(...selectFromPool(poolByCount.two, targetCounts.two));
  selectedCards.push(...selectFromPool(poolByCount.three, targetCounts.three));
  
  // Add Foxy card
  selectedCards.push({
    id: 'foxy-card',
    isFoxy: true,
    animals: []
  });
  
  // Final shuffle
  return shuffle(selectedCards);
};
