'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X, BookOpen, Users, Clock } from 'lucide-react';

interface CourseFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export function CourseFilters({ onFiltersChange }: CourseFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedCredits, setSelectedCredits] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const semesters = ['S1', 'S2', 'S3', 'S4'];
  const teachers = ['Prof. Martin', 'Prof. Dubois', 'Prof. Leroy'];
  const credits = ['3', '6', '9'];

  const handleFilterChange = (type: string, value: string) => {
    const filters = {
      search: searchTerm,
      semester: selectedSemester,
      teacher: selectedTeacher,
      credits: selectedCredits
    };

    switch (type) {
      case 'search':
        setSearchTerm(value);
        filters.search = value;
        break;
      case 'semester':
        setSelectedSemester(value);
        filters.semester = value;
        break;
      case 'teacher':
        setSelectedTeacher(value);
        filters.teacher = value;
        break;
      case 'credits':
        setSelectedCredits(value);
        filters.credits = value;
        break;
    }

    onFiltersChange(filters);
    updateActiveFilters(filters);
  };

  const updateActiveFilters = (filters: any) => {
    const active = [];
    if (filters.search) active.push(`Recherche: ${filters.search}`);
    if (filters.semester) active.push(`Semestre: ${filters.semester}`);
    if (filters.teacher) active.push(`Enseignant: ${filters.teacher}`);
    if (filters.credits) active.push(`Crédits: ${filters.credits}`);
    setActiveFilters(active);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSemester('');
    setSelectedTeacher('');
    setSelectedCredits('');
    setActiveFilters([]);
    onFiltersChange({});
  };

  return (
    <Card className="border-0 shadow-sm mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedSemester} onValueChange={(value) => handleFilterChange('semester', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Semestre" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map(semester => (
                  <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTeacher} onValueChange={(value) => handleFilterChange('teacher', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Enseignant" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(teacher => (
                  <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCredits} onValueChange={(value) => handleFilterChange('credits', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Crédits ECTS" />
              </SelectTrigger>
              <SelectContent>
                {credits.map(credit => (
                  <SelectItem key={credit} value={credit}>{credit} ECTS</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-sm font-medium text-gray-600">Filtres actifs:</span>
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {filter}
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-3 w-3 mr-1" />
                Effacer
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}