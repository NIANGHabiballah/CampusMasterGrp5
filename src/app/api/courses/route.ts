import { NextRequest, NextResponse } from 'next/server';

const courses = [
  { id: 1, title: 'React Avancé', description: 'Cours React', semester: 'S1 2024', credits: 6 },
  { id: 2, title: 'Node.js Backend', description: 'Cours Node.js', semester: 'S1 2024', credits: 4 }
];

export async function GET() {
  return NextResponse.json(courses);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newCourse = { id: Date.now(), ...body };
  courses.push(newCourse);
  return NextResponse.json(newCourse, { status: 201 });
}