'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, Camera, Award, BookOpen, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth';
import { ROUTES, USER_ROLES } from '@/lib/constants';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  studentId: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { isAuthenticated, user, updateProfile, isHydrated } = useAuthStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
      address: '',
      bio: '',
      studentId: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: '',
        address: '',
        bio: '',
        studentId: '',
      });
    }
  }, [user, form]);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isHydrated, router]);

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
      if (success) {
        toast.success('Profil mis à jour avec succès !');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated || (!isAuthenticated || !user)) {
    return null;
  }

  // Mock data
  const stats = [
    { label: 'Cours suivis', value: '6', icon: BookOpen },
    { label: 'Devoirs rendus', value: '12', icon: Award },
    { label: 'Moyenne générale', value: '16.2', icon: TrendingUp },
    { label: 'Messages envoyés', value: '28', icon: Mail },
  ];

  const recentActivity = [
    { action: 'Rendu du projet Architecture', date: '2024-01-20', type: 'assignment' },
    { action: 'Participation au forum IA', date: '2024-01-19', type: 'discussion' },
    { action: 'Téléchargement support cours', date: '2024-01-18', type: 'download' },
    { action: 'Message à Prof. Dubois', date: '2024-01-17', type: 'message' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.firstName} />
                    <AvatarFallback className="text-2xl">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-academic-600 hover:bg-academic-700"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    <Badge className="bg-academic-100 text-academic-800">
                      {user.role === USER_ROLES.STUDENT && 'Étudiant Master 2'}
                      {user.role === USER_ROLES.TEACHER && 'Enseignant'}
                      {user.role === USER_ROLES.ADMIN && 'Administrateur'}
                    </Badge>
                    <Badge variant="outline">Promotion 2024</Badge>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Inscrit depuis janvier 2024
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-academic-600 hover:bg-academic-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Annuler' : 'Modifier'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Informations</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="activity">Activité</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="info">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Gérez vos informations de profil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prénom</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Téléphone</FormLabel>
                                <FormControl>
                                  <Input placeholder="+33 6 12 34 56 78" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {user.role === USER_ROLES.STUDENT && (
                            <FormField
                              control={form.control}
                              name="studentId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Numéro étudiant</FormLabel>
                                  <FormControl>
                                    <Input placeholder="20240001" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adresse</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Rue de l'Université, 75000 Paris" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Biographie</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Parlez-nous de vous..."
                                  rows={4}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Annuler
                          </Button>
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-academic-600 hover:bg-academic-700"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Prénom</label>
                          <p className="mt-1 text-gray-900">{user.firstName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Nom</label>
                          <p className="mt-1 text-gray-900">{user.lastName}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-gray-900">{user.email}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Téléphone</label>
                          <p className="mt-1 text-gray-500">Non renseigné</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Numéro étudiant</label>
                          <p className="mt-1 text-gray-500">Non renseigné</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics */}
            <TabsContent value="stats">
              <div className="grid md:grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold text-academic-600">
                            {stat.value}
                          </p>
                        </div>
                        <stat.icon className="h-8 w-8 text-academic-600" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Activity */}
            <TabsContent value="activity">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>
                    Vos dernières actions sur la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-academic-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(activity.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Badge variant="outline">{activity.type}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Préférences</CardTitle>
                    <CardDescription>
                      Personnalisez votre expérience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Notifications par email</h4>
                        <p className="text-sm text-gray-600">Recevoir les notifications importantes</p>
                      </div>
                      <Button variant="outline" size="sm">Configurer</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Mode sombre</h4>
                        <p className="text-sm text-gray-600">Activer le thème sombre</p>
                      </div>
                      <Button variant="outline" size="sm">Activer</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Sécurité</CardTitle>
                    <CardDescription>
                      Gérez la sécurité de votre compte
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      Changer le mot de passe
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Authentification à deux facteurs
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      Supprimer le compte
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}