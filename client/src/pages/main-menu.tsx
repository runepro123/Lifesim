import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Play, Clock, Star, DollarSign, Users, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import CharacterCreationModal from "@/components/game/modals/CharacterCreationModal";
import SaveCodeModal from "@/components/SaveCodeModal";
import type { Character } from "@shared/schema";

export default function MainMenu() {
  const [, setLocation] = useLocation();
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showSaveCodeModal, setShowSaveCodeModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [currentSaveCode, setCurrentSaveCode] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for saved code in localStorage on mount
  useEffect(() => {
    const savedCode = localStorage.getItem('saveCode');
    if (savedCode) {
      setCurrentSaveCode(savedCode);
    } else {
      setShowSaveCodeModal(true);
    }
  }, []);

  // Fetch characters for the current save code
  const { data: savedCharacters = [] } = useQuery<Character[]>({
    queryKey: ['/api/save-codes', currentSaveCode, 'characters'],
    enabled: !!currentSaveCode,
  });

  // Delete character mutation
  const deleteCharacterMutation = useMutation({
    mutationFn: (characterId: number) => apiRequest('DELETE', `/api/characters/${characterId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/characters'] });
      toast({
        title: "Life Deleted",
        description: "Your character has been successfully removed.",
      });
      setDeleteDialogOpen(false);
      setCharacterToDelete(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the character. Please try again.",
        variant: "destructive",
      });
    },
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

  const handleDeleteLife = (character: Character) => {
    setCharacterToDelete(character);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (characterToDelete) {
      deleteCharacterMutation.mutate(characterToDelete.id);
    }
  };

  const handleCodeAuthenticated = (code: string) => {
    setCurrentSaveCode(code);
    localStorage.setItem('saveCode', code);
    // Invalidate and refetch characters for the new code
    queryClient.invalidateQueries({ queryKey: ['/api/save-codes', code, 'characters'] });
  };

  const handleChangeSaveCode = () => {
    localStorage.removeItem('saveCode');
    setCurrentSaveCode(null);
    setShowSaveCodeModal(true);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Life</h1>
          <p className="text-lg text-gray-600">Live your best virtual life</p>
          {currentSaveCode && (
            <div className="mt-4">
              <Badge variant="outline" className="text-sm">
                Save Code: {currentSaveCode}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleChangeSaveCode}
                className="ml-2 text-xs"
              >
                Change Code
              </Button>
            </div>
          )}
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
              <Button variant="outline" className="w-full" disabled={savedCharacters.length === 0}>
                {savedCharacters.length === 0 ? 'No Saved Lives' : 'View Saved Lives'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Saved Lives */}
        {savedCharacters.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Lives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedCharacters.map((character) => (
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

                    {((character.youtubeFollowers || 0) > 0 || (character.tiktokFollowers || 0) > 0) && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>
                          {(character.youtubeFollowers || 0) > 0 && `${(character.youtubeFollowers || 0).toLocaleString()} YT`}
                          {(character.youtubeFollowers || 0) > 0 && (character.tiktokFollowers || 0) > 0 && " • "}
                          {(character.tiktokFollowers || 0) > 0 && `${(character.tiktokFollowers || 0).toLocaleString()} TT`}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      <Button 
                        className="flex-1" 
                        onClick={() => handleContinueLife(character.id)}
                      >
                        Continue Life
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLife(character);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
          saveCode={currentSaveCode}
        />

        {/* Save Code Authentication Modal */}
        <SaveCodeModal
          isOpen={showSaveCodeModal}
          onClose={() => setShowSaveCodeModal(false)}
          onCodeAuthenticated={handleCodeAuthenticated}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Life</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{characterToDelete?.name}"? This action cannot be undone and all progress will be lost forever.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteCharacterMutation.isPending}
              >
                {deleteCharacterMutation.isPending ? "Deleting..." : "Delete Forever"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}