import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Tv, UserRoundCheck, Mic, Search, FileText, Shield, Clock, DollarSign, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Character, Career } from "@shared/schema";

interface OccupationModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
}

export default function OccupationModal({ isOpen, onClose, character }: OccupationModalProps) {
  const { toast } = useToast();
  const { data: careers = [] } = useQuery<Career[]>({
    queryKey: ['/api/careers'],
  });

  const jobMutation = useMutation({
    mutationFn: async ({ action, career }: { action: string; career?: Career }) => {
      if (action === 'apply' && career) {
        const updates = {
          currentJob: career.name,
          salary: career.baseSalary,
          workExperience: 0
        };
        return apiRequest('PATCH', `/api/characters/${character.id}`, updates);
      } else if (action === 'work') {
        const salaryBonus = Math.floor((character.salary || 50000) * 0.1);
        const updates = {
          bankBalance: character.bankBalance + salaryBonus,
          workExperience: (character.workExperience || 0) + 1,
          happiness: Math.max(0, Math.min(100, character.happiness + 5))
        };
        return apiRequest('PATCH', `/api/characters/${character.id}`, updates);
      } else if (action === 'freelance') {
        const payment = Math.floor(Math.random() * 1000) + 500;
        const updates = {
          bankBalance: character.bankBalance + payment,
          happiness: Math.max(0, Math.min(100, character.happiness + 3))
        };
        return apiRequest('PATCH', `/api/characters/${character.id}`, updates);
      } else if (action === 'military') {
        const militaryJobs = ['Army Soldier', 'Navy Sailor', 'Air Force Pilot', 'Marines Infantry'];
        const randomJob = militaryJobs[Math.floor(Math.random() * militaryJobs.length)];
        const updates = {
          currentJob: randomJob,
          salary: 35000 + Math.floor(Math.random() * 20000),
          workExperience: 0,
          health: Math.max(0, Math.min(100, character.health + 15)),
          happiness: Math.max(0, Math.min(100, character.happiness - 5))
        };
        return apiRequest('PATCH', `/api/characters/${character.id}`, updates);
      } else if (action === 'part-time') {
        const partTimeJobs = ['Cashier', 'Waiter', 'Delivery Driver', 'Store Associate', 'Coffee Barista'];
        const randomJob = partTimeJobs[Math.floor(Math.random() * partTimeJobs.length)];
        const updates = {
          currentJob: `Part-time ${randomJob}`,
          salary: 15000 + Math.floor(Math.random() * 10000),
          workExperience: 0,
          happiness: Math.max(0, Math.min(100, character.happiness + 3))
        };
        return apiRequest('PATCH', `/api/characters/${character.id}`, updates);
      } else if (action === 'recruiter') {
        // Job recruiter finds high-paying jobs
        const recruiterJobs = ['Marketing Manager', 'Sales Director', 'Project Manager', 'Business Analyst'];
        const randomJob = recruiterJobs[Math.floor(Math.random() * recruiterJobs.length)];
        const updates = {
          currentJob: randomJob,
          salary: 60000 + Math.floor(Math.random() * 40000),
          workExperience: 0,
          happiness: Math.max(0, Math.min(100, character.happiness + 10))
        };
        return apiRequest('PATCH', `/api/characters/${character.id}`, updates);
      }
    },
    onSuccess: (_, { action, career }) => {
      if (action === 'apply') {
        toast({
          title: "Job Application Successful!",
          description: `You are now working as a ${career?.name}.`,
        });
      } else if (action === 'work') {
        toast({
          title: "Work Complete!",
          description: "You earned money and gained experience.",
        });
      } else if (action === 'freelance') {
        toast({
          title: "Freelance Gig Complete!",
          description: "You earned some quick money.",
        });
      } else if (action === 'military') {
        toast({
          title: "Military Enlistment Successful!",
          description: "You've joined the military and got a job!",
        });
      } else if (action === 'part-time') {
        toast({
          title: "Part-time Job Found!",
          description: "You got a part-time job to earn some income.",
        });
      } else if (action === 'recruiter') {
        toast({
          title: "Job Recruiter Success!",
          description: "The recruiter found you a great position!",
        });
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    },
  });

  const getJobIcon = (jobName: string) => {
    if (jobName.includes('TV') || jobName.includes('Actor')) return Tv;
    if (jobName.includes('Engineer')) return FileText;
    if (jobName.includes('Doctor')) return Shield;
    if (jobName.includes('Police')) return Shield;
    return Briefcase;
  };

  const canApplyForJob = (career: Career) => {
    if (character.currentJob) return false; // Already has a job
    const meetsAge = character.age >= career.minAge;
    const requirements = career.requirements as Record<string, number> || {};
    
    const meetsRequirements = Object.entries(requirements).every(([stat, required]) => {
      const characterStat = character[stat as keyof Character] as number;
      return characterStat >= required;
    });

    return meetsAge && meetsRequirements;
  };

  const handleJobAction = (action: string, career?: Career) => {
    jobMutation.mutate({ action, career });
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
            
            <button 
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 w-full hover:bg-gray-50 transition-colors"
              onClick={() => handleJobAction('freelance')}
              disabled={jobMutation.isPending}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mic className="text-green-600 w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Freelance Gigs</div>
                  <div className="text-sm text-gray-500">Make some quick money</div>
                </div>
              </div>
              <DollarSign className="text-green-600 w-4 h-4" />
            </button>

            <button 
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 w-full hover:bg-gray-50 transition-colors"
              onClick={() => handleJobAction('recruiter')}
              disabled={character.currentJob || character.age < 21 || jobMutation.isPending}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="text-blue-600 w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Job Recruiter</div>
                  <div className="text-sm text-gray-500">Visit the job recruiter</div>
                  {character.age < 21 && <div className="text-xs text-red-500">Must be 21+</div>}
                  {character.currentJob && <div className="text-xs text-red-500">Already employed</div>}
                </div>
              </div>
              <Search className="text-blue-600 w-4 h-4" />
            </button>

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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleJobAction('apply', career)}
                        disabled={jobMutation.isPending}
                      >
                        Apply
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            <button 
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 w-full hover:bg-gray-50 transition-colors"
              onClick={() => handleJobAction('military')}
              disabled={character.currentJob || character.age < 18 || jobMutation.isPending}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="text-red-600 w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Military</div>
                  <div className="text-sm text-gray-500">Join the military</div>
                  {character.age < 18 && <div className="text-xs text-red-500">Must be 18+</div>}
                  {character.currentJob && <div className="text-xs text-red-500">Already employed</div>}
                </div>
              </div>
              <Shield className="text-red-600 w-4 h-4" />
            </button>

            <button 
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 w-full hover:bg-gray-50 transition-colors"
              onClick={() => handleJobAction('part-time')}
              disabled={character.currentJob || character.age < 16 || jobMutation.isPending}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-purple-600 w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Part-Time Jobs</div>
                  <div className="text-sm text-gray-500">Browse hourly job listings</div>
                  {character.age < 16 && <div className="text-xs text-red-500">Must be 16+</div>}
                  {character.currentJob && <div className="text-xs text-red-500">Already employed</div>}
                </div>
              </div>
              <Clock className="text-purple-600 w-4 h-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
