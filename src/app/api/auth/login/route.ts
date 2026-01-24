import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  
  const users = [
    { id: 1, email: 'admin@campus.fr', password: 'password', role: 'ADMIN' },
    { id: 2, email: 'prof@campus.fr', password: 'password', role: 'TEACHER' },
    { id: 3, email: 'etudiant@campus.fr', password: 'password', role: 'STUDENT' }
  ];
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  return NextResponse.json({ 
    user: { id: user.id, email: user.email, role: user.role },
    token: `mock-token-${user.id}`
  });
}