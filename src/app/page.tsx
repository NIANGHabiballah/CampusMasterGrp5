import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { BookOpen, Users, Award, MessageSquare, BarChart3, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Gestion des cours',
      description: 'Accédez à tous vos cours, supports et ressources pédagogiques en un seul endroit.'
    },
    {
      icon: Award,
      title: 'Suivi des devoirs',
      description: 'Déposez vos travaux, consultez vos notes et recevez des feedbacks détaillés.'
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      description: 'Échangez avec vos enseignants et camarades via la messagerie intégrée.'
    },
    {
      icon: BarChart3,
      title: 'Tableau de bord',
      description: 'Suivez votre progression avec des statistiques et analyses avancées.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Travaillez en équipe sur des projets et participez aux discussions.'
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Vos données sont protégées avec les plus hauts standards de sécurité.'
    }
  ];

  const benefits = [
    'Interface moderne et intuitive',
    'Notifications temps réel',
    'Synchronisation multi-appareils',
    'Analytics avancés',
    'Support 24/7'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-50 via-white to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-academic-600/10 to-blue-600/10"></div>
        <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-academic-900 mb-6 leading-tight">
              Votre plateforme pédagogique
              <span className="text-academic-600 block sm:inline"> nouvelle génération</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              CampusMaster révolutionne l'expérience éducative avec une interface moderne, 
              intuitive et des fonctionnalités avancées pour les étudiants de Master 2.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-academic-600 hover:bg-academic-700 text-white px-8 py-3 text-lg" asChild>
                <Link href={ROUTES.REGISTER}>
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-academic-200 text-academic-700 hover:bg-academic-50 px-8 py-3 text-lg" asChild>
                <Link href={ROUTES.LOGIN}>
                  Se connecter
                </Link>
              </Button>
            </div>
            
            {/* Benefits List */}
            <div className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-academic-900 mb-4">
              Fonctionnalités avancées
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez tous les outils dont vous avez besoin pour réussir votre Master 2
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover group">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-academic-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-academic-200 transition-colors">
                    <feature.icon className="h-6 w-6 text-academic-600" />
                  </div>
                  <CardTitle className="text-xl text-academic-900 group-hover:text-academic-700 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-academic-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { number: '10K+', label: 'Étudiants actifs' },
              { number: '500+', label: 'Cours disponibles' },
              { number: '98%', label: 'Satisfaction' },
              { number: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-academic-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-academic-900 text-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Prêt à transformer votre expérience éducative ?
          </h2>
          <p className="text-lg sm:text-xl text-academic-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Rejoignez des milliers d'étudiants qui utilisent déjà CampusMaster 
            pour exceller dans leurs études.
          </p>
          <Button size="lg" className="bg-white text-academic-900 hover:bg-academic-50 px-8 py-3 text-lg" asChild>
            <Link href={ROUTES.REGISTER}>
              Créer mon compte gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-academic-600">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-academic-900">CampusMaster</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600">
              <span>© 2024 CampusMaster. Plateforme pédagogique pour Master 2.</span>
              <div className="flex gap-4">
                <Link href="#" className="hover:text-academic-600 transition-colors">Confidentialité</Link>
                <Link href="#" className="hover:text-academic-600 transition-colors">Conditions</Link>
                <Link href="#" className="hover:text-academic-600 transition-colors">Support</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}