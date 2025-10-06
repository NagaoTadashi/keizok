import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient: string;
}

export function StatsCard({ title, value, icon: Icon, trend, gradient }: StatsCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {title}
            </p>
            <p className="text-4xl font-bold tracking-tight">{value}</p>
            {trend && (
              <p
                className={`text-xs font-medium ${
                  trend.isPositive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
              </p>
            )}
          </div>
          <div
            className={`w-16 h-16 rounded-2xl ${gradient} flex items-center justify-center shadow-xl`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
