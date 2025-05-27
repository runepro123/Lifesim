import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Clock, Star, DollarSign, Users } from "lucide-react";
import { useLocation } from "wouter";
import CharacterCreationModal from "@/components/game/modals/CharacterCreationModal";
import type { Character } from "@shared/schema";

export default function MainMenu() {
  const [, setLocation] = useLocation();
  const [showCreationModal, setShowCreationModal] = useState(false);

  // This would normally fetch saved characters from the API
  // For now we'll simulate some saved lives
  const { data: savedCharacters = [] } = useQuery<Character[]>({
    queryKey: ['/api/characters'],
    enabled: false, // Disable for now since we don't have a list endpoint
  });

  const handleCreateNewLife = () => {
    setShowCreationModal(true);
  };

  const handleCharacterCreated = (characterId: number) => {
    console.log('Navigating to game with character ID:', characterId);
    setShowCreationModal(false);
    // Use window.location to ensure query parameters are preserved
    window.location.href = `/game?character=${characterId}`;
  };

  const handleContinueLife = (characterId: number) => {
    setLocation(`/game?character=${characterId}`);
  };

  // Mock data for demonstration - in real app this would come from API
  const mockSavedLives = [
    {
      id: 1,
      name: "Alex Johnson",
      age: 25,
      gender: "male",
      currentJob: "Software Engineer",
      bankBalance: 85000,
      fame: 15,
      talent: "normal",
      country: "United States",
      happiness: 78,
      health: 82,
      smarts: 90,
      looks: 65,
      youtubeFollowers: 1250,
      tiktokFollowers: 890
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      age: 19,
      gender: "female",
      currentJob: "Part-time Cashier",
      bankBalance: 12000,
      fame: 45,
      talent: "famous",
      country: "Canada",
      happiness: 85,
      health: 95,
      smarts: 70,
      looks: 88,
      youtubeFollowers: 25000,
      tiktokFollowers: 45000
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Life</h1>
          <p className="text-lg text-gray-600">Live your best virtual life</p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCreateNewLife}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="text-green-600 w-8 h-8" />
              </div>
              <CardTitle className="text-xl">Create New Life</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Start fresh with a new character and make your own choices</p>
              <Button className="w-full bg-green-500 hover:bg-green-600">
                Start New Life
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="text-blue-600 w-8 h-8" />
              </div>
              <CardTitle className="text-xl">Continue Life</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Resume your existing character's journey</p>
              <Button variant="outline" className="w-full" disabled={mockSavedLives.length === 0}>
                {mockSavedLives.length === 0 ? 'No Saved Lives' : 'View Saved Lives'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Saved Lives */}
        {mockSavedLives.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Lives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockSavedLives.map((character) => (
                <Card key={character.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{character.name}</CardTitle>
                        <p className="text-sm text-gray-600">
                          Age {character.age} • {character.gender} • {character.country}
                        </p>
                      </div>
                      <Badge variant={character.talent === "famous" ? "default" : "secondary"}>
                        {character.talent === "famous" ? "Famous" : "Normal"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{character.currentJob || "Unemployed"}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span>${character.bankBalance.toLocaleString()}</span>
                    </div>

                    {character.fame > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{character.fame}% Fame</span>
                      </div>
                    )}

                    {(character.youtubeFollowers > 0 || character.tiktokFollowers > 0) && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>
                          {character.youtubeFollowers > 0 && `${character.youtubeFollowers.toLocaleString()} YT`}
                          {character.youtubeFollowers > 0 && character.tiktokFollowers > 0 && " • "}
                          {character.tiktokFollowers > 0 && `${character.tiktokFollowers.toLocaleString()} TT`}
                        </span>
                      </div>
                    )}

                    <Button 
                      className="w-full mt-3" 
                      onClick={() => handleContinueLife(character.id)}
                    >
                      Continue Life
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Character Creation Modal */}
        <CharacterCreationModal
          isOpen={showCreationModal}
          onClose={() => setShowCreationModal(false)}
          onCharacterCreated={handleCharacterCreated}
        />
      </div>
    </div>
  );
}