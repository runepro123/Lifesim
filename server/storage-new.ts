import {
  type SaveCode,
  type Character,
  type InsertCharacter,
  type Career,
  type InsertCareer,
  type LifeEvent,
  type InsertLifeEvent,
  type Relationship,
  type InsertRelationship,
  saveCodes,
  characters,
  careers,
  lifeEvents,
  relationships
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
      .values(insertCharacter)
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
    return (result.rowCount || 0) > 0;
  }

  // Initialize with static data for now
  async getAllCareers(): Promise<Career[]> {
    const existing = await db.select().from(careers);
    if (existing.length > 0) return existing;
    
    // Insert initial career data
    const careerData = [
      { name: "Fast Food Worker", category: "entry", baseSalary: 15000, minAge: 14, minEducation: null, requirements: {} },
      { name: "Retail Associate", category: "entry", baseSalary: 18000, minAge: 16, minEducation: null, requirements: {} },
      { name: "Teacher", category: "education", baseSalary: 35000, minAge: 22, minEducation: "Bachelor's", requirements: {} },
      { name: "Software Developer", category: "technology", baseSalary: 70000, minAge: 20, minEducation: "Bachelor's", requirements: {} },
      { name: "Doctor", category: "healthcare", baseSalary: 200000, minAge: 28, minEducation: "Medical Degree", requirements: {} },
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
      { 
        type: "positive", 
        title: "Great Day", 
        description: "You had a wonderful day!", 
        probability: 30, 
        statEffects: { happiness: 5 },
        ageRange: null,
        requirements: {}
      },
      { 
        type: "negative", 
        title: "Bad Day", 
        description: "You had a rough day.", 
        probability: 20, 
        statEffects: { happiness: -3 },
        ageRange: null,
        requirements: {}
      },
      { 
        type: "health", 
        title: "Got Sick", 
        description: "You caught a cold.", 
        probability: 15, 
        statEffects: { health: -5 },
        ageRange: null,
        requirements: {}
      },
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