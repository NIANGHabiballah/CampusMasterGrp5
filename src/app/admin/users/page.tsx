'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/Header';
import { Search, Filter, UserCheck, UserX, Edit, Trash2, Plus, Mail, Shield } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    {
      id: '1',
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'marie.dupont@campus.fr',
      role: 'STUDENT',
      status: 'active',
      registeredAt: '2024-01-15T10:30:00',
      lastLogin: '2024-01-20T14:25:00',
      courses: 6
    },
    {
      id: '2',
      firstName: 'Prof. Jean',
      lastName: 'Martin',
      email: 'jean.martin@campus.fr',
      role: 'TEACHER',
      status: 'active',
      registeredAt: '2024-01-10T09:15:00',
      lastLogin: '2024-01-20T16:45:00',
      courses: 4
    },
    {
      id: '3',
      firstName: 'Sophie',
      lastName: 'Leroy',
      email: 'sophie.leroy@campus.fr',
      role: 'STUDENT',
      status: 'pending',
      registeredAt: '2024-01-20T11:20:00',
      lastLogin: null,
      courses: 0
    },
    {
      id: '4',
      firstName: 'Dr. Pierre',
      lastName: 'Blanc',
      email: 'pierre.blanc@campus.fr',
      role: 'TEACHER',
      status: 'active',
      registeredAt: '2024-01-08T14:00:00',
      lastLogin: '2024-01-19T13:30:00',
      courses: 3
    },
    {
      id: '5',
      firstName: 'Admin',
      lastName: 'Système',
      email: 'admin@campus.fr',
      role: 'ADMIN',
      status: 'active',
      registeredAt: '2024-01-01T00:00:00',
      lastLogin: '2024-01-20T17:00:00',
      courses: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'STUDENT': return 'Étudiant';
      case 'TEACHER': return 'Enseignant';
      case 'ADMIN': return 'Administrateur';
      default: return role;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return <Badge className="bg-blue-100 text-blue-800">Étudiant</Badge>;
      case 'TEACHER':
        return <Badge className="bg-green-100 text-green-800">Enseignant</Badge>;
      case 'ADMIN':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">En attente</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleApproveUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ));
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'suspended' } : user
    ));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'STUDENT').length,
    teachers: users.filter(u => u.role === 'TEACHER').length,
    pending: users.filter(u => u.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des utilisateurs
            </h1>
            <p className="text-gray-600">
              Administrez les comptes utilisateurs et leurs permissions
            </p>
          </div>
          
          <Button className="bg-academic-600 hover:bg-academic-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel utilisateur
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600">Total utilisateurs</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.students}</div>
              <div className="text-sm text-gray-600">Étudiants</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{stats.teachers}</div>
              <div className="text-sm text-gray-600">Enseignants</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{stats.pending}</div>
              <div className="text-sm text-gray-600">En attente</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="STUDENT">Étudiants</SelectItem>
                  <SelectItem value="TEACHER">Enseignants</SelectItem>
                  <SelectItem value="ADMIN">Administrateurs</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="suspended">Suspendus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Liste de tous les utilisateurs de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`} />
                      <AvatarFallback>
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </h4>
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Inscrit: {new Date(user.registeredAt).toLocaleDateString('fr-FR')}</span>
                        {user.lastLogin && (
                          <span>Dernière connexion: {new Date(user.lastLogin).toLocaleDateString('fr-FR')}</span>
                        )}
                        {user.role === 'STUDENT' && (
                          <span>{user.courses} cours</span>
                        )}
                        {user.role === 'TEACHER' && (
                          <span>{user.courses} cours enseignés</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {user.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveUser(user.id)}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                    )}
                    
                    {user.status === 'active' && user.role !== 'ADMIN' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSuspendUser(user.id)}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Suspendre
                      </Button>
                    )}
                    
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4" />
                    </Button>
                    
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {user.role !== 'ADMIN' && (
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}