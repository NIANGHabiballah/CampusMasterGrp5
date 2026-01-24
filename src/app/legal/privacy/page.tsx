import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Politique de Confidentialité</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Collecte des données</h2>
            <p>CampusMaster collecte uniquement les données nécessaires au fonctionnement de la plateforme pédagogique.</p>
            
            <h2>2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Gérer votre compte utilisateur</li>
              <li>Suivre votre progression académique</li>
              <li>Faciliter la communication pédagogique</li>
            </ul>
            
            <h2>3. Protection des données</h2>
            <p>Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles.</p>
            
            <h2>4. Contact</h2>
            <p>Pour toute question : privacy@campusmaster.fr</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}