import { 
  characters, 
  careers, 
  lifeEvents, 
  relationships,
  type Character, 
  type InsertCharacter,
  type Career,
  type InsertCareer,
  type LifeEvent,
  type InsertLifeEvent,
  type Relationship,
  type InsertRelationship
} from "@shared/schema";

export interface IStorage {
  // Save code methods
  createSaveCode(code: string): Promise<SaveCode>;
  getSaveCode(code: string): Promise<SaveCode | undefined>;
  getCharactersByCode(code: string): Promise<Character[]>;
  
  // Character methods
  getAllCharacters(): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, updates: Partial<Character>): Promise<Character | undefined>;
  deleteCharacter(id: number): Promise<boolean>;
  
  // Career methods
  getAllCareers(): Promise<Career[]>;
  getCareersByCategory(category: string): Promise<Career[]>;
  
  // Life event methods
  getAllLifeEvents(): Promise<LifeEvent[]>;
  getLifeEventsByType(type: string): Promise<LifeEvent[]>;
  getRandomLifeEvent(characterAge: number): Promise<LifeEvent | undefined>;
  
  // Relationship methods
  getCharacterRelationships(characterId: number): Promise<Relationship[]>;
  createRelationship(relationship: InsertRelationship): Promise<Relationship>;
  updateRelationship(id: number, updates: Partial<Relationship>): Promise<Relationship | undefined>;
}

export class MemStorage implements IStorage {
  private characters: Map<number, Character>;
  private careers: Map<number, Career>;
  private lifeEvents: Map<number, LifeEvent>;
  private relationships: Map<number, Relationship>;
  private currentCharacterId: number;
  private currentCareerId: number;
  private currentLifeEventId: number;
  private currentRelationshipId: number;

  constructor() {
    this.characters = new Map();
    this.careers = new Map();
    this.lifeEvents = new Map();
    this.relationships = new Map();
    this.currentCharacterId = 1;
    this.currentCareerId = 1;
    this.currentLifeEventId = 1;
    this.currentRelationshipId = 1;
    
    this.initializeGameData();
  }

  private initializeGameData() {
    // Initialize careers
    const defaultCareers: InsertCareer[] = [
      { name: "TV Actor", category: "Entertainment", minAge: 18, baseSalary: 50000, requirements: { looks: 70, fame: 20 } },
      { name: "Software Engineer", category: "Technology", minAge: 22, baseSalary: 80000, requirements: { smarts: 80 } },
      { name: "Doctor", category: "Medical", minAge: 26, baseSalary: 120000, requirements: { smarts: 90 } },
      { name: "Teacher", category: "Education", minAge: 22, baseSalary: 40000, requirements: { smarts: 60 } },
      { name: "Police Officer", category: "Public Service", minAge: 21, baseSalary: 50000, requirements: { health: 70 } },
      { name: "Restaurant Worker", category: "Service", minAge: 16, baseSalary: 25000, requirements: {} },
    ];

    defaultCareers.forEach(career => {
      const newCareer: Career = { ...career, id: this.currentCareerId++ };
      this.careers.set(newCareer.id, newCareer);
    });

    // Initialize life events
    const defaultLifeEvents: InsertLifeEvent[] = [
      {
        type: "family",
        title: "New Family Member",
        description: "A new family member was born!",
        ageRange: { min: 16, max: 80 },
        statEffects: { happiness: 10 },
        probability: 30
      },
      {
        type: "health",
        title: "Illness",
        description: "You caught a cold and felt unwell.",
        ageRange: { min: 5, max: 100 },
        statEffects: { health: -15, happiness: -5 },
        probability: 40
      },
      {
        type: "financial",
        title: "Found Money",
        description: "You found some money on the street!",
        ageRange: { min: 10, max: 100 },
        statEffects: { happiness: 5 },
        probability: 20
      },
      {
        type: "education",
        title: "Academic Achievement",
        description: "You excelled in your studies!",
        ageRange: { min: 6, max: 25 },
        statEffects: { smarts: 10, happiness: 5 },
        probability: 25
      },
      {
        type: "social",
        title: "Made a Friend",
        description: "You made a new friend at school/work.",
        ageRange: { min: 5, max: 100 },
        statEffects: { happiness: 8 },
        probability: 35
      }
    ];

    defaultLifeEvents.forEach(event => {
      const newEvent: LifeEvent = { ...event, id: this.currentLifeEventId++ };
      this.lifeEvents.set(newEvent.id, newEvent);
    });
  }

