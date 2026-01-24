import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Conditions d'Utilisation</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Acceptation des conditions</h2>
            <p>En utilisant CampusMaster, vous acceptez ces conditions d'utilisation.</p>
            
            <h2>2. Utilisation de la plateforme</h2>
            <p>La plateforme est destinée à un usage pédagogique exclusivement.</p>
            
            <h2>3. Responsabilités de l'utilisateur</h2>
            <ul>
              <li>Maintenir la confidentialité de votre compte</li>
              <li>Utiliser la plateforme de manière appropriée</li>
              <li>Respecter les autres utilisateurs</li>
            </ul>
            
            <h2>4. Propriété intellectuelle</h2>
            <p>Le contenu de la plateforme est protégé par les droits d'auteur.</p>
            
            <h2>5. Contact</h2>
            <p>Pour toute question : legal@campusmaster.fr</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}