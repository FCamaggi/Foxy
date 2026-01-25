import { AnimalType, CardData, FoxyVariant } from './types';

export const calculateCorrectAnswer = (
  roundIndex: number, 
  deck: CardData[], 
  foxyVariant: FoxyVariant = 'standard'
): number => {
  const currentCard = deck[roundIndex];
  
  // History is all cards up to and including current
  const history = deck.slice(0, roundIndex + 1);

  if (currentCard.isFoxy) {
    switch (foxyVariant) {
      case 'standard':
        // Rule: Count how many DIFFERENT types of animals have been seen total so far
        const seenTypes = new Set<AnimalType>();
        history.forEach(card => {
          card.animals.forEach(animal => seenTypes.add(animal));
        });
        return seenTypes.size;
      
      case 'most-seen':
        // Rule: Count how many times the most repeated animal has appeared
        const animalCounts = new Map<AnimalType, number>();
        history.forEach(card => {
          card.animals.forEach(animal => {
            animalCounts.set(animal, (animalCounts.get(animal) || 0) + 1);
          });
        });
        return Math.max(...Array.from(animalCounts.values()), 0);
      
      case 'solitary':
        // Rule: Count how many cards had only one animal type
        return history.filter(card => !card.isFoxy && card.animals.length === 1).length;
      
      case 'cat-fox':
        // Rule: Count cats, and Foxy counts as one more cat
        let catCount = 0;
        history.forEach(card => {
          if (card.isFoxy) {
            catCount += 1; // Foxy counts as a cat
          } else {
            card.animals.forEach(animal => {
              if (animal === 'cat') catCount++;
            });
          }
        });
        return catCount;
      
      default:
        return 0;
    }
  } else {
    // Rule: For the types depicted on CURRENT card, count total appearances of those types in history
    const targetAnimals = new Set(currentCard.animals);
    let count = 0;
    
    history.forEach(card => {
      // In 'cat-fox' variant, Foxy cards count as cats
      if (foxyVariant === 'cat-fox' && card.isFoxy && targetAnimals.has('cat')) {
        count++;
      } else {
        card.animals.forEach(animal => {
          if (targetAnimals.has(animal)) {
            count++;
          }
        });
      }
    });
    return count;
  }
};

export const generateBotGuess = (
  roundIndex: number, 
  deck: CardData[], 
  foxyVariant: FoxyVariant = 'standard',
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): { guess: number, bet: boolean } => {
  const trueCount = calculateCorrectAnswer(roundIndex, deck, foxyVariant);
  
  const rand = Math.random();
  let guess = trueCount;

  // Simulate memory error
  const errorChance = difficulty === 'hard' ? 0.1 : difficulty === 'medium' ? 0.3 : 0.5;
  
  if (rand < errorChance) {
    // Make a mistake (usually slightly off)
    const offset = Math.random() > 0.5 ? 1 : -1;
    guess = Math.max(0, trueCount + offset);
    // Sometimes a bigger mistake
    if (Math.random() < 0.2) guess += offset; 
  }

  const wantsToBet = rand > 0.8 && guess === trueCount; 

  return { guess, bet: wantsToBet };
};
