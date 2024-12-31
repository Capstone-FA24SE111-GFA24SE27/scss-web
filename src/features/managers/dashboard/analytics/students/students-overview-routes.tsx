import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const StudentsOverview = lazy(() => import('./StudentsAnalytics'))
export const studentOverviewRoutes: RouteObject[] = [
  {
    path: 'overview',
    element: <StudentsOverview />,
  },
];