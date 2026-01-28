import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from '@/contexts/NotificationContext';
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CampusMaster - Plateforme pédagogique avancée",
  description: "Plateforme pédagogique moderne pour étudiants de Master 2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <NotificationProvider>
          <AuthenticatedLayout>
            {children}
          </AuthenticatedLayout>
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            duration={5000}
          />
        </NotificationProvider>
      </body>
    </html>
  );
}
