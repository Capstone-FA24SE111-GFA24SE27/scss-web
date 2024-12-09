import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { studentRoutes } from '../student';

const Students = lazy(() => import('./Students'))
export const studentsTableRoutes: RouteObject[] = [
  {
    path: 'table',
    element: <Students />,
  },
  ...studentRoutes
];