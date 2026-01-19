import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { BookOpen, Users, Award, MessageSquare, BarChart3, Shield, ArrowRight, CheckCircle, Sparkles, Zap, Globe } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Gestion des cours',
      description: 'Accédez à tous vos cours, supports et ressources pédagogiques en un seul endroit.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Award,
      title: 'Suivi des devoirs',
      description: 'Déposez vos travaux, consultez vos notes et recevez des feedbacks détaillés.',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      description: 'Échangez avec vos enseignants et camarades via la messagerie intégrée.',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Tableau de bord',
      description: 'Suivez votre progression avec des statistiques et analyses avancées.',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Travaillez en équipe sur des projets et participez aux discussions.',
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Vos données sont protégées avec les plus hauts standards de sécurité.',
      gradient: 'from-red-500 to-red-600'
    }
  ];

  const benefits = [
    { icon: Sparkles, text: 'Interface moderne et intuitive' },
    { icon: Zap, text: 'Notifications temps réel' },
    { icon: Globe, text: 'Synchronisation multi-appareils' },
    { icon: BarChart3, text: 'Analytics avancés' },
    { icon: Shield, text: 'Support 24/7' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-academic-50 via-white to-blue-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 bg-academic-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 sm:py-28 lg:py-32 relative">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-academic-100 rounded-full text-academic-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Nouvelle génération de plateforme éducative
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
              Votre plateforme
              <span className="bg-gradient-to-r from-academic-600 to-blue-600 bg-clip-text text-transparent block sm:inline"> pédagogique</span>
              <span className="block">révolutionnaire</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
              CampusMaster transforme l'expérience éducative avec une interface moderne, 
              des fonctionnalités avancées et une approche centrée sur la réussite des étudiants de Master 2.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button size="lg" className="bg-gradient-to-r from-academic-600 to-blue-600 hover:from-academic-700 hover:to-blue-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300" asChild>
                <Link href={ROUTES.REGISTER}>
                  Commencer maintenant
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-academic-600 text-academic-600 hover:bg-academic-600 hover:text-white px-10 py-4 text-lg font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300" asChild>
                <Link href={ROUTES.LOGIN}>
                  Se connecter
                </Link>
              </Button>
            </div>
            
            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex flex-col items-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:bg-white/90 transition-all duration-300">
                  <benefit.icon className="h-8 w-8 text-academic-600 mb-3" />
                  <span className="text-sm font-medium text-gray-700 text-center leading-tight">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-academic-100 rounded-full text-academic-700 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Fonctionnalités puissantes
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez une suite complète d'outils conçus pour maximiser votre réussite académique
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group bg-white rounded-3xl overflow-hidden">
                <CardHeader className="pb-6 relative">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-academic-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Rejoignez une communauté qui grandit
            </h2>
            <p className="text-xl text-gray-600">Des chiffres qui parlent d'eux-mêmes</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Étudiants actifs', color: 'text-blue-600' },
              { number: '500+', label: 'Cours disponibles', color: 'text-green-600' },
              { number: '98%', label: 'Satisfaction', color: 'text-purple-600' },
              { number: '24/7', label: 'Support', color: 'text-orange-600' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <div className="text-lg font-medium text-gray-700">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-academic-900 via-blue-900 to-purple-900 text-white py-24 sm:py-32 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Prêt à transformer votre
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">expérience éducative ?</span>
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Rejoignez des milliers d'étudiants qui utilisent déjà CampusMaster 
            pour exceller dans leurs études et construire leur avenir.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-4 text-xl font-semibold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300" asChild>
            <Link href={ROUTES.REGISTER}>
              Créer mon compte gratuitement
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-academic-600 to-blue-600">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">CampusMaster</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6 text-gray-400">
              <span className="text-center">© 2024 CampusMaster. Plateforme pédagogique pour Master 2.</span>
              <div className="flex gap-6">
                <Link href="#" className="hover:text-white transition-colors duration-300">Confidentialité</Link>
                <Link href="#" className="hover:text-white transition-colors duration-300">Conditions</Link>
                <Link href="#" className="hover:text-white transition-colors duration-300">Support</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}