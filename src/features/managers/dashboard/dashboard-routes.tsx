
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { overviewRoutes } from './overview';
import { analyticsRoutes } from './analytics';
export const dashboardRoutes: RouteObject[] = [
  {
    path: 'overall',
    children: [
      ...overviewRoutes,
      ...analyticsRoutes,
    ],
  },
];