
import { analyticsRoutes } from '@/features/managers/dashboard/analytics';
import { overviewRoutes } from '@/features/managers/dashboard/overview';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
export const adminDashboardRoutes: RouteObject[] = [
  {
    path: 'overall',
    children: [
      ...overviewRoutes,
      ...analyticsRoutes,
    ],
  },
];