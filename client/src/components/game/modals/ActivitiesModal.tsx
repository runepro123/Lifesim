import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Heart, User, PawPrint, Bath, Gem, Dice1, VenetianMask, FlameKindling, ShieldCheck, ChevronRight, MoreHorizontal, 
         Book, Camera, Tv, BookOpen, Dumbbell, Music, Library, Target, Brain, Brush, 
         Smartphone, Globe, Gift, Cat, Dog, ArrowRight, Sparkles, Trophy, 
         Scissors, Palette, Zap, Sun, Waves, Anchor, Paintbrush, Play, Video, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Character } from "@shared/schema";

interface ActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
}

export default function ActivitiesModal({ isOpen, onClose, character }: ActivitiesModalProps) {
  const [currentView, setCurrentView] = useState<string>("main");
  const { toast } = useToast();

  const activityMutation = useMutation({
    mutationFn: async ({ activity, effect }: { activity: string; effect: any }) => {
      const updatedStats = {
        happiness: Math.max(0, Math.min(100, character.happiness + (effect.happiness || 0))),
        health: Math.max(0, Math.min(100, character.health + (effect.health || 0))),
        smarts: Math.max(0, Math.min(100, character.smarts + (effect.smarts || 0))),
        looks: Math.max(0, Math.min(100, character.looks + (effect.looks || 0))),
        fame: Math.max(0, Math.min(100, character.fame + (effect.fame || 0))),
        bankBalance: Math.max(0, character.bankBalance + (effect.money || 0))
      };
      
      return apiRequest('PATCH', `/api/characters/${character.id}`, updatedStats);
    },
    onSuccess: () => {
      toast({
        title: "Activity Completed!",
        description: "Your stats have been updated.",
      });
      setCurrentView("main");
      setTimeout(() => {
        onClose();
      }, 1000);
    },
  });

  const performActivity = (activityName: string, effect: any, cost: number = 0) => {
    if (character.bankBalance < cost) {
      toast({
        title: "Insufficient Funds",
        description: `You need $${cost.toLocaleString()} to do this activity.`,
        variant: "destructive",
      });
      return;
    }

    const finalEffect = { ...effect, money: -cost };
    activityMutation.mutate({ activity: activityName, effect: finalEffect });
  };

  const favoriteActivities = [
    { 
      id: "social-media", 
      icon: Smartphone, 
      name: "Social Media", 
      description: "Build your online presence", 
      color: "blue",
      minAge: 13
    },
    { 
      id: "fame", 
      icon: Star, 
      name: "Fame", 
      description: "Manage your fame", 
      color: "yellow",
      minAge: 12
    },
    { 
      id: "love", 
      icon: Heart, 
      name: "Love", 
      description: "Find someone to love", 
      color: "red",
      minAge: 12
    },
    { 
      id: "mind-body", 
      icon: User, 
      name: "Mind & Body", 
      description: "Work on self-improvement", 
      color: "purple",
      minAge: 5
    },
    { 
      id: "pets", 
      icon: PawPrint, 
      name: "Pets", 
      description: "Get a pet", 
      color: "orange", 
      hasMore: true,
      minAge: 5
    },
    { 
      id: "salon", 
      icon: Bath, 
      name: "Salon & Spa", 
      description: "Take time for yourself", 
      color: "pink",
      minAge: 12
    },
  ];

  const premiumActivities = [
    { 
      id: "luxury", 
      icon: Gem, 
      name: "Luxury", 
      description: "Enjoy the perks of being a VIP", 
      color: "blue",
      minAge: 18
    },
    { 
      id: "casino", 
      icon: Dice1, 
      name: "Casino", 
      description: "Start your own casino", 
      color: "red",
      minAge: 21
    },
    { 
      id: "black-market", 
      icon: VenetianMask, 
      name: "Black Market", 
      description: "Shop for contraband", 
      color: "gray",
      minAge: 18
    },
    { 
      id: "commune", 
      icon: FlameKindling, 
      name: "Commune", 
      description: "Start a cult", 
      color: "orange",
      minAge: 25
    },
    { 
      id: "secret-agent", 
      icon: ShieldCheck, 
      name: "Secret Agent", 
      description: "Start your own spy agency", 
      color: "purple",
      minAge: 25
    },
  ];

  const calculateSocialMediaGrowth = (platform: string, currentFollowers: number, talent: string) => {
    const baseFame = character.fame || 0;
    const isNormal = talent === "normal";
    const isFamous = talent === "famous";
    
    let baseGrowth = 0;
    let fameBonus = 0;
    let talentMultiplier = 1;
    
    if (platform === "youtube") {
      baseGrowth = Math.floor(Math.random() * 50) + 10; // 10-60 base
      fameBonus = Math.floor(baseFame * 0.5);
      talentMultiplier = isFamous ? 3 : isNormal ? 1 : 1.5;
    } else if (platform === "tiktok") {
      baseGrowth = Math.floor(Math.random() * 200) + 50; // 50-250 base  
      fameBonus = Math.floor(baseFame * 0.3);
      talentMultiplier = isFamous ? 2.5 : isNormal ? 1 : 1.3;
    }
    
    // Growth gets easier with more followers
    const followerBonus = Math.floor(currentFollowers * 0.001);
    
    return Math.floor((baseGrowth + fameBonus + followerBonus) * talentMultiplier);
  };

  const getDetailView = () => {
    switch (currentView) {
      case "social-media":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <h5 className="font-medium text-gray-700">Content Platforms</h5>
              
              {/* YouTube */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Play className="text-red-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">YouTube</div>
                    <div className="text-sm text-gray-500">
                      Subscribers: {(character.youtubeFollowers || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Create videos, build audience</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!character.youtubeFollowers ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => performActivity("Sign up for YouTube", { youtubeFollowers: 0 })}
                      disabled={character.age < 13 || activityMutation.isPending}
                    >
                      Sign Up
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => {
                        const growth = calculateSocialMediaGrowth("youtube", character.youtubeFollowers || 0, character.talent || "normal");
                        const moneyEarned = Math.floor(growth * 0.5);
                        performActivity("Create YouTube Video", { 
                          youtubeFollowers: growth, 
                          fame: Math.floor(growth * 0.1),
                          money: moneyEarned,
                          happiness: 8
                        });
                      }}
                      disabled={character.age < 13 || activityMutation.isPending}
                    >
                      Create Video
                    </Button>
                  )}
                </div>
              </div>

              {/* TikTok */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-black">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    <Video className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">TikTok</div>
                    <div className="text-sm text-gray-500">
                      Followers: {(character.tiktokFollowers || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Make short videos, go viral</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!character.tiktokFollowers ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => performActivity("Sign up for TikTok", { tiktokFollowers: 0 })}
                      disabled={character.age < 13 || activityMutation.isPending}
                    >
                      Sign Up
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => {
                        const growth = calculateSocialMediaGrowth("tiktok", character.tiktokFollowers || 0, character.talent || "normal");
                        const moneyEarned = Math.floor(growth * 0.3);
                        performActivity("Create TikTok", { 
                          tiktokFollowers: growth, 
                          fame: Math.floor(growth * 0.05),
                          money: moneyEarned,
                          happiness: 5
                        });
                      }}
                      disabled={character.age < 13 || activityMutation.isPending}
                    >
                      Post Video
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-medium text-gray-700">Coming Soon</h5>
              
              {/* Twitch */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="text-purple-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Twitch</div>
                    <div className="text-sm text-gray-500">Live streaming platform</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>

              {/* Instagram */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Camera className="text-pink-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Instagram</div>
                    <div className="text-sm text-gray-500">Share photos and videos</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        );

      case "fame":
        return (
          <div className="space-y-3">
            {[
              { icon: Book, name: "Book", description: "Write a book", cost: 500, effect: { fame: 15, smarts: 5 } },
              { icon: Camera, name: "Commercial", description: "Do a TV commercial", cost: 0, effect: { fame: 10, money: 5000 } },
              { icon: Camera, name: "Photo Shoot", description: "Pose for a magazine", cost: 0, effect: { fame: 8, looks: 3 } },
              { icon: Tv, name: "Talk Show", description: "Go on a talk show", cost: 0, effect: { fame: 12, happiness: 5 } },
            ].map((activity) => (
              <div key={activity.name} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <activity.icon className="text-yellow-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.name}</div>
                    <div className="text-sm text-gray-500">{activity.description}</div>
                    {activity.cost > 0 && <div className="text-xs text-green-600">${activity.cost.toLocaleString()}</div>}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => performActivity(activity.name, activity.effect, activity.cost)}
                  disabled={character.age < 12 || activityMutation.isPending}
                >
                  {character.age < 12 ? "Too Young" : "Do"}
                </Button>
              </div>
            ))}
          </div>
        );

      case "love":
        return (
          <div className="space-y-3">
            {[
              { icon: Star, name: "Celebrity Dating App", description: "Date the celebrity of your dreams", cost: 1000, effect: { happiness: 20, fame: 5 } },
              { icon: Heart, name: "Date", description: "Find a date", cost: 100, effect: { happiness: 15 } },
              { icon: Smartphone, name: "Dating App", description: "Find love on the dating app", cost: 50, effect: { happiness: 10 } },
              { icon: Globe, name: "Gay Dating App", description: "Find your ideal LGBTQ lover", cost: 50, effect: { happiness: 12 } },
              { icon: Heart, name: "Hook Up", description: "Find a one night stand", cost: 0, effect: { happiness: 8, health: -2 } },
              { icon: Gift, name: "Mail-Order Bride", description: "Order the bride of your dreams", cost: 5000, effect: { happiness: 25 } },
            ].filter(activity => character.age >= 16 || activity.name === "Date").map((activity) => (
              <div key={activity.name} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <activity.icon className="text-red-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.name}</div>
                    <div className="text-sm text-gray-500">{activity.description}</div>
                    {activity.cost > 0 && <div className="text-xs text-green-600">${activity.cost.toLocaleString()}</div>}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => performActivity(activity.name, activity.effect, activity.cost)}
                  disabled={character.age < 12 || activityMutation.isPending}
                >
                  Do
                </Button>
              </div>
            ))}
          </div>
        );

      case "mind-body":
        return (
          <div className="space-y-3">
            {[
              { icon: Target, name: "Acting Lessons", description: "Skill", cost: 200, effect: { looks: 5, smarts: 3 } },
              { icon: BookOpen, name: "Book", description: "Find a good book", cost: 30, effect: { smarts: 8, happiness: 5 } },
              { icon: Palette, name: "Diet", description: "Go on a diet", cost: 100, effect: { health: 10, looks: 8 } },
              { icon: Dumbbell, name: "Gym", description: "Work out at the gym", cost: 50, effect: { health: 12, looks: 8 } },
              { icon: Music, name: "Instruments", description: "Practice an instrument", cost: 300, effect: { smarts: 5, happiness: 8 } },
              { icon: Library, name: "Library", description: "Visit the public library", cost: 0, effect: { smarts: 10, happiness: 3 } },
              { icon: Target, name: "Martial Arts", description: "Practice a martial art", cost: 150, effect: { health: 15, smarts: 5 } },
              { icon: Brain, name: "Meditate", description: "Practice meditation", cost: 0, effect: { happiness: 12, health: 5 } },
              { icon: Brain, name: "Memory Test", description: "Have your memory evaluated", cost: 100, effect: { smarts: 8 } },
              { icon: Brush, name: "Modeling Lessons", description: "Learn to model", cost: 250, effect: { looks: 12, fame: 3 } },
            ].map((activity) => (
              <div key={activity.name} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <activity.icon className="text-purple-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.name}</div>
                    <div className="text-sm text-gray-500">{activity.description}</div>
                    {activity.cost > 0 && <div className="text-xs text-green-600">${activity.cost.toLocaleString()}</div>}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => performActivity(activity.name, activity.effect, activity.cost)}
                  disabled={activityMutation.isPending}
                >
                  Do
                </Button>
              </div>
            ))}
          </div>
        );

      case "pets":
        return (
          <div className="space-y-3">
            {[
              { icon: PawPrint, name: "Animal Shelter", description: "Rescue an animal in need", cost: 100, effect: { happiness: 15 } },
              { icon: Cat, name: "Cat Breeders", description: "Buy a pure bred cat", cost: 800, effect: { happiness: 20 } },
              { icon: Dog, name: "Dog Breeders", description: "Buy a pure bred dog", cost: 1200, effect: { happiness: 25 } },
              { icon: Target, name: "Exotic Pet Dealer", description: "Look for an exotic pet", cost: 2000, effect: { happiness: 30, fame: 5 } },
              { icon: PawPrint, name: "Pet Store", description: "Visit the pet store", cost: 300, effect: { happiness: 18 } },
            ].map((activity) => (
              <div key={activity.name} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <activity.icon className="text-orange-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.name}</div>
                    <div className="text-sm text-gray-500">{activity.description}</div>
                    <div className="text-xs text-green-600">${activity.cost.toLocaleString()}</div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => performActivity(activity.name, activity.effect, activity.cost)}
                  disabled={activityMutation.isPending}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        );

      case "salon":
        return (
          <div className="space-y-3">
            {[
              { icon: Scissors, name: "Barber", description: "Customize your hairstyle", cost: 50, effect: { looks: 8, happiness: 5 } },
              { icon: Palette, name: "Dye Job", description: "Customize your hair color", cost: 80, effect: { looks: 6, happiness: 8 } },
              { icon: Sparkles, name: "Massage", description: "Get a massage", cost: 120, effect: { happiness: 15, health: 8 } },
              { icon: Paintbrush, name: "Nail Salon", description: "Get your nails done", cost: 40, effect: { looks: 5, happiness: 8 } },
              { icon: Scissors, name: "Shave", description: "Customize your facial hair", cost: 30, effect: { looks: 4, happiness: 3 } },
              { icon: Sun, name: "Tanning Salon", description: "Work on your tan", cost: 60, effect: { looks: 10, happiness: 5 } },
              { icon: Waves, name: "Waxing Salon", description: "Get waxed", cost: 100, effect: { looks: 12, happiness: -5 } },
            ].map((activity) => (
              <div key={activity.name} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <activity.icon className="text-pink-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.name}</div>
                    <div className="text-sm text-gray-500">{activity.description}</div>
                    <div className="text-xs text-green-600">${activity.cost.toLocaleString()}</div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => performActivity(activity.name, activity.effect, activity.cost)}
                  disabled={character.age < 12 || activityMutation.isPending}
                >
                  Do
                </Button>
              </div>
            ))}
          </div>
        );

      case "black-market":
        return (
          <div className="space-y-3">
            {[
              { icon: Anchor, name: "Antique Peddler", description: "Purchase stolen antiques", cost: 5000, effect: { happiness: 10, fame: 2 } },
              { icon: Target, name: "Arms Dealer", description: "Purchase weapons", cost: 8000, effect: { happiness: 5 } },
              { icon: Paintbrush, name: "Art Thief", description: "Purchase stolen art", cost: 15000, effect: { happiness: 15, fame: 5 } },
              { icon: Trophy, name: "Jewel Fencer", description: "Purchase stolen jewels", cost: 12000, effect: { happiness: 20, looks: 8 } },
              { icon: Zap, name: "Street Chemist", description: "Purchase illegal substances", cost: 2000, effect: { happiness: 25, health: -15 } },
              { icon: PawPrint, name: "Wildlife Smuggler", description: "Purchase unconventional pets", cost: 10000, effect: { happiness: 30 } },
            ].map((activity) => (
              <div key={activity.name} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <activity.icon className="text-gray-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.name}</div>
                    <div className="text-sm text-gray-500">{activity.description}</div>
                    <div className="text-xs text-green-600">${activity.cost.toLocaleString()}</div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => performActivity(activity.name, activity.effect, activity.cost)}
                  disabled={character.age < 18 || activityMutation.isPending}
                >
                  {character.age < 18 ? "Too Young" : "Buy"}
                </Button>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

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

  const canAccessActivity = (activity: any) => {
    return character.age >= activity.minAge;
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
                {currentView.replace("-", " & ")}
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
          <DialogTitle className="text-lg font-semibold text-gray-900">Activities</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-700 mb-3">Favorites</h4>
            <div className="space-y-2">
              {favoriteActivities.map((activity) => {
                const Icon = activity.icon;
                const colorClass = getIconColors(activity.color);
                const canAccess = canAccessActivity(activity);
                
                return (
                  <button 
                    key={activity.name} 
                    className={`flex items-center justify-between p-3 bg-white rounded-lg w-full border transition-colors hover:bg-gray-50 ${!canAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => canAccess && setCurrentView(activity.id)}
                    disabled={!canAccess}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{activity.name}</div>
                        <div className="text-sm text-gray-500">{activity.description}</div>
                        {!canAccess && <div className="text-xs text-red-500">Age {activity.minAge}+ required</div>}
                      </div>
                    </div>
                    {activity.hasMore ? (
                      <MoreHorizontal className="text-gray-400 w-4 h-4" />
                    ) : (
                      <ChevronRight className="text-gray-400 w-4 h-4" />
                    )}
                  </button>
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
                const canAccess = canAccessActivity(activity);
                
                return (
                  <button 
                    key={activity.name} 
                    className={`flex items-center justify-between p-3 bg-white rounded-lg w-full border transition-colors hover:bg-gray-50 ${!canAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => canAccess && setCurrentView(activity.id)}
                    disabled={!canAccess}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{activity.name}</div>
                        <div className="text-sm text-gray-500">{activity.description}</div>
                        {!canAccess && <div className="text-xs text-red-500">Age {activity.minAge}+ required</div>}
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400 w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
