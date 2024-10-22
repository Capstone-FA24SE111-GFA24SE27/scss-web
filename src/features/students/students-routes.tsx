import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { servicesRoutes } from './services';
import { specialRoutes } from '@shared/configs';

const StudentLayout = lazy(() => import('./students-layout'))
export const studentsRoutes: RouteObject[] = [
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      ...servicesRoutes,
      ...specialRoutes,
    ],
  },

];