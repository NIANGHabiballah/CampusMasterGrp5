'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Bell, BookOpen, GraduationCap, Menu, MessageSquare, Settings, User, LogOut, FileText, BarChart3 } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useNotifications } from '@/contexts/NotificationContext';
import { ROUTES, USER_ROLES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { unreadCount } = useNotifications();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  const navigation = [
    { name: 'Tableau de bord', href: ROUTES.DASHBOARD, icon: BarChart3 },
    { name: 'Cours', href: ROUTES.COURSES, icon: BookOpen },
    { name: 'Devoirs', href: ROUTES.ASSIGNMENTS, icon: FileText },
    { name: 'Messages', href: ROUTES.MESSAGES, icon: MessageSquare },
  ];

  const isActiveRoute = (href: string) => {
    if (href === ROUTES.DASHBOARD) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  if (!isAuthenticated) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href={ROUTES.HOME} className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-academic-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-academic-900">CampusMaster</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href={ROUTES.LOGIN}>Connexion</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={ROUTES.REGISTER}>Inscription</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.DASHBOARD} className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-academic-600">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-academic-900 hidden sm:block">CampusMaster</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-academic-100 text-academic-700 border border-academic-200"
                      : "text-gray-600 hover:text-academic-600 hover:bg-academic-50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.firstName} />
                    <AvatarFallback className="bg-academic-100 text-academic-700">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <Badge variant="secondary" className="w-fit mt-1">
                    {user?.role === USER_ROLES.STUDENT && 'Étudiant'}
                    {user?.role === USER_ROLES.TEACHER && 'Enseignant'}
                    {user?.role === USER_ROLES.ADMIN && 'Administrateur'}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.PROFILE} className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 bg-white">
                <div className="flex flex-col h-full bg-white">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-6 border-b bg-white">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-academic-600">
                        <GraduationCap className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-lg font-bold text-academic-900">CampusMaster</span>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="p-6 border-b bg-academic-50">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user?.avatar} alt={user?.firstName} />
                        <AvatarFallback className="bg-academic-100 text-academic-700">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        <Badge variant="secondary" className="mt-1">
                          {user?.role === USER_ROLES.STUDENT && 'Étudiant'}
                          {user?.role === USER_ROLES.TEACHER && 'Enseignant'}
                          {user?.role === USER_ROLES.ADMIN && 'Administrateur'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 p-6 bg-white">
                    <div className="space-y-2">
                      {navigation.map((item) => {
                        const isActive = isActiveRoute(item.href);
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                              isActive
                                ? "bg-academic-100 text-academic-700 border border-academic-200"
                                : "text-gray-600 hover:text-academic-600 hover:bg-academic-50"
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                            {item.href === ROUTES.MESSAGES && unreadCount > 0 && (
                              <Badge className="ml-auto bg-red-500 hover:bg-red-500">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </Badge>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </nav>

                  {/* Mobile Footer */}
                  <div className="p-6 border-t space-y-2 bg-white">
                    <Link
                      href={ROUTES.PROFILE}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-academic-600 hover:bg-academic-50 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span>Profil</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}