  async getAllCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values());
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const character: Character = {
      ...insertCharacter,
      id: this.currentCharacterId++,
      createdAt: Date.now(),
    };
    this.characters.set(character.id, character);
    
    // Create initial family relationships
    await this.createInitialFamily(character.id);
    
    return character;
  }

  async updateCharacter(id: number, updates: Partial<Character>): Promise<Character | undefined> {
    const character = this.characters.get(id);
    if (!character) return undefined;
    
    const updatedCharacter = { ...character, ...updates };
    this.characters.set(id, updatedCharacter);
    return updatedCharacter;
  }

  async deleteCharacter(id: number): Promise<boolean> {
    return this.characters.delete(id);
  }

  async getAllCareers(): Promise<Career[]> {
    return Array.from(this.careers.values());
  }

  async getCareersByCategory(category: string): Promise<Career[]> {
    return Array.from(this.careers.values()).filter(career => career.category === category);
  }

  async getAllLifeEvents(): Promise<LifeEvent[]> {
    return Array.from(this.lifeEvents.values());
  }

  async getLifeEventsByType(type: string): Promise<LifeEvent[]> {
    return Array.from(this.lifeEvents.values()).filter(event => event.type === type);
  }

  async getRandomLifeEvent(characterAge: number): Promise<LifeEvent | undefined> {
    const eligibleEvents = Array.from(this.lifeEvents.values()).filter(event => {
      if (!event.ageRange) return true;
      return characterAge >= event.ageRange.min && characterAge <= event.ageRange.max;
    });

    if (eligibleEvents.length === 0) return undefined;

    // Weighted random selection based on probability
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

  async getCharacterRelationships(characterId: number): Promise<Relationship[]> {
    return Array.from(this.relationships.values()).filter(rel => rel.characterId === characterId);
  }

  async createRelationship(insertRelationship: InsertRelationship): Promise<Relationship> {
    const relationship: Relationship = {
      ...insertRelationship,
      id: this.currentRelationshipId++,
    };
    this.relationships.set(relationship.id, relationship);
    return relationship;
  }

  async updateRelationship(id: number, updates: Partial<Relationship>): Promise<Relationship | undefined> {
    const relationship = this.relationships.get(id);
    if (!relationship) return undefined;
    
    const updatedRelationship = { ...relationship, ...updates };
    this.relationships.set(id, updatedRelationship);
    return updatedRelationship;
  }

  private async createInitialFamily(characterId: number) {
    const familyNames = [
      { first: "John", last: "Smith" },
      { first: "Mary", last: "Johnson" },
      { first: "Michael", last: "Williams" },
      { first: "Patricia", last: "Brown" },
      { first: "Robert", last: "Jones" },
      { first: "Jennifer", last: "Garcia" }
    ];

    // Create parents
    const father = familyNames[Math.floor(Math.random() * familyNames.length)];
    const mother = familyNames[Math.floor(Math.random() * familyNames.length)];

    await this.createRelationship({
      characterId,
      name: `${father.first} ${father.last}`,
      type: "parent",
      relationship: 70 + Math.floor(Math.random() * 30),
      age: 45 + Math.floor(Math.random() * 15),
      isAlive: true
    });

    await this.createRelationship({
      characterId,
      name: `${mother.first} ${mother.last}`,
      type: "parent",
      relationship: 70 + Math.floor(Math.random() * 30),
      age: 40 + Math.floor(Math.random() * 15),
      isAlive: true
    });

    // Maybe create siblings (50% chance)
    if (Math.random() > 0.5) {
      const sibling = familyNames[Math.floor(Math.random() * familyNames.length)];
      await this.createRelationship({
        characterId,
        name: `${sibling.first} ${sibling.last}`,
        type: "sibling",
        relationship: 50 + Math.floor(Math.random() * 40),
        age: Math.floor(Math.random() * 30) + 10,
        isAlive: true
      });
    }
  }
}

