import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 max-w-md">{description}</p>
          <div className="inline-flex items-center px-4 py-2 bg-dashboard-accent/10 text-dashboard-accent rounded-lg">
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PlaceholderPage;