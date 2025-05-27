import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, User, ChevronRight } from "lucide-react";
import type { Character, Relationship } from "@shared/schema";

interface RelationshipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
}

export default function RelationshipsModal({ isOpen, onClose, character }: RelationshipsModalProps) {
  const { data: relationships = [] } = useQuery<Relationship[]>({
    queryKey: [`/api/characters/${character.id}/relationships`],
    enabled: isOpen,
  });

  const groupedRelationships = relationships.reduce((acc, rel) => {
    if (!acc[rel.type]) acc[rel.type] = [];
    acc[rel.type].push(rel);
    return acc;
  }, {} as Record<string, Relationship[]>);

  const getRelationshipIcon = (type: string) => {
    return User;
  };

  const getRelationshipColor = (relationship: number) => {
    if (relationship >= 80) return "text-green-600 bg-green-100";
    if (relationship >= 60) return "text-blue-600 bg-blue-100";
    if (relationship >= 40) return "text-yellow-600 bg-yellow-100";
    if (relationship >= 20) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getRelationshipLabel = (type: string) => {
    const labels: Record<string, string> = {
      parent: "Parents",
      sibling: "Siblings",
      spouse: "Spouse",
      child: "Children",
      friend: "Friends"
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900">Relationships</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(80vh-160px)] p-4 space-y-4">
          {Object.entries(groupedRelationships).map(([type, rels]) => (
            <div key={type} className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-700 mb-3">{getRelationshipLabel(type)}</h4>
              <div className="space-y-2">
                {rels.map((rel) => {
                  const Icon = getRelationshipIcon(rel.type);
                  const colorClass = getRelationshipColor(rel.relationship);
                  
                  return (
                    <div key={rel.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{rel.name}</div>
                          <div className="text-sm text-gray-500">Relationship</div>
                          <Progress value={rel.relationship} className="w-24 h-2 mt-1" />
                        </div>
                      </div>
                      <ChevronRight className="text-gray-400 w-4 h-4" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {relationships.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No relationships yet. Start building connections!</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
            <Users className="w-4 h-4 mr-2" />
            Spend Time With All...
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
