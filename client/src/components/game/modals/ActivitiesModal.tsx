import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, Heart, User, PawPrint, Bath, Gem, Dice1, VenetianMask, FlameKindling, ShieldCheck, ChevronRight, MoreHorizontal } from "lucide-react";
import type { Character } from "@shared/schema";

interface ActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
}

export default function ActivitiesModal({ isOpen, onClose, character }: ActivitiesModalProps) {
  const favoriteActivities = [
    { icon: Star, name: "Fame", description: "Manage your fame", color: "yellow" },
    { icon: Heart, name: "Love", description: "Find someone to love", color: "red" },
    { icon: User, name: "Mind & Body", description: "Work on self-improvement", color: "purple" },
    { icon: PawPrint, name: "Pets", description: "Get a pet", color: "orange", hasMore: true },
    { icon: Bath, name: "Salon & Bath", description: "Take time for yourself", color: "pink" },
  ];

  const premiumActivities = [
    { icon: Gem, name: "Luxury", description: "Enjoy the perks of being a VIP", color: "blue" },
    { icon: Dice1, name: "Casino", description: "Start your own casino", color: "red" },
    { icon: VenetianMask, name: "Black Market", description: "Shop for contraband", color: "gray" },
    { icon: FlameKindling, name: "Commune", description: "Start a cult", color: "orange" },
    { icon: ShieldCheck, name: "Secret Agent", description: "Start your own spy agency", color: "purple" },
  ];

  const getIconColors = (color: string) => {
    const colors: Record<string, string> = {
      yellow: "text-yellow-600 bg-yellow-100",
      red: "text-red-600 bg-red-100", 
      purple: "text-purple-600 bg-purple-100",
      orange: "text-orange-600 bg-orange-100",
      pink: "text-pink-600 bg-pink-100",
      blue: "text-blue-600 bg-blue-100",
      gray: "text-gray-600 bg-gray-100",
    };
    return colors[color] || "text-gray-600 bg-gray-100";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900">Activities</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-700 mb-3">Favorites</h4>
            <div className="space-y-2">
              {favoriteActivities.map((activity) => {
                const Icon = activity.icon;
                const colorClass = getIconColors(activity.color);
                
                return (
                  <div key={activity.name} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{activity.name}</div>
                        <div className="text-sm text-gray-500">{activity.description}</div>
                      </div>
                    </div>
                    {activity.hasMore ? (
                      <MoreHorizontal className="text-gray-400 w-4 h-4" />
                    ) : (
                      <ChevronRight className="text-gray-400 w-4 h-4" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-700 mb-3">Premium Activities</h4>
            <div className="space-y-2">
              {premiumActivities.map((activity) => {
                const Icon = activity.icon;
                const colorClass = getIconColors(activity.color);
                
                return (
                  <div key={activity.name} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{activity.name}</div>
                        <div className="text-sm text-gray-500">{activity.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400 w-4 h-4" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
