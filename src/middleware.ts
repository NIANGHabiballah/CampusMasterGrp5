import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes qui nécessitent une authentification
const protectedRoutes = [
  '/dashboard',
  '/courses',
  '/assignments',
  '/grades',
  '/messages',
  '/profile',
  '/settings',
  '/admin',
  '/teacher',
];

// Routes publiques
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/legal',
  '/support',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Vérifier si c'est une route protégée
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Vérifier si c'est une route publique
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Récupérer le token depuis les cookies ou localStorage (simulé via headers)
  const token = request.cookies.get('auth-token')?.value;
  
  // Si c'est une route protégée et qu'il n'y a pas de token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // Si l'utilisateur est connecté et essaie d'accéder aux pages d'auth
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};