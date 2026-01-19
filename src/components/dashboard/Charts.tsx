'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Données mock pour les graphiques
const gradeData = [
  { month: 'Sep', average: 14.2, assignments: 3 },
  { month: 'Oct', average: 15.1, assignments: 4 },
  { month: 'Nov', average: 16.3, assignments: 5 },
  { month: 'Dec', average: 15.8, assignments: 3 },
  { month: 'Jan', average: 16.2, assignments: 4 },
];

const activityData = [
  { day: 'Lun', views: 12, downloads: 3, messages: 2 },
  { day: 'Mar', views: 19, downloads: 5, messages: 4 },
  { day: 'Mer', views: 15, downloads: 2, messages: 1 },
  { day: 'Jeu', views: 22, downloads: 8, messages: 6 },
  { day: 'Ven', views: 18, downloads: 4, messages: 3 },
  { day: 'Sam', views: 8, downloads: 1, messages: 0 },
  { day: 'Dim', views: 5, downloads: 0, messages: 1 },
];

const courseDistribution = [
  { name: 'Architecture', value: 25, color: '#3b82f6' },
  { name: 'IA', value: 20, color: '#10b981' },
  { name: 'Sécurité', value: 18, color: '#f59e0b' },
  { name: 'Projet', value: 15, color: '#ef4444' },
  { name: 'Data Science', value: 22, color: '#8b5cf6' },
];

const performanceData = [
  { subject: 'Architecture', student: 16.2, class: 14.8 },
  { subject: 'IA', student: 17.1, class: 15.2 },
  { subject: 'Sécurité', student: 15.8, class: 14.5 },
  { subject: 'Projet', student: 16.5, class: 15.8 },
  { subject: 'Data Science', student: 15.9, class: 14.9 },
];

export function GradeEvolutionChart() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Évolution des notes</CardTitle>
        <CardDescription>
          Progression de votre moyenne générale
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={gradeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[10, 20]} />
            <Tooltip 
              formatter={(value, name) => [
                `${value}/20`, 
                name === 'average' ? 'Moyenne' : 'Devoirs'
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="average" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Moyenne"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ActivityChart() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Activité hebdomadaire</CardTitle>
        <CardDescription>
          Vos interactions sur la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="views" 
              stackId="1"
              stroke="#3b82f6" 
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Pages vues"
            />
            <Area 
              type="monotone" 
              dataKey="downloads" 
              stackId="1"
              stroke="#10b981" 
              fill="#10b981"
              fillOpacity={0.6}
              name="Téléchargements"
            />
            <Area 
              type="monotone" 
              dataKey="messages" 
              stackId="1"
              stroke="#f59e0b" 
              fill="#f59e0b"
              fillOpacity={0.6}
              name="Messages"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CourseDistributionChart() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Répartition par matière</CardTitle>
        <CardDescription>
          Temps passé par cours (en heures)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={courseDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {courseDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}h`, 'Temps']} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function PerformanceComparisonChart() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Performance vs Classe</CardTitle>
        <CardDescription>
          Comparaison avec la moyenne de classe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis domain={[10, 20]} />
            <Tooltip formatter={(value) => [`${value}/20`, '']} />
            <Legend />
            <Bar 
              dataKey="student" 
              fill="#3b82f6" 
              name="Votre moyenne"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="class" 
              fill="#94a3b8" 
              name="Moyenne classe"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const stats = [
    {
      title: 'Moyenne générale',
      value: '16.2',
      unit: '/20',
      change: '+0.4',
      trend: 'up',
      color: 'text-green-600'
    },
    {
      title: 'Devoirs rendus',
      value: '12',
      unit: '/15',
      change: '80%',
      trend: 'up',
      color: 'text-blue-600'
    },
    {
      title: 'Temps d\'étude',
      value: '28',
      unit: 'h/semaine',
      change: '+2h',
      trend: 'up',
      color: 'text-purple-600'
    },
    {
      title: 'Rang dans la classe',
      value: '3',
      unit: '/45',
      change: '+1',
      trend: 'up',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stat.unit}
                  </p>
                </div>
                <p className={`text-sm ${stat.color} mt-1`}>
                  {stat.change} ce mois
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}