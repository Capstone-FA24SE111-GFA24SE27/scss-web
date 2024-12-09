import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { counselorRoutes } from '../counselor';

const Counselors = lazy(() => import('./Counselors'))
export const counselorsTableRoutes: RouteObject[] = [
  {
    path: 'table',
    element: <Counselors />,
  },
];