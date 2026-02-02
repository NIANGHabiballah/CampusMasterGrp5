'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, UserCheck, UserX, Eye, Mail, Phone, MapPin, Calendar, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Simuler le chargement des données
      setStudents([
        {
          id: 1,
          firstName: 'Marie',
          lastName: 'Dubois',
          email: 'marie.dubois@email.com',
          phone: '06 12 34 56 78',
          address: '123 Rue de la Paix, Paris',
          studentId: 'M2IL001',
          specialty: 'Informatique',
          semester: 'M2',
          status: 'ACTIVE',
          enrolledCourses: ['Java Spring Boot', 'Angular'],
          averageGrade: 15.5,
          attendance: 92,
          lastActivity: '2024-02-10T14:30:00',
          profileComplete: true
        },
        {
          id: 2,
          firstName: 'Pierre',
          lastName: 'Martin',
          email: 'pierre.martin@email.com',
          phone: '06 98 76 54 32',
          address: '456 Avenue des Champs, Lyon',
          studentId: 'M2IL002',
          specialty: 'Informatique',
          semester: 'M2',
          status: 'ACTIVE',
          enrolledCourses: ['Java Spring Boot', 'Base de Données'],
          averageGrade: 13.2,
          attendance: 88,
          lastActivity: '2024-02-09T16:45:00',
          profileComplete: false
        }
      ]);

      setPendingStudents([
        {
          id: 3,
          firstName: 'Sophie',
          lastName: 'Leroy',
          email: 'sophie.leroy@email.com',
          phone: '06 11 22 33 44',
          studentId: 'M2IL003',
          specialty: 'Informatique',
          semester: 'M2',
          status: 'PENDING',
          requestedCourses: ['Java Spring Boot'],
          submittedAt: '2024-02-08T10:00:00',
          profileComplete: true
        }
      ]);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateStudent = async (studentId: number) => {
    try {
      const student = pendingStudents.find(s => s.id === studentId);
      if (student) {
        const validatedStudent = {
          ...student,
          status: 'ACTIVE',
          enrolledCourses: student.requestedCourses,
          averageGrade: 0,
          attendance: 100,
          lastActivity: new Date().toISOString()
        };
        
        setStudents(prev => [...prev, validatedStudent]);
        setPendingStudents(prev => prev.filter(s => s.id !== studentId));
        toast.success(`Profil de ${student.firstName} ${student.lastName} validé`);
      }
    } catch (error) {
      toast.error('Erreur lors de la validation');
    }
  };

  const rejectStudent = async (studentId: number) => {
    try {
      const student = pendingStudents.find(s => s.id === studentId);
      setPendingStudents(prev => prev.filter(s => s.id !== studentId));
      toast.success(`Demande de ${student?.firstName} ${student?.lastName} rejetée`);
    } catch (error) {
      toast.error('Erreur lors du rejet');
    }
  };

  const viewStudentDetails = (student: any) => {
    setSelectedStudent(student);
    setIsDetailOpen(true);
  };

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 14) return 'text-green-600';
    if (grade >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des étudiants
          </h1>
          <p className="text-gray-600">
            Validez les profils et suivez vos étudiants
          </p>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Étudiants actifs ({students.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            En attente de validation ({pendingStudents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un étudiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Liste des étudiants actifs */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Chargement des étudiants...</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {student.firstName[0]}{student.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {student.firstName} {student.lastName}
                          </CardTitle>
                          <CardDescription>
                            {student.studentId} • {student.specialty}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(student.status)}>
                        Actif
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Moyenne</div>
                          <div className={`font-semibold ${getGradeColor(student.averageGrade)}`}>
                            {student.averageGrade}/20
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Assiduité</div>
                          <div className={`font-semibold ${getAttendanceColor(student.attendance)}`}>
                            {student.attendance}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <div className="text-gray-500">Cours inscrits</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {student.enrolledCourses.map((course, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {!student.profileComplete && (
                        <div className="flex items-center gap-1 text-orange-600 text-sm">
                          <AlertCircle className="h-3 w-3" />
                          Profil incomplet
                        </div>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => viewStudentDetails(student)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {/* Étudiants en attente de validation */}
          {pendingStudents.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Aucune demande en attente</div>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingStudents.map((student) => (
                <Card key={student.id} className="border-0 shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {student.firstName[0]}{student.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {student.firstName} {student.lastName}
                          </CardTitle>
                          <CardDescription>
                            {student.studentId} • {student.specialty}
                          </CardDescription>
                          <div className="text-sm text-gray-500 mt-1">
                            Demande soumise le {new Date(student.submittedAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {student.profileComplete && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        <Badge className={getStatusColor(student.status)}>
                          En attente
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Email</div>
                          <div>{student.email}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Téléphone</div>
                          <div>{student.phone}</div>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <div className="text-gray-500">Cours demandés</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {student.requestedCourses.map((course, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white flex-1"
                          onClick={() => validateStudent(student.id)}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Valider
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 hover:text-red-700 flex-1"
                          onClick={() => rejectStudent(student.id)}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Rejeter
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => viewStudentDetails(student)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog détails étudiant */}
      {selectedStudent && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Profil de {selectedStudent.firstName} {selectedStudent.lastName}
              </DialogTitle>
              <DialogDescription>
                Informations détaillées de l'étudiant
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedStudent.studentId}</p>
                  <Badge className={getStatusColor(selectedStudent.status)}>
                    {selectedStudent.status === 'ACTIVE' ? 'Actif' : 'En attente'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{selectedStudent.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{selectedStudent.phone}</span>
                  </div>
                  {selectedStudent.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{selectedStudent.address}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <span>{selectedStudent.specialty} - {selectedStudent.semester}</span>
                  </div>
                  {selectedStudent.lastActivity && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Dernière activité: {new Date(selectedStudent.lastActivity).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedStudent.status === 'ACTIVE' && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Moyenne générale:</span>
                        <span className={getGradeColor(selectedStudent.averageGrade)}>
                          {selectedStudent.averageGrade}/20
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assiduité:</span>
                        <span className={getAttendanceColor(selectedStudent.attendance)}>
                          {selectedStudent.attendance}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Cours inscrits</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedStudent.enrolledCourses?.map((course, index) => (
                        <Badge key={index} variant="outline">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedStudent.requestedCourses && (
                <div>
                  <h4 className="font-semibold mb-2">Cours demandés</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedStudent.requestedCourses.map((course, index) => (
                      <Badge key={index} variant="outline">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}