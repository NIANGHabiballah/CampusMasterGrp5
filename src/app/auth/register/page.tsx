'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' as const,
    studentId: '',
    filiere: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (formData.role === 'STUDENT' && !formData.studentId) {
      toast.error('Le numéro étudiant est obligatoire pour les étudiants');
      return;
    }

    setIsLoading(true);

    try {
      const success = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        studentId: formData.studentId,
        filiere: formData.filiere
      });

      if (success) {
        toast.success('Inscription réussie ! Votre compte est en attente d\'approbation.');
        router.push('/auth/login');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CampusMaster</span>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-center">
              Rejoignez la plateforme pédagogique CampusMaster
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Votre prénom"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Votre nom"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="votre.email@campus.fr"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle *</Label>
                  <Select value={formData.role} onValueChange={(value: any) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Étudiant</SelectItem>
                      <SelectItem value="TEACHER">Enseignant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="filiere">Filière</Label>
                  <div className="relative z-10">
                    <Select value={formData.filiere} onValueChange={(value) => setFormData({...formData, filiere: value})}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent className="max-h-20 overflow-y-auto" position="popper">
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
                        <SelectItem value="IA">🟣 Intelligence Artificielle</SelectItem>
                        <SelectItem value="IL">🟣 Ingénierie Logicielle</SelectItem>
                        <SelectItem value="MCS">🟣 Calcul Scientifique</SelectItem>
                        <SelectItem value="SRIV">🟣 Systèmes & Réseaux</SelectItem>
                        <SelectItem value="ROB">🟣 Robotique</SelectItem>
                        <SelectItem value="RCC">🟣 Cinématographie</SelectItem>
                        <SelectItem value="MISAAN">🟣 Agro-Alimentaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {formData.role === 'STUDENT' && (
                <div className="space-y-2">
                  <Label htmlFor="studentId">Numéro étudiant *</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    placeholder="M2-2024-XXX"
                    disabled={isLoading}
                    required
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Minimum 6 caractères"
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="Répétez le mot de passe"
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inscription...
                  </>
                ) : (
                  'Créer mon compte'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link 
                  href="/auth/login" 
                  className="text-blue-600 hover:underline font-medium"
                >
                  Se connecter
                </Link>
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Information importante</h4>
              <p className="text-sm text-blue-700">
                Les comptes étudiants nécessitent une approbation par l'administration. 
                Vous recevrez un email de confirmation une fois votre compte validé.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}