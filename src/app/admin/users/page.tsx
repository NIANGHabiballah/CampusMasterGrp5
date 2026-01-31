'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Shield, 
  ShieldAlert,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  UserCheck,
  UserX
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { apiService } from '@/services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  studentId?: string;
  department?: string;
  semester?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export default function AdminUsersPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'STUDENT' as const,
    status: 'ACTIVE' as const
  });

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    try {
      await apiService.updateUser(selectedUser.id, editForm);
      
      // Mettre à jour l'utilisateur dans la liste
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? { ...u, ...editForm } : u
      ));
      
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      toast.success('Utilisateur modifié avec succès');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  // Initialiser le formulaire d'édition quand un utilisateur est sélectionné
  useEffect(() => {
    if (selectedUser) {
      setEditForm({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        role: selectedUser.role,
        status: selectedUser.status
      });
    }
  }, [selectedUser]);
  
  // New user form
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'STUDENT' as const,
    filiere: '',
    studentId: '',
    phone: ''
  });

  // Charger les utilisateurs depuis l'API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await apiService.getUsers();
        const formattedUsers = data.map((u: any) => ({
          id: u.id.toString(),
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          role: u.role,
          status: u.status,
          createdAt: u.createdAt || new Date().toISOString(),
          lastLogin: u.updatedAt
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        toast.error('Erreur lors du chargement des utilisateurs');
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  const handleApproveUser = async (userId: string) => {
    try {
      await apiService.updateUser(userId, { status: 'ACTIVE' });
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: 'ACTIVE' as const } : u
      ));
      toast.success('Utilisateur approuvé');
    } catch (error) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      await apiService.updateUser(userId, { status: 'SUSPENDED' });
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: 'SUSPENDED' as const } : u
      ));
      toast.success('Utilisateur suspendu');
    } catch (error) {
      toast.error('Erreur lors de la suspension');
    }
  };

  const handleReactivateUser = async (userId: string) => {
    try {
      await apiService.updateUser(userId, { status: 'ACTIVE' });
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: 'ACTIVE' as const } : u
      ));
      toast.success('Utilisateur réactivé');
    } catch (error) {
      toast.error('Erreur lors de la réactivation');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await apiService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('Utilisateur supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const userData = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        password: 'password123' // Mot de passe par défaut
      };
      
      await apiService.register(userData);
      
      // Recharger la liste des utilisateurs
      const data = await apiService.getUsers();
      const formattedUsers = data.map((u: any) => ({
        id: u.id.toString(),
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt || new Date().toISOString(),
        lastLogin: u.updatedAt
      }));
      setUsers(formattedUsers);
      
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        role: 'STUDENT',
        filiere: '',
        studentId: '',
        phone: ''
      });
      setIsCreateDialogOpen(false);
      toast.success('Utilisateur créé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création de l\'utilisateur');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.studentId && user.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'SUSPENDED':
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case 'TEACHER':
        return <Badge className="bg-blue-100 text-blue-800">Enseignant</Badge>;
      case 'STUDENT':
        return <Badge className="bg-gray-100 text-gray-800">Étudiant</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const pendingUsers = users.filter(u => u.status === 'PENDING');
  const activeUsers = users.filter(u => u.status === 'ACTIVE');
  const suspendedUsers = users.filter(u => u.status === 'SUSPENDED');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-600 mt-1">Gérez les comptes utilisateurs de la plateforme</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Ajoutez un nouvel utilisateur à la plateforme
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    placeholder="Prénom"
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    placeholder="Nom de famille"
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="email@campus.fr"
                  className="bg-white border-gray-300"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select value={newUser.role} onValueChange={(value: any) => setNewUser({...newUser, role: value})}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="STUDENT">Étudiant</SelectItem>
                      <SelectItem value="TEACHER">Enseignant</SelectItem>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filiere">Filière</Label>
                  <Select value={newUser.filiere} onValueChange={(value) => setNewUser({...newUser, filiere: value})}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Sélectionner une filière" />
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-40 overflow-y-auto">
                      <SelectItem value="IL">🟣 Ingénierie Logicielle</SelectItem>
                      <SelectItem value="IA">🟣 Intelligence Artificielle</SelectItem>
                      <SelectItem value="ANG">🔵 Anglais</SelectItem>
                      <SelectItem value="SCE">🔵 Sciences Éducation</SelectItem>
                      <SelectItem value="SOC">🔵 Sociologie</SelectItem>
                      <SelectItem value="ACG">🟢 Audit & Contrôle</SelectItem>
                      <SelectItem value="DPAP">🟢 Droit Public Admin</SelectItem>
                      <SelectItem value="DPIP">🟢 Droit International</SelectItem>
                      <SelectItem value="DPR">🟢 Droit Privé</SelectItem>
                      <SelectItem value="FC">🟢 Finance-Compta</SelectItem>
                      <SelectItem value="EEDD">🟢 Éco. Environnement</SelectItem>
                      <SelectItem value="MGRH">🟢 Management RH</SelectItem>
                      <SelectItem value="MCTDL">🟢 Management Collectivités</SelectItem>
                      <SelectItem value="PSD">🟢 Paix & Sécurité</SelectItem>
                      <SelectItem value="BDA">🟣 Big Data</SelectItem>
                      <SelectItem value="CS">🟣 Cybersécurité</SelectItem>
                      <SelectItem value="MMASN">🟣 Modélisation Math</SelectItem>
                      <SelectItem value="MCS">🟣 Calcul Scientifique</SelectItem>
                      <SelectItem value="SRIV">🟣 Systèmes & Réseaux</SelectItem>
                      <SelectItem value="ROB">🟣 Robotique</SelectItem>
                      <SelectItem value="RCC">🟣 Cinématographie</SelectItem>
                      <SelectItem value="MISAAN">🟣 Agro-Alimentaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {newUser.role === 'STUDENT' && (
                <div className="space-y-2">
                  <Label htmlFor="studentId">Numéro étudiant</Label>
                  <Input
                    id="studentId"
                    value={newUser.studentId}
                    onChange={(e) => setNewUser({...newUser, studentId: e.target.value})}
                    placeholder="M2-2024-XXX"
                    className="bg-white border-gray-300"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone (optionnel)</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  placeholder="+33 1 23 45 67 89"
                  className="bg-white border-gray-300"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateUser} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Créer l'utilisateur
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Tous statuts confondus</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers.length}</div>
            <p className="text-xs text-muted-foreground">Comptes validés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingUsers.length}</div>
            <p className="text-xs text-muted-foreground">Approbation requise</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspendus</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{suspendedUsers.length}</div>
            <p className="text-xs text-muted-foreground">Comptes désactivés</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, email ou numéro étudiant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="STUDENT">Étudiants</SelectItem>
                <SelectItem value="TEACHER">Enseignants</SelectItem>
                <SelectItem value="ADMIN">Administrateurs</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="ACTIVE">Actifs</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="SUSPENDED">Suspendus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-500">Chargement des utilisateurs...</div>
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.firstName[0]}{user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        {user.studentId && (
                          <div className="text-xs text-gray-400">
                            {user.studentId}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    {user.lastLogin ? (
                      <span className="text-sm">
                        {format(new Date(user.lastLogin), 'dd MMM yyyy', { locale: fr })}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Jamais</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {user.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproveUser(user.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      {user.status === 'ACTIVE' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuspendUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {user.status === 'SUSPENDED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReactivateUser(user.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Modifier l'utilisateur</DialogTitle>
              <DialogDescription>
                Modifiez les informations de {selectedUser.firstName} {selectedUser.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">Prénom</Label>
                  <Input
                    id="editFirstName"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLastName">Nom</Label>
                  <Input
                    id="editLastName"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="bg-white border-gray-300"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editRole">Rôle</Label>
                  <Select value={editForm.role} onValueChange={(value: any) => setEditForm({...editForm, role: value})}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="STUDENT">Étudiant</SelectItem>
                      <SelectItem value="TEACHER">Enseignant</SelectItem>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStatus">Statut</Label>
                  <Select value={editForm.status} onValueChange={(value: any) => setEditForm({...editForm, status: value})}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="ACTIVE">Actif</SelectItem>
                      <SelectItem value="PENDING">En attente</SelectItem>
                      <SelectItem value="SUSPENDED">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editFiliere">Filière</Label>
                <Select defaultValue={selectedUser.department}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Sélectionner une filière" />
                  </SelectTrigger>
                  <SelectContent className="bg-white max-h-40 overflow-y-auto">
                    <SelectItem value="IL">🟣 Ingénierie Logicielle</SelectItem>
                    <SelectItem value="IA">🟣 Intelligence Artificielle</SelectItem>
                    <SelectItem value="ANG">🔵 Anglais</SelectItem>
                    <SelectItem value="SCE">🔵 Sciences Éducation</SelectItem>
                    <SelectItem value="SOC">🔵 Sociologie</SelectItem>
                    <SelectItem value="ACG">🟢 Audit & Contrôle</SelectItem>
                    <SelectItem value="DPAP">🟢 Droit Public Admin</SelectItem>
                    <SelectItem value="DPIP">🟢 Droit International</SelectItem>
                    <SelectItem value="DPR">🟢 Droit Privé</SelectItem>
                    <SelectItem value="FC">🟢 Finance-Compta</SelectItem>
                    <SelectItem value="EEDD">🟢 Éco. Environnement</SelectItem>
                    <SelectItem value="MGRH">🟢 Management RH</SelectItem>
                    <SelectItem value="MCTDL">🟢 Management Collectivités</SelectItem>
                    <SelectItem value="PSD">🟢 Paix & Sécurité</SelectItem>
                    <SelectItem value="BDA">🟣 Big Data</SelectItem>
                    <SelectItem value="CS">🟣 Cybersécurité</SelectItem>
                    <SelectItem value="MMASN">🟣 Modélisation Math</SelectItem>
                    <SelectItem value="MCS">🟣 Calcul Scientifique</SelectItem>
                    <SelectItem value="SRIV">🟣 Systèmes & Réseaux</SelectItem>
                    <SelectItem value="ROB">🟣 Robotique</SelectItem>
                    <SelectItem value="RCC">🟣 Cinématographie</SelectItem>
                    <SelectItem value="MISAAN">🟣 Agro-Alimentaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedUser.role === 'STUDENT' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editStudentId">Numéro étudiant</Label>
                    <Input
                      id="editStudentId"
                      defaultValue={selectedUser.studentId}
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editSemester">Semestre</Label>
                    <Input
                      id="editSemester"
                      defaultValue={selectedUser.semester}
                      placeholder="S1 2024"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="editPhone">Téléphone</Label>
                <Input
                  id="editPhone"
                  defaultValue={selectedUser.phone}
                  placeholder="+33 1 23 45 67 89"
                  className="bg-white border-gray-300"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleEditUser} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Enregistrer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}