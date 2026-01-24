'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  CheckCircle, 
  UserX, 
  UserCheck, 
  MoreHorizontal, 
  Shield, 
  AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner';

interface UserActionsProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
    role: string;
  };
  onUserUpdate: (userId: string, updates: any) => void;
}

export function UserActions({ user, onUserUpdate }: UserActionsProps) {
  const [showDialog, setShowDialog] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: string, updates: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUserUpdate(user.id, updates);
      toast.success(`Action ${action} effectuée`);
      setShowDialog(null);
    } catch (error) {
      toast.error('Erreur lors de l\'action');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'PENDING':
        return <Badge className="bg-orange-100 text-orange-800">En attente</Badge>;
      case 'SUSPENDED':
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        {getStatusBadge(user.status)}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user.status === 'PENDING' && (
              <DropdownMenuItem onClick={() => setShowDialog('approve')}>
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Approuver
              </DropdownMenuItem>
            )}
            
            {user.status === 'ACTIVE' && (
              <DropdownMenuItem onClick={() => setShowDialog('suspend')}>
                <UserX className="h-4 w-4 mr-2 text-red-600" />
                Suspendre
              </DropdownMenuItem>
            )}
            
            {user.status === 'SUSPENDED' && (
              <DropdownMenuItem onClick={() => handleAction('réactivation', { status: 'ACTIVE' })}>
                <UserCheck className="h-4 w-4 mr-2 text-green-600" />
                Réactiver
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={() => setShowDialog('role')}>
              <Shield className="h-4 w-4 mr-2 text-blue-600" />
              Changer le rôle
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialogs */}
      <Dialog open={showDialog === 'approve'} onOpenChange={() => setShowDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approuver l'utilisateur</DialogTitle>
            <DialogDescription>
              Approuver {user.firstName} {user.lastName} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(null)}>Annuler</Button>
            <Button onClick={() => handleAction('approbation', { status: 'ACTIVE' })} disabled={isLoading}>
              Approuver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDialog === 'suspend'} onOpenChange={() => setShowDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Suspendre l'utilisateur
            </DialogTitle>
            <DialogDescription>
              Suspendre {user.firstName} {user.lastName} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(null)}>Annuler</Button>
            <Button variant="destructive" onClick={() => handleAction('suspension', { status: 'SUSPENDED' })} disabled={isLoading}>
              Suspendre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}