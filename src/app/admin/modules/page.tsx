'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Edit, Trash2, Users, Calendar, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface Module {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  semester: string;
  department: string;
  teacherId?: string;
  teacherName?: string;
  studentsCount: number;
  isActive: boolean;
  createdAt: string;
}

const mockModules: Module[] = [
  {
    id: '1',
    name: 'Architecture Logicielle',
    code: 'ARCH-501',
    description: 'Étude des patterns architecturaux et des microservices',
    credits: 6,
    semester: 'S1 2024',
    department: 'Informatique',
    teacherId: '2',
    teacherName: 'Prof. Jean Martin',
    studentsCount: 45,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Intelligence Artificielle',
    code: 'IA-502',
    description: 'Machine Learning et Deep Learning avancés',
    credits: 8,
    semester: 'S1 2024',
    department: 'Informatique',
    teacherId: '3',
    teacherName: 'Dr. Sophie Leroy',
    studentsCount: 38,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export default function AdminModulesPage() {
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [newModule, setNewModule] = useState({
    name: '',
    code: '',
    description: '',
    credits: 6,
    semester: '',
    department: '',
    teacherId: ''
  });

  const departments = ['Informatique', 'Mathématiques', 'Physique', 'Économie'];
  const semesters = ['S1 2024', 'S2 2024', 'S1 2025', 'S2 2025'];
  const teachers = [
    { id: '2', name: 'Prof. Jean Martin' },
    { id: '3', name: 'Dr. Sophie Leroy' },
    { id: '4', name: 'Prof. Pierre Dubois' }
  ];

  const handleCreateModule = () => {
    if (!newModule.name || !newModule.code || !newModule.department || !newModule.semester) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const module: Module = {
      id: `mod-${Date.now()}`,
      name: newModule.name,
      code: newModule.code,
      description: newModule.description,
      credits: newModule.credits,
      semester: newModule.semester,
      department: newModule.department,
      teacherId: newModule.teacherId || undefined,
      teacherName: teachers.find(t => t.id === newModule.teacherId)?.name,
      studentsCount: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setModules([module, ...modules]);
    setNewModule({ name: '', code: '', description: '', credits: 6, semester: '', department: '', teacherId: '' });
    setIsCreateOpen(false);
    toast.success('Module créé avec succès');
  };

  const handleDeleteModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
    toast.success('Module supprimé');
  };

  const toggleModuleStatus = (id: string) => {
    setModules(modules.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    ));
    toast.success('Statut du module mis à jour');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Modules</h1>
          <p className="text-gray-600 mt-1">Gérez les matières et modules d'enseignement</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau module
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Créer un nouveau module</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau module d'enseignement au système
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du module *</Label>
                  <Input
                    id="name"
                    value={newModule.name}
                    onChange={(e) => setNewModule({...newModule, name: e.target.value})}
                    placeholder="Ex: Architecture Logicielle"
                    className="bg-white border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Code du module *</Label>
                  <Input
                    id="code"
                    value={newModule.code}
                    onChange={(e) => setNewModule({...newModule, code: e.target.value})}
                    placeholder="Ex: ARCH-501"
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="department">Département *</Label>
                  <Select value={newModule.department} onValueChange={(value) => setNewModule({...newModule, department: value})}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-[200]">
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="semester">Semestre *</Label>
                  <Select value={newModule.semester} onValueChange={(value) => setNewModule({...newModule, semester: value})}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-[200]">
                      {semesters.map(sem => (
                        <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="credits">Crédits ECTS</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={newModule.credits}
                    onChange={(e) => setNewModule({...newModule, credits: parseInt(e.target.value) || 6})}
                    min="1"
                    max="12"
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="teacher">Enseignant responsable</Label>
                <Select value={newModule.teacherId} onValueChange={(value) => setNewModule({...newModule, teacherId: value})}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Sélectionner un enseignant" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-[200]">
                    {teachers.map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newModule.description}
                  onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                  placeholder="Description du module..."
                  rows={4}
                  className="bg-white border-gray-300"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateModule} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Créer le module
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Tous les modules ({modules.length})</TabsTrigger>
          <TabsTrigger value="active">Actifs ({modules.filter(m => m.isActive).length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactifs ({modules.filter(m => !m.isActive).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6">
            {modules.map(module => (
              <Card key={module.id} className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.name}</CardTitle>
                          <CardDescription>{module.code} • {module.department}</CardDescription>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={module.isActive ? "default" : "secondary"}>
                        {module.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Badge variant="outline">{module.credits} ECTS</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">{module.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{module.semester}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{module.studentsCount} étudiants</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                        <span>{module.teacherName || 'Non assigné'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{module.credits} crédits</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleModuleStatus(module.id)}
                      >
                        {module.isActive ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteModule(module.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-6">
            {modules.filter(m => m.isActive).map(module => (
              <Card key={module.id} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">{module.name}</h3>
                        <p className="text-sm text-gray-600">{module.code} • {module.studentsCount} étudiants</p>
                      </div>
                    </div>
                    <Badge variant="default">Actif</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <div className="grid gap-6">
            {modules.filter(m => !m.isActive).map(module => (
              <Card key={module.id} className="border-0 shadow-sm opacity-60">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <div>
                        <h3 className="font-semibold text-gray-600">{module.name}</h3>
                        <p className="text-sm text-gray-500">{module.code}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Inactif</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}