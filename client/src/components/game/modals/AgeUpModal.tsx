import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cake } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Character } from "@shared/schema";

interface AgeUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onAgeUp: () => void;
}

export default function AgeUpModal({ isOpen, onClose, character, onAgeUp }: AgeUpModalProps) {
  const ageUpMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/characters/${character.id}/age-up`),
    onSuccess: () => {
      onAgeUp();
    },
  });

  const handleAgeUp = () => {
    ageUpMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cake className="text-green-600 w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Age Up</h3>
          <p className="text-gray-600 mb-6">
            Are you ready to advance to age {character.age + 1}?
          </p>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={onClose}
              disabled={ageUpMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-green-500 hover:bg-green-600" 
              onClick={handleAgeUp}
              disabled={ageUpMutation.isPending}
            >
              {ageUpMutation.isPending ? 'Aging...' : 'Age Up'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
