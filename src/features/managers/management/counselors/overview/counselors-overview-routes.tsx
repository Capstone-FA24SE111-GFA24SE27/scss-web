import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { counselorRoutes } from '../counselor';

const CounselorsOverview = lazy(() => import('./CounselorsOverview'))
export const counselorOverviewRoutes: RouteObject[] = [
  {
    path: 'overview',
    element: <CounselorsOverview />,
  },
];