
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { overviewRoutes } from './overview';
export const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    children: [
      ...overviewRoutes
    ],
  },

];