import { db } from "./db";
import { eq, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async createSaveCode(code: string): Promise<SaveCode> {
    const [saveCode] = await db
      .insert(saveCodes)
      .values({ code, createdAt: Date.now() })
      .returning();
    return saveCode;
  }

  async getSaveCode(code: string): Promise<SaveCode | undefined> {
    const [saveCode] = await db.select().from(saveCodes).where(eq(saveCodes.code, code));
    return saveCode || undefined;
  }

  async getCharactersByCode(code: string): Promise<Character[]> {
    const saveCode = await this.getSaveCode(code);
    if (!saveCode) return [];
    
    return db.select().from(characters).where(eq(characters.saveCodeId, saveCode.id));
  }

  async getAllCharacters(): Promise<Character[]> {
    return db.select().from(characters);
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    const [character] = await db.select().from(characters).where(eq(characters.id, id));
    return character || undefined;
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const [character] = await db
      .insert(characters)
      .values({ ...insertCharacter, createdAt: Date.now() })
      .returning();
    return character;
  }

  async updateCharacter(id: number, updates: Partial<Character>): Promise<Character | undefined> {
    const [character] = await db
      .update(characters)
      .set(updates)
      .where(eq(characters.id, id))
      .returning();
    return character || undefined;
  }

  async deleteCharacter(id: number): Promise<boolean> {
    const result = await db.delete(characters).where(eq(characters.id, id));
    return result.rowCount > 0;
  }

  // Initialize with static data
  async getAllCareers(): Promise<Career[]> {
    const existing = await db.select().from(careers);
    if (existing.length > 0) return existing;
    
    // Insert initial career data
    const careerData = [
      { name: "Fast Food Worker", category: "entry", baseSalary: 15000, minAge: 14 },
      { name: "Retail Associate", category: "entry", baseSalary: 18000, minAge: 16 },
      { name: "Teacher", category: "education", baseSalary: 35000, minAge: 22 },
      { name: "Software Developer", category: "technology", baseSalary: 70000, minAge: 20 },
      { name: "Doctor", category: "healthcare", baseSalary: 200000, minAge: 28 },
    ];
    
    await db.insert(careers).values(careerData);
    return db.select().from(careers);
  }

  async getCareersByCategory(category: string): Promise<Career[]> {
    return db.select().from(careers).where(eq(careers.category, category));
  }

  async getAllLifeEvents(): Promise<LifeEvent[]> {
    const existing = await db.select().from(lifeEvents);
    if (existing.length > 0) return existing;
    
    // Insert initial life events
    const eventData = [
      { type: "positive", title: "Great Day", description: "You had a wonderful day!", probability: 30, statEffects: { happiness: 5 } },
      { type: "negative", title: "Bad Day", description: "You had a rough day.", probability: 20, statEffects: { happiness: -3 } },
      { type: "health", title: "Got Sick", description: "You caught a cold.", probability: 15, statEffects: { health: -5 } },
    ];
    
    await db.insert(lifeEvents).values(eventData);
    return db.select().from(lifeEvents);
  }

  async getLifeEventsByType(type: string): Promise<LifeEvent[]> {
    return db.select().from(lifeEvents).where(eq(lifeEvents.type, type));
  }

  async getRandomLifeEvent(characterAge: number): Promise<LifeEvent | undefined> {
    const events = await this.getAllLifeEvents();
    if (events.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * events.length);
    return events[randomIndex];
  }

  async getCharacterRelationships(characterId: number): Promise<Relationship[]> {
    return db.select().from(relationships).where(eq(relationships.characterId, characterId));
  }

  async createRelationship(insertRelationship: InsertRelationship): Promise<Relationship> {
    const [relationship] = await db
      .insert(relationships)
      .values(insertRelationship)
      .returning();
    return relationship;
  }

  async updateRelationship(id: number, updates: Partial<Relationship>): Promise<Relationship | undefined> {
    const [relationship] = await db
      .update(relationships)
      .set(updates)
      .where(eq(relationships.id, id))
      .returning();
    return relationship || undefined;
  }
}

export const storage = new DatabaseStorage();
