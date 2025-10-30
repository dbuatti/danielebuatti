"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, DollarSign } from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';

const AdminDashboardPage: React.FC = () => {
  const { user } = useSession();

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Welcome, {user?.email}!</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        This is your administration dashboard. Here you can manage various aspects of your application.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-primary">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-brand-dark/70 dark:text-brand-light/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-dark dark:text-brand-light">0</div> {/* Placeholder */}
            <p className="text-xs text-brand-dark/60 dark:text-brand-light/60">+0 since last month</p> {/* Placeholder */}
          </CardContent>
        </Card>
        <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-primary">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-dark/70 dark:text-brand-light/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-dark dark:text-brand-light">A$0.00</div> {/* Placeholder */}
            <p className="text-xs text-brand-dark/60 dark:text-brand-light/60">+0.00 since last month</p> {/* Placeholder */}
          </CardContent>
        </Card>
        <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-primary">Active Users</CardTitle>
            <Users className="h-4 w-4 text-brand-dark/70 dark:text-brand-light/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-dark dark:text-brand-light">1</div> {/* Assuming one admin user */}
            <p className="text-xs text-brand-dark/60 dark:text-brand-light/60">Currently logged in</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 p-6 bg-brand-light dark:bg-brand-dark-alt rounded-lg shadow-inner border border-brand-secondary/30">
        <h3 className="text-2xl font-semibold text-brand-primary mb-4">Quick Actions</h3>
        <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2">
          <li>View and manage all submitted invoices.</li>
          <li>Monitor user activity and system health.</li>
          <li>Access detailed reports (future feature).</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboardPage;