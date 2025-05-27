import { Smile, Heart, Brain, Eye, Star } from "lucide-react";
import type { Character } from "@shared/schema";

interface StatsDisplayProps {
  character: Character;
}

export default function StatsDisplay({ character }: StatsDisplayProps) {
  const stats = [
    { 
      name: "Happiness", 
      value: character.happiness, 
      icon: Smile, 
      color: "green",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      barColor: "bg-green-500"
    },
    { 
      name: "Health", 
      value: character.health, 
      icon: Heart, 
      color: "red",
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      barColor: "bg-green-500"
    },
    { 
      name: "Smarts", 
      value: character.smarts, 
      icon: Brain, 
      color: "blue",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      barColor: "bg-green-500"
    },
    { 
      name: "Looks", 
      value: character.looks, 
      icon: Eye, 
      color: "orange",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      barColor: "bg-green-500"
    },
    { 
      name: "Fame", 
      value: character.fame, 
      icon: Star, 
      color: "yellow",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      barColor: "bg-yellow-500"
    },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-4 bg-white">
      <div className="grid grid-cols-5 gap-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="text-center">
              <div className={`w-12 h-12 mx-auto mb-2 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                <Icon className={`${stat.iconColor} w-5 h-5`} />
              </div>
              <div className="text-xs font-medium text-gray-700">{stat.name}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`${stat.barColor} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${Math.max(0, Math.min(100, stat.value))}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{Math.round(stat.value)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
