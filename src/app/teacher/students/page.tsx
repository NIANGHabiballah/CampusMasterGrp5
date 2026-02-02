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
import { apiService } from '@/services/api';
import { toast } from 'sonner';

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingValidation: 0,
    activeStudents: 0,
    suspendedStudents: 0,
    averageGrade: 0,
    averageAttendance: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const usersData = await apiService.getUsers();
      
      const activeStudents = usersData.filter(user => 
        user.role === 'STUDENT' && user.status === 'APPROVED'
      );
      
      const pendingStudentsData = usersData.filter(user => 
        user.role === 'STUDENT' && user.status === 'PENDING'
      );
      
      const suspendedStudents = usersData.filter(user => 
        user.role === 'STUDENT' && user.status === 'SUSPENDED'
      );
      
      setStudents(activeStudents);
      setPendingStudents(pendingStudentsData);
      
      // Calculer les statistiques
      const totalGrades = activeStudents.reduce((sum, s) => sum + (s.averageGrade || 0), 0);
      const totalAttendance = activeStudents.reduce((sum, s) => sum + (s.attendance || 0), 0);
      
      setStats({
        totalStudents: usersData.filter(u => u.role === 'STUDENT').length,
        pendingValidation: pendingStudentsData.length,
        activeStudents: activeStudents.length,
        suspendedStudents: suspendedStudents.length,
        averageGrade: activeStudents.length > 0 ? totalGrades / activeStudents.length : 0,
        averageAttendance: activeStudents.length > 0 ? totalAttendance / activeStudents.length : 0
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const validateStudent = async (studentId: number) => {
    try {
      await apiService.updateUser(studentId.toString(), { status: 'APPROVED' });
      toast.success('Profil étudiant validé');
      loadData();
    } catch (error) {
      toast.error('Erreur lors de la validation');
    }
  };

  const rejectStudent = async (studentId: number) => {
    try {
      await apiService.updateUser(studentId.toString(), { status: 'REJECTED' });
      toast.success('Demande rejetée');
      loadData();
    } catch (error) {
      toast.error('Erreur lors du rejet');
    }
  };

  const suspendStudent = async (studentId: number) => {
    try {
      await apiService.updateUser(studentId.toString(), { status: 'SUSPENDED' });
      toast.success('Étudiant suspendu');
      loadData();
    } catch (error) {
      toast.error('Erreur lors de la suspension');
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

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Étudiants</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingValidation}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.averageGrade.toFixed(1)}/20</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assiduité Moyenne</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.averageAttendance.toFixed(0)}%</div>
          </CardContent>
        </Card>
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
                        <div className="text-sm">
                          <div className="text-gray-500">Moyenne</div>
                          <div className={`font-semibold ${getGradeColor(student.averageGrade || 0)}`}>
                            {student.averageGrade || 'N/A'}/20
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Assiduité</div>
                          <div className={`font-semibold ${getAttendanceColor(student.attendance || 0)}`}>
                            {student.attendance || 'N/A'}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <div className="text-gray-500">Cours inscrits</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(student.enrolledCourses || []).map((course, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {course}
                            </Badge>
                          ))}
                          {(!student.enrolledCourses || student.enrolledCourses.length === 0) && (
                            <span className="text-gray-400 text-xs">Aucun cours</span>
                          )}
                        </div>
                      </div>

                      {!student.profileComplete && (
                        <div className="flex items-center gap-1 text-orange-600 text-sm">
                          <AlertCircle className="h-3 w-3" />
                          Profil incomplet
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => viewStudentDetails(student)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                        {student.status !== 'SUSPENDED' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => suspendStudent(student.id)}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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
                          {(student.requestedCourses || []).map((course, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {course}
                            </Badge>
                          ))}
                          {(!student.requestedCourses || student.requestedCourses.length === 0) && (
                            <span className="text-gray-400 text-xs">Aucun cours demandé</span>
                          )}
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