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
  UserX,
  AlertTriangle
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
  specialty?: string;
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
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    type: 'suspend' | 'delete';
  }>({ isOpen: false, title: '', message: '', action: () => {}, type: 'suspend' });
  
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'STUDENT' as const,
    status: 'ACTIVE' as const,
    studentId: '',
    department: '',
    semester: '',
    specialty: '',
    permissions: '',
    phone: ''
  });

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    // Validation des champs
    if (!editForm.firstName.trim()) {
      toast.error('Le prénom est obligatoire');
      return;
    }
    if (!editForm.lastName.trim()) {
      toast.error('Le nom est obligatoire');
      return;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      toast.error('Veuillez saisir un email valide');
      return;
    }
    
    // Validation téléphone si renseigné
    if (editForm.phone && !/^[+]?[0-9\s-()]{8,15}$/.test(editForm.phone)) {
      toast.error('Format de téléphone invalide');
      return;
    }
    
    // Validation spécifique étudiant
    if (editForm.role === 'STUDENT') {
      if (!editForm.department) {
        toast.error('La filière est obligatoire pour un étudiant');
        return;
      }
      if (!editForm.studentId.trim()) {
        toast.error('Le numéro étudiant est obligatoire');
        return;
      }
    }
    
    try {
      console.log('Données à envoyer:', editForm);
      
      // Filtrer les champs vides pour éviter d'écraser les valeurs existantes
      const dataToSend = Object.fromEntries(
        Object.entries(editForm).filter(([key, value]) => value !== '' && value !== null)
      );
      
      console.log('Données filtrées:', dataToSend);
      
      await apiService.updateUser(selectedUser.id, dataToSend);
      
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? { ...u, ...editForm } : u
      ));
      
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      toast.success('Utilisateur modifié avec succès');
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast.error('Erreur lors de la modification');
    }
  };

  useEffect(() => {
    if (selectedUser) {
      setEditForm({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        role: selectedUser.role,
        status: selectedUser.status,
        studentId: selectedUser.studentId || '',
        department: selectedUser.department || '',
        semester: selectedUser.semester || '',
        specialty: selectedUser.specialty || '',
        permissions: '',
        phone: selectedUser.phone || ''
      });
    }
  }, [selectedUser]);
  
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'STUDENT' as const,
    filiere: '',
    studentId: '',
    semester: '',
    phone: ''
  });

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
          studentId: u.studentId || null,
          department: u.department || null,
          semester: u.semester || null,
          specialty: u.specialty || null,
          phone: u.phone || null,
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
    const user = users.find(u => u.id === userId);
    setConfirmDialog({
      isOpen: true,
      title: 'Suspendre l\'utilisateur',
      message: `Êtes-vous sûr de vouloir suspendre ${user?.firstName} ${user?.lastName} ? Cette action peut être annulée.`,
      type: 'suspend',
      action: async () => {
        try {
          await apiService.updateUser(userId, { status: 'SUSPENDED' });
          setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, status: 'SUSPENDED' as const } : u
          ));
          toast.success('Utilisateur suspendu');
        } catch (error) {
          toast.error('Erreur lors de la suspension');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    setConfirmDialog({
      isOpen: true,
      title: 'Supprimer l\'utilisateur',
      message: `Êtes-vous sûr de vouloir supprimer définitivement ${user?.firstName} ${user?.lastName} ? Cette action est irréversible.`,
      type: 'delete',
      action: async () => {
        try {
          await apiService.deleteUser(userId);
          setUsers(prev => prev.filter(u => u.id !== userId));
          toast.success('Utilisateur supprimé');
        } catch (error) {
          toast.error('Erreur lors de la suppression');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
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

  const handleCreateUser = async () => {
    // Validation des champs
    if (!newUser.firstName.trim()) {
      toast.error('Le prénom est obligatoire');
      return;
    }
    if (!newUser.lastName.trim()) {
      toast.error('Le nom est obligatoire');
      return;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error('Veuillez saisir un email valide');
      return;
    }
    
    // Validation téléphone si renseigné
    if (newUser.phone && !/^[+]?[0-9\s-()]{8,15}$/.test(newUser.phone)) {
      toast.error('Format de téléphone invalide');
      return;
    }
    
    // Validation spécifique étudiant
    if (newUser.role === 'STUDENT') {
      if (!newUser.filiere) {
        toast.error('La filière est obligatoire pour un étudiant');
        return;
      }
      if (!newUser.studentId.trim()) {
        toast.error('Le numéro étudiant est obligatoire');
        return;
      }
    }

    try {
      const userData = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        studentId: newUser.studentId,
        department: newUser.filiere,
        semester: newUser.semester,
        phone: newUser.phone,
        password: 'password123'
      };
      
      await apiService.register(userData);
      
      const data = await apiService.getUsers();
      const formattedUsers = data.map((u: any) => ({
        id: u.id.toString(),
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role,
        status: u.status,
        studentId: u.studentId,
        department: u.department,
        semester: u.semester,
        specialty: u.specialty,
        phone: u.phone,
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
        semester: '',
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
                  placeholder="email@campus.sn"
                  className="bg-white border-gray-300"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <select 
                    id="role"
                    value={newUser.role} 
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="STUDENT">Étudiant</option>
                    <option value="TEACHER">Enseignant</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filiere">Filière</Label>
                  <select 
                    id="filiere"
                    value={newUser.filiere} 
                    onChange={(e) => setNewUser({...newUser, filiere: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="">Sélectionner une filière</option>
                    <option value="IL">Ingénierie Logicielle</option>
                    <option value="IA">Intelligence Artificielle</option>
                    <option value="CYBER">Cybersécurité</option>
                    <option value="DATA">Data Science</option>
                    <option value="WEB">Développement Web</option>
                    <option value="MOBILE">Développement Mobile</option>
                    <option value="DEVOPS">DevOps</option>
                    <option value="CLOUD">Cloud Computing</option>
                    <option value="BLOCKCHAIN">Blockchain</option>
                    <option value="IOT">Internet des Objets</option>
                    <option value="GAME">Développement de Jeux</option>
                    <option value="UI_UX">UI/UX Design</option>
                  </select>
                </div>
              </div>
              
              {newUser.role === 'STUDENT' && (
                <div className="grid grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semestre</Label>
                    <Input
                      id="semester"
                      value={newUser.semester}
                      onChange={(e) => setNewUser({...newUser, semester: e.target.value})}
                      placeholder="S1 2024"
                      className="bg-white border-gray-300"
                    />
                  </div>
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
                <TableHead>Numéro</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Téléphone</TableHead>
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
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.studentId ? (
                      <span className="font-mono text-sm">{user.studentId}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.semester ? (
                      <span className="text-sm">{user.semester}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.department || '-'}</TableCell>
                  <TableCell>
                    {user.phone ? (
                      <span className="text-sm">{user.phone}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
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
                  <select 
                    value={editForm.role} 
                    onChange={(e) => setEditForm({...editForm, role: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="STUDENT">Étudiant</option>
                    <option value="TEACHER">Enseignant</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStatus">Statut</Label>
                  <select 
                    value={editForm.status} 
                    onChange={(e) => {
                      console.log('Nouveau statut sélectionné:', e.target.value);
                      setEditForm({...editForm, status: e.target.value as any});
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="ACTIVE">Actif</option>
                    <option value="PENDING">En attente</option>
                    <option value="SUSPENDED">Suspendu</option>
                  </select>
                </div>
              </div>
              
              {editForm.role === 'STUDENT' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="editFiliere">Filière</Label>
                    <select 
                      value={editForm.department}
                      onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    >
                      <option value="">Sélectionner une filière</option>
                      <option value="IL">Ingénierie Logicielle</option>
                      <option value="IA">Intelligence Artificielle</option>
                      <option value="CYBER">Cybersécurité</option>
                      <option value="DATA">Data Science</option>
                      <option value="WEB">Développement Web</option>
                      <option value="MOBILE">Développement Mobile</option>
                      <option value="DEVOPS">DevOps</option>
                      <option value="CLOUD">Cloud Computing</option>
                      <option value="BLOCKCHAIN">Blockchain</option>
                      <option value="IOT">Internet des Objets</option>
                      <option value="GAME">Développement de Jeux</option>
                      <option value="UI_UX">UI/UX Design</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editStudentId">Numéro étudiant</Label>
                      <Input
                        value={editForm.studentId}
                        onChange={(e) => setEditForm({...editForm, studentId: e.target.value})}
                        className="bg-white border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editSemester">Semestre</Label>
                      <Input
                        value={editForm.semester}
                        onChange={(e) => setEditForm({...editForm, semester: e.target.value})}
                        placeholder="S1 2024"
                        className="bg-white border-gray-300"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {editForm.role === 'TEACHER' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editSpecialty">Spécialité</Label>
                    <Input
                      value={editForm.specialty}
                      onChange={(e) => setEditForm({...editForm, specialty: e.target.value})}
                      placeholder="Informatique, Mathématiques..."
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editDepartment">Département</Label>
                    <Input
                      value={editForm.department}
                      onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                      placeholder="Sciences, Lettres, Droit..."
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
              )}
              
              {editForm.role === 'ADMIN' && (
                <div className="space-y-2">
                  <Label htmlFor="editPermissions">Permissions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Gestion utilisateurs</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Gestion cours</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Statistiques avancées</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Configuration système</span>
                    </label>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="editPhone">Téléphone</Label>
                <Input
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
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
      
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className={`w-5 h-5 ${confirmDialog.type === 'delete' ? 'text-red-500' : 'text-yellow-500'}`} />
              <span>{confirmDialog.title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">{confirmDialog.message}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
            >
              Annuler
            </Button>
            <Button 
              onClick={confirmDialog.action}
              className={`${confirmDialog.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'} text-white`}
            >
              {confirmDialog.type === 'delete' ? 'Supprimer' : 'Suspendre'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}