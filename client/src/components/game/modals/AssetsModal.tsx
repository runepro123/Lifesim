import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, DollarSign, TrendingUp, Gem, Hammer, Dice1, Building2, Car, MoreHorizontal, ChevronRight,
         Plane, Ship, Home, Diamond, Crown, Trophy, MapPin, Palette, Clock, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Character } from "@shared/schema";

interface AssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
}

export default function AssetsModal({ isOpen, onClose, character }: AssetsModalProps) {
  const [currentView, setCurrentView] = useState<string>("main");
  const { toast } = useToast();

  const purchaseMutation = useMutation({
    mutationFn: async ({ item, cost }: { item: string; cost: number }) => {
      const updatedBalance = character.bankBalance - cost;
      return apiRequest('PATCH', `/api/characters/${character.id}`, { bankBalance: updatedBalance });
    },
    onSuccess: () => {
      toast({
        title: "Purchase Successful!",
        description: "Your new asset has been added to your collection.",
      });
      onClose();
      window.location.reload();
    },
  });

  const purchaseItem = (itemName: string, cost: number) => {
    if (character.bankBalance < cost) {
      toast({
        title: "Insufficient Funds",
        description: `You need $${cost.toLocaleString()} to purchase this item.`,
        variant: "destructive",
      });
      return;
    }
    purchaseMutation.mutate({ item: itemName, cost });
  };

  const getDetailView = () => {
    switch (currentView) {
      case "luxury":
        return (
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-700 mb-3">Activities</h4>
              <div className="space-y-2">
                {[
                  { icon: Gift, name: "Charity Donation", description: "Buy yourself some karma", cost: 10000 },
                  { icon: Gem, name: "Luxury Spa", description: "Pamper yourself", cost: 5000 },
                  { icon: Crown, name: "Secret Societies", description: "Join a secret society", cost: 50000 },
                  { icon: Trophy, name: "VIP Events", description: "Rub elbows with the cream of the crop", cost: 25000 },
                ].map((activity) => (
                  <div key={activity.name} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <activity.icon className="text-amber-600 w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{activity.name}</div>
                        <div className="text-sm text-gray-500">{activity.description}</div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => purchaseItem(activity.name, activity.cost)}
                      disabled={character.age < 18 || purchaseMutation.isPending}
                    >
                      {character.age < 18 ? "Too Young" : "Do"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-700 mb-3">Shopping</h4>
              <div className="space-y-2">
                {[
                  { icon: Clock, name: "Curiosity Shop", description: "Purchase heirlooms", cost: 15000 },
                  { icon: MapPin, name: "Island Realtor", description: "Shop for islands", cost: 50000000 },
                  { icon: Plane, name: "Luxury Aircraft Brokerage", description: "Shop for custom aircraft", cost: 25000000 },
                  { icon: Ship, name: "Luxury Boat Dealership", description: "Shop for custom watercraft", cost: 10000000 },
                  { icon: Car, name: "Luxury Car Dealership", description: "Shop for custom cars", cost: 2000000 },
                  { icon: Diamond, name: "Upscale Jewelers", description: "Shop for luxury jewelry", cost: 500000 },
                ].map((item) => (
                  <button 
                    key={item.name} 
                    className="flex items-center justify-between p-3 bg-white rounded-lg border w-full hover:bg-gray-50"
                    onClick={() => purchaseItem(item.name, item.cost)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <item.icon className="text-blue-600 w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                        <div className="text-xs text-green-600">${item.cost.toLocaleString()}</div>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400 w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "casino":
        return (
          <div className="space-y-3">
            {[
              { icon: Dice1, name: "Gambling Den", description: "Purchase a gambling den", cost: 90000 },
              { icon: Building2, name: "Game Parlor", description: "Purchase a game parlor", cost: 272000 },
              { icon: Home, name: "Clubhouse", description: "Purchase a clubhouse", cost: 544000 },
              { icon: Building2, name: "Casino", description: "Purchase a casino", cost: 1360000 },
              { icon: Crown, name: "Luxury Casino", description: "Purchase a luxury casino", cost: 4536000 },
            ].map((casino) => (
              <div key={casino.name} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <casino.icon className="text-red-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{casino.name}</div>
                    <div className="text-sm text-gray-500">{casino.description}</div>
                    <div className="text-xs text-green-600">${casino.cost.toLocaleString()}</div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => purchaseItem(casino.name, casino.cost)}
                  disabled={character.age < 21 || purchaseMutation.isPending}
                >
                  {character.age < 21 ? "Too Young" : "Buy"}
                </Button>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (currentView !== "main") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden p-0">
          <DialogHeader className="p-4 border-b border-gray-200 bg-blue-500 text-white">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("main")}
                className="text-white hover:bg-blue-600 p-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <DialogTitle className="text-lg font-semibold text-white uppercase">
                {currentView === "casino" ? "Casinos" : currentView}
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
            {getDetailView()}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900">Assets</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-700 mb-3">Finances</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-yellow-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Finances</div>
                    <div className="text-sm text-gray-500">View your finances</div>
                  </div>
                </div>
                <MoreHorizontal className="text-gray-400 w-4 h-4" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-green-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Investments</div>
                    <div className="text-sm text-gray-500">Manage your investment portfolio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-700 mb-3">Premium Assets</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Hammer className="text-purple-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Auction Houses</div>
                    <div className="text-sm text-gray-500">Purchase rare collectibles</div>
                  </div>
                </div>
              </div>
              
              <button 
                className="flex items-center justify-between p-3 bg-white rounded-lg w-full border hover:bg-gray-50"
                onClick={() => setCurrentView("casino")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Dice1 className="text-red-600 w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Casino</div>
                    <div className="text-sm text-gray-500">Start your own casino</div>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 w-4 h-4" />
              </button>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Building2 className="text-amber-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Museum</div>
                    <div className="text-sm text-gray-500">Display your collectibles</div>
                  </div>
                </div>
                <MoreHorizontal className="text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>

          <button 
            className="bg-blue-50 rounded-lg p-3 w-full hover:bg-blue-100 transition-colors"
            onClick={() => setCurrentView("luxury")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Gem className="text-blue-600 w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-700">Luxury</h4>
                  <div className="text-sm text-gray-500">Enjoy the perks of being a VIP</div>
                </div>
              </div>
              <ChevronRight className="text-gray-400 w-4 h-4" />
            </div>
          </button>

          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-700 mb-3">Collectibles</h4>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Gem className="text-red-600 w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Belongings</div>
                  <div className="text-sm text-gray-500">View your possessions</div>
                </div>
              </div>
              <MoreHorizontal className="text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-700 mb-3">Vehicles</h4>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Car className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Subaru Impreza (Sedan)</div>
                  <div className="text-sm text-gray-500">Condition</div>
                  <Progress value={65} className="w-20 h-2 mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
