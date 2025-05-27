import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GameHeader from "@/components/game/GameHeader";
import StatsDisplay from "@/components/game/StatsDisplay";
import LifeEvents from "@/components/game/LifeEvents";
import MainNavigation from "@/components/game/MainNavigation";
import OccupationModal from "@/components/game/modals/OccupationModal";
import AssetsModal from "@/components/game/modals/AssetsModal";
import RelationshipsModal from "@/components/game/modals/RelationshipsModal";
import ActivitiesModal from "@/components/game/modals/ActivitiesModal";
import AgeUpModal from "@/components/game/modals/AgeUpModal";
import CharacterCreationModal from "@/components/game/modals/CharacterCreationModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Character } from "@shared/schema";

export default function Game() {
  const [currentCharacterId, setCurrentCharacterId] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const { data: character, isLoading, refetch } = useQuery<Character>({
    queryKey: [`/api/characters/${currentCharacterId}`],
    enabled: !!currentCharacterId,
  });

  const showModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleCharacterCreated = (characterId: number) => {
    setCurrentCharacterId(characterId);
    closeModal();
  };

  const handleAgeUp = () => {
    refetch();
    closeModal();
  };

  if (!currentCharacterId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to LifeSim</h1>
          <p className="text-gray-600 mb-8">Create a new character to start your life simulation journey!</p>
          <Button 
            onClick={() => showModal('characterCreation')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Start New Life
          </Button>
        </div>
        
        <CharacterCreationModal 
          isOpen={activeModal === 'characterCreation'} 
          onClose={closeModal}
          onCharacterCreated={handleCharacterCreated}
        />
      </div>
    );
  }

  if (isLoading || !character) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your life...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader character={character} />
      <StatsDisplay character={character} />
      <LifeEvents character={character} />
      <MainNavigation onNavigate={showModal} activeTab="job" />

      {/* Floating Action Button for New Life */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => showModal('characterCreation')}
          size="lg"
          className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Modals */}
      <OccupationModal 
        isOpen={activeModal === 'occupation'} 
        onClose={closeModal}
        character={character}
      />
      <AssetsModal 
        isOpen={activeModal === 'assets'} 
        onClose={closeModal}
        character={character}
      />
      <RelationshipsModal 
        isOpen={activeModal === 'relationships'} 
        onClose={closeModal}
        character={character}
      />
      <ActivitiesModal 
        isOpen={activeModal === 'activities'} 
        onClose={closeModal}
        character={character}
      />
      <AgeUpModal 
        isOpen={activeModal === 'ageUp'} 
        onClose={closeModal}
        character={character}
        onAgeUp={handleAgeUp}
      />
      <CharacterCreationModal 
        isOpen={activeModal === 'characterCreation'} 
        onClose={closeModal}
        onCharacterCreated={handleCharacterCreated}
      />
    </div>
  );
}
