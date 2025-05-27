import { Briefcase, Coins, Plus, Heart, Gamepad2 } from "lucide-react";

interface MainNavigationProps {
  onNavigate: (section: string) => void;
  activeTab: string;
}

export default function MainNavigation({ onNavigate, activeTab }: MainNavigationProps) {
  const navItems = [
    { id: "occupation", icon: Briefcase, label: "Job", color: "blue" },
    { id: "assets", icon: Coins, label: "Assets", color: "gray" },
    { id: "ageUp", icon: Plus, label: "Age", color: "green", special: true },
    { id: "relationships", icon: Heart, label: "Relationships", color: "gray" },
    { id: "activities", icon: Gamepad2, label: "Activities", color: "gray" },
  ];

  return (
    <div className="max-w-md mx-auto bg-white">
      <div className="flex border-t border-gray-200">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 py-3 px-1 text-center ${
                isActive 
                  ? `bg-${item.color}-50 border-t-2 border-${item.color}-500` 
                  : 'hover:bg-gray-50'
              } ${item.special ? 'relative' : ''}`}
            >
              {item.special ? (
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Icon className="text-white w-5 h-5" />
                </div>
              ) : (
                <Icon 
                  className={`${
                    isActive ? `text-${item.color}-600` : 'text-gray-500'
                  } w-5 h-5 mx-auto mb-1`} 
                />
              )}
              <span 
                className={`text-xs font-medium ${
                  isActive ? `text-${item.color}-600` : 'text-gray-500'
                } ${item.special ? 'text-green-600' : ''}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
