import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const SupportStaffsOverview = lazy(() => import('./SupportStaffsOverview'))
export const supportStaffsOverviewRoutes: RouteObject[] = [
  {
    path: 'overview',
    element: <SupportStaffsOverview />,
  },
];