import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Plus, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SaveCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCodeAuthenticated: (code: string) => void;
}

export default function SaveCodeModal({ isOpen, onClose, onCodeAuthenticated }: SaveCodeModalProps) {
  const [mode, setMode] = useState<'choose' | 'create' | 'enter'>('choose');
  const [code, setCode] = useState('');
  const { toast } = useToast();

  const createCodeMutation = useMutation({
    mutationFn: (code: string) => apiRequest('POST', '/api/save-codes', { code }),
    onSuccess: () => {
      toast({
        title: "Save Code Created",
        description: `Your save code ${code} has been created successfully!`,
      });
      onCodeAuthenticated(code);
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create save code. It might already exist.",
        variant: "destructive",
      });
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: (code: string) => apiRequest('GET', `/api/save-codes/${code}`),
    onSuccess: () => {
      toast({
        title: "Code Verified",
        description: "Successfully logged in with your save code!",
      });
      onCodeAuthenticated(code);
      onClose();
    },
    onError: () => {
      toast({
        title: "Invalid Code",
        description: "The save code you entered doesn't exist.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (code.length !== 4 || !/^\d{4}$/.test(code)) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 4-digit number code.",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'create') {
      createCodeMutation.mutate(code);
    } else if (mode === 'enter') {
      verifyCodeMutation.mutate(code);
    }
  };

  const resetModal = () => {
    setMode('choose');
    setCode('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Save Code Authentication
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {mode === 'choose' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                To save your progress, you need a 4-digit save code. You can create a new one or enter an existing code.
              </p>
              
              <div className="grid gap-3">
                <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setMode('create')}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Plus className="w-4 h-4 text-green-600" />
                      Create New Save Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Generate a new 4-digit code to save your games
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setMode('enter')}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <LogIn className="w-4 h-4 text-blue-600" />
                      Enter Existing Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Use your existing save code to access your games
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {(mode === 'create' || mode === 'enter') && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">
                  {mode === 'create' ? 'Create Your 4-Digit Save Code' : 'Enter Your Save Code'}
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="0000"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setCode(value);
                  }}
                  className="text-center text-lg tracking-widest"
                  maxLength={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {mode === 'create' 
                    ? 'Choose a 4-digit code you can remember'
                    : 'Enter the 4-digit code you created before'
                  }
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setMode('choose')} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={code.length !== 4 || createCodeMutation.isPending || verifyCodeMutation.isPending}
                  className="flex-1"
                >
                  {createCodeMutation.isPending || verifyCodeMutation.isPending 
                    ? 'Processing...' 
                    : mode === 'create' ? 'Create Code' : 'Verify Code'
                  }
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}