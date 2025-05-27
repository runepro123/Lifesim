import type { Character } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLocation } from "wouter";

interface GameHeaderProps {
  character: Character;
}

export default function GameHeader({ character }: GameHeaderProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { 
      style: 'currency', 
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{character.name}</h1>
              <p className="text-sm text-gray-500">Age: {character.age} years</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(character.bankBalance)}
            </div>
            <div className="text-xs text-gray-500">Bank Balance</div>
          </div>
        </div>
      </div>
    </header>
  );
}
