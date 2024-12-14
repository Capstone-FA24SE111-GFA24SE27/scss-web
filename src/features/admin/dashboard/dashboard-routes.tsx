
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { overviewRoutes } from './overview';
import { accountOverviewRoutes } from './overview/accounts/account-overview-routes';
export const adminDashboardRoutes: RouteObject[] = [
  {
    path: '',
    children: [
      ...overviewRoutes,
      ...accountOverviewRoutes
    ],
  },
];