import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Tv, UserRoundCheck, Mic, Search, FileText, Shield, Clock } from "lucide-react";
import type { Character, Career } from "@shared/schema";

interface OccupationModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
}

export default function OccupationModal({ isOpen, onClose, character }: OccupationModalProps) {
  const { data: careers = [] } = useQuery<Career[]>({
    queryKey: ['/api/careers'],
  });

  const getJobIcon = (jobName: string) => {
    if (jobName.includes('TV') || jobName.includes('Actor')) return Tv;
    if (jobName.includes('Engineer')) return FileText;
    if (jobName.includes('Doctor')) return Shield;
    if (jobName.includes('Police')) return Shield;
    return Briefcase;
  };

  const canApplyForJob = (career: Career) => {
    const meetsAge = character.age >= career.minAge;
    const requirements = career.requirements as Record<string, number> || {};
    
    const meetsRequirements = Object.entries(requirements).every(([stat, required]) => {
      const characterStat = character[stat as keyof Character] as number;
      return characterStat >= required;
    });

    return meetsAge && meetsRequirements;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900">Occupation</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
          {character.currentJob && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Current Job</h4>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Tv className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{character.currentJob}</div>
                    <div className="text-sm text-gray-500">Reputation</div>
                    <Progress value={character.jobReputation || 0} className="w-24 h-2 mt-1" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Career Options</h4>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mic className="text-green-600 w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Freelance Gigs</div>
                  <div className="text-sm text-gray-500">Make some quick money</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Job Recruiter</div>
                  <div className="text-sm text-gray-500">Visit the job recruiter</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <h5 className="font-medium text-gray-700">Available Jobs</h5>
              {careers.map((career) => {
                const Icon = getJobIcon(career.name);
                const eligible = canApplyForJob(career);
                
                return (
                  <div key={career.id} className={`flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 ${!eligible ? 'opacity-50' : ''}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Icon className="text-yellow-600 w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{career.name}</div>
                        <div className="text-sm text-gray-500">
                          Salary: ${career.baseSalary.toLocaleString()}/year
                        </div>
                        {!eligible && (
                          <div className="text-xs text-red-500">Requirements not met</div>
                        )}
                      </div>
                    </div>
                    {eligible && (
                      <Button variant="outline" size="sm">Apply</Button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="text-red-600 w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Military</div>
                  <div className="text-sm text-gray-500">Join the military</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-purple-600 w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Part-Time Jobs</div>
                  <div className="text-sm text-gray-500">Browse hourly job listings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
