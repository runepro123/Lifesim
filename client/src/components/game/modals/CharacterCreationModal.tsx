import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dice1, User, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { InsertCharacter } from "@shared/schema";

interface CharacterCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCharacterCreated: (characterId: number) => void;
}

interface CharacterStats {
  happiness: number;
  health: number;
  smarts: number;
  looks: number;
}

export default function CharacterCreationModal({ isOpen, onClose, onCharacterCreated }: CharacterCreationModalProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [country, setCountry] = useState("");
  const [talent, setTalent] = useState<"normal" | "famous" | "">("");
  const [stats, setStats] = useState<CharacterStats>({
    happiness: 75,
    health: 85,
    smarts: 60,
    looks: 90,
  });

  const createCharacterMutation = useMutation({
    mutationFn: (character: InsertCharacter) => apiRequest('POST', '/api/characters', character),
    onSuccess: async (response) => {
      const character = await response.json();
      console.log('Character created with ID:', character.id);
      onCharacterCreated(character.id);
      resetForm();
    },
  });

  const resetForm = () => {
    setName("");
    setGender("");
    setCountry("");
    setTalent("");
    randomizeStats();
  };

  const randomizeStats = () => {
    setStats({
      happiness: Math.floor(Math.random() * 40) + 50, // 50-90
      health: Math.floor(Math.random() * 40) + 50,    // 50-90
      smarts: Math.floor(Math.random() * 40) + 40,    // 40-80
      looks: Math.floor(Math.random() * 40) + 40,     // 40-80
    });
  };

  const handleStartLife = () => {
    if (!name || !gender || !country || !talent) return;

    const character: InsertCharacter = {
      name,
      gender,
      country,
      talent,
      age: 0,
      bankBalance: Math.floor(Math.random() * 5000) + 1000, // Random starting money
      happiness: stats.happiness,
      health: stats.health,
      smarts: stats.smarts,
      looks: stats.looks,
      fame: talent === "famous" ? 10 : 0, // Famous talent starts with some fame
      currentJob: null,
      jobReputation: 0,
      salary: 0,
      workExperience: 0,
      youtubeFollowers: 0,
      tiktokFollowers: 0,
      isAlive: true,
      relationships: {},
      assets: {},
      lifeEvents: [],
    };

    createCharacterMutation.mutate(character);
  };

  const countries = [
    "United States",
    "United Kingdom", 
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "Random"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900 text-center">Create New Life</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700">Gender</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Button
                  type="button"
                  variant={gender === "male" ? "default" : "outline"}
                  onClick={() => setGender("male")}
                  className="p-3 h-auto"
                >
                  <div className="text-center">
                    <User className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-medium">Male</div>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={gender === "female" ? "default" : "outline"}
                  onClick={() => setGender("female")}
                  className="p-3 h-auto"
                >
                  <div className="text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-pink-600" />
                    <div className="text-sm font-medium">Female</div>
                  </div>
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="talent" className="text-sm font-medium text-gray-700">Special Talent</Label>
              <Select value={talent} onValueChange={(value: "normal" | "famous") => setTalent(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose your talent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal - Regular life experience</SelectItem>
                  <SelectItem value="famous">Famous - Easier path to fame and success</SelectItem>
                </SelectContent>
              </Select>
              {talent && (
                <div className="mt-2 text-xs text-gray-600">
                  {talent === "normal" ? "You'll live a normal life with standard opportunities." : "You'll have special advantages in gaining fame and social media followers!"}
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Starting Stats (Randomized)</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={randomizeStats}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Dice1 className="w-4 h-4 mr-1" />
                  Randomize Again
                </Button>
              </div>
              <div className="space-y-3">
                {Object.entries(stats).map(([stat, value]) => (
                  <div key={stat} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{stat}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={value} className="w-24 h-2" />
                      <span className="text-sm text-gray-600 w-8">{value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={onClose}
              disabled={createCharacterMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-blue-500 hover:bg-blue-600" 
              onClick={handleStartLife}
              disabled={!name || !gender || !country || !talent || createCharacterMutation.isPending}
            >
              {createCharacterMutation.isPending ? 'Creating...' : 'Start Life'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
