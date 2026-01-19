'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  loading?: boolean;
}

export function ResponsiveCard({ 
  children, 
  className, 
  hover = false, 
  loading = false 
}: ResponsiveCardProps) {
  return (
    <Card 
      className={cn(
        "border-0 shadow-sm transition-all duration-300",
        hover && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        loading && "loading",
        className
      )}
    >
      {children}
    </Card>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend = 'neutral',
  className 
}: StatsCardProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <ResponsiveCard className={cn("p-4 sm:p-6", className)} hover>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            {value}
          </p>
          {description && (
            <p className={cn("text-sm", trendColors[trend])}>
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4 opacity-75">
            {icon}
          </div>
        )}
      </div>
    </ResponsiveCard>
  );
}