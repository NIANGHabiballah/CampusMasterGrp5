import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support</h1>
            <p className="text-gray-600">Nous sommes là pour vous aider</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Nous contacter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">support@campusmaster.fr</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm text-gray-600">+33 1 23 45 67 89</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Horaires</p>
                    <p className="text-sm text-gray-600">Lun-Ven 9h-18h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Envoyer un message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Sujet</Label>
                    <Input id="subject" placeholder="Objet de votre demande" />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Décrivez votre problème..." rows={4} />
                  </div>
                  
                  <Button className="w-full">Envoyer</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Questions Fréquentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Comment réinitialiser mon mot de passe ?</h3>
                <p className="text-sm text-gray-600">Utilisez le lien "Mot de passe oublié" sur la page de connexion.</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Comment soumettre un devoir ?</h3>
                <p className="text-sm text-gray-600">Rendez-vous dans la section "Mes Devoirs" et cliquez sur "Soumettre".</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Où consulter mes notes ?</h3>
                <p className="text-sm text-gray-600">Vos notes sont disponibles dans la section "Mes Notes".</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}