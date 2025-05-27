import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Gem, Hammer, Dice1, Building2, Car, MoreHorizontal } from "lucide-react";
import type { Character } from "@shared/schema";

interface AssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
}

export default function AssetsModal({ isOpen, onClose, character }: AssetsModalProps) {
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
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Dice1 className="text-red-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Casino</div>
                    <div className="text-sm text-gray-500">Start your own casino</div>
                  </div>
                </div>
              </div>

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
