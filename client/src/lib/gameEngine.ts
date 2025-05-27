import type { Character, LifeEvent } from "@shared/schema";

export class GameEngine {
  static generateRandomLifeEvent(character: Character): LifeEvent | null {
    // This would be enhanced with more sophisticated event generation
    const events: LifeEvent[] = [
      {
        id: 1,
        type: "family",
        title: "New Family Member",
        description: "A family member had a baby!",
        ageRange: { min: 16, max: 80 },
        statEffects: { happiness: 10 },
        probability: 30,
        requirements: {}
      },
      {
        id: 2,
        type: "health", 
        title: "Minor Illness",
        description: "You caught a cold and felt unwell.",
        ageRange: { min: 5, max: 100 },
        statEffects: { health: -10, happiness: -5 },
        probability: 40,
        requirements: {}
      },
      {
        id: 3,
        type: "financial",
        title: "Found Money",
        description: "You found some money on the street!",
        ageRange: { min: 10, max: 100 },
        statEffects: { happiness: 5 },
        probability: 20,
        requirements: {}
      }
    ];

    const eligibleEvents = events.filter(event => {
      if (!event.ageRange) return true;
      return character.age >= event.ageRange.min && character.age <= event.ageRange.max;
    });

    if (eligibleEvents.length === 0) return null;

    // Weighted random selection
    const totalProbability = eligibleEvents.reduce((sum, event) => sum + event.probability, 0);
    const random = Math.random() * totalProbability;
    
    let currentSum = 0;
    for (const event of eligibleEvents) {
      currentSum += event.probability;
      if (random <= currentSum) {
        return event;
      }
    }

    return eligibleEvents[0];
  }

  static applyAgeingEffects(character: Character): Partial<Character> {
    const updates: Partial<Character> = {};
    
    // Natural aging effects
    if (character.age > 50) {
      updates.health = Math.max(0, character.health - 1);
    }
    
    if (character.age > 40) {
      updates.looks = Math.max(0, character.looks - 0.5);
    }

    // Wisdom increases with age
    if (character.age > 25) {
      updates.smarts = Math.min(100, character.smarts + 0.2);
    }

    return updates;
  }

  static calculateJobEligibility(character: Character, jobRequirements: Record<string, any>): boolean {
    return Object.entries(jobRequirements).every(([stat, required]) => {
      const characterStat = character[stat as keyof Character] as number;
      return characterStat >= required;
    });
  }

  static generateRandomStats(): { happiness: number; health: number; smarts: number; looks: number } {
    return {
      happiness: Math.floor(Math.random() * 40) + 50, // 50-90
      health: Math.floor(Math.random() * 40) + 50,    // 50-90
      smarts: Math.floor(Math.random() * 40) + 40,    // 40-80
      looks: Math.floor(Math.random() * 40) + 40,     // 40-80
    };
  }
}
