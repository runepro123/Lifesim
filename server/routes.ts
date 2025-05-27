import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-new";
import { insertCharacterSchema, insertSaveCodeSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Character routes
  app.get("/api/characters", async (req, res) => {
    try {
      const characters = await storage.getAllCharacters();
      res.json(characters);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/characters", async (req, res) => {
    try {
      const validatedData = insertCharacterSchema.parse(req.body);
      const character = await storage.createCharacter(validatedData);
      res.json(character);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const character = await storage.getCharacter(id);
      
      if (!character) {
        return res.status(404).json({ error: "Character not found" });
      }
      
      res.json(character);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const character = await storage.updateCharacter(id, req.body);
      
      if (!character) {
        return res.status(404).json({ error: "Character not found" });
      }
      
      res.json(character);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCharacter(id);
      
      if (!success) {
        return res.status(404).json({ error: "Character not found" });
      }
      
      res.json({ success: true, message: "Character deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/characters/:id/age-up", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const character = await storage.getCharacter(id);
      
      if (!character) {
        return res.status(404).json({ error: "Character not found" });
      }

      // Age up the character
      const newAge = character.age + 1;
      
      // Generate random life event
      const lifeEvent = await storage.getRandomLifeEvent(newAge);
      const newLifeEvents = [...(character.lifeEvents || [])];
      let statChanges = {};
      
      if (lifeEvent) {
        newLifeEvents.push(lifeEvent.description);
        statChanges = lifeEvent.statEffects || {};
      }

      // Apply natural aging effects
      const ageingEffects = {
        health: newAge > 50 ? -1 : 0,
        looks: newAge > 40 ? -0.5 : 0,
      };

      // Calculate salary payment if employed
      let salaryPayment = 0;
      if (character.currentJob && character.salary) {
        salaryPayment = character.salary;
      }

      // Calculate new stats
      const updatedCharacter = await storage.updateCharacter(id, {
        age: newAge,
        lifeEvents: newLifeEvents,
        happiness: Math.max(0, Math.min(100, character.happiness + (statChanges.happiness || 0))),
        health: Math.max(0, Math.min(100, character.health + (statChanges.health || 0) + ageingEffects.health)),
        smarts: Math.max(0, Math.min(100, character.smarts + (statChanges.smarts || 0))),
        looks: Math.max(0, Math.min(100, character.looks + (statChanges.looks || 0) + ageingEffects.looks)),
        fame: Math.max(0, Math.min(100, character.fame + (statChanges.fame || 0))),
        bankBalance: character.bankBalance + salaryPayment,
        workExperience: character.currentJob ? (character.workExperience || 0) + 1 : character.workExperience,
      });

      res.json({ character: updatedCharacter, lifeEvent });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Career routes
  app.get("/api/careers", async (req, res) => {
    try {
      const careers = await storage.getAllCareers();
      res.json(careers);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/careers/category/:category", async (req, res) => {
    try {
      const careers = await storage.getCareersByCategory(req.params.category);
      res.json(careers);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Relationship routes
  app.get("/api/characters/:id/relationships", async (req, res) => {
    try {
      const characterId = parseInt(req.params.id);
      const relationships = await storage.getCharacterRelationships(characterId);
      res.json(relationships);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Life events routes
  app.get("/api/life-events", async (req, res) => {
    try {
      const events = await storage.getAllLifeEvents();
      res.json(events);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/life-events/type/:type", async (req, res) => {
    try {
      const events = await storage.getLifeEventsByType(req.params.type);
      res.json(events);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Save code routes
  app.post("/api/save-codes", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code || typeof code !== 'string' || !/^\d{4}$/.test(code)) {
        return res.status(400).json({ error: "Save code must be a 4-digit number" });
      }
      
      const saveCode = await storage.createSaveCode(code);
      res.json(saveCode);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/save-codes/:code", async (req, res) => {
    try {
      const saveCode = await storage.getSaveCode(req.params.code);
      if (!saveCode) {
        return res.status(404).json({ error: "Save code not found" });
      }
      res.json(saveCode);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/save-codes/:code/characters", async (req, res) => {
    try {
      const characters = await storage.getCharactersByCode(req.params.code);
      res.json(characters);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
