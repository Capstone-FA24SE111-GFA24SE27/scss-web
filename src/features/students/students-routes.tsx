import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { servicesRoutes } from './services';
import { specialRoutes } from '@shared/configs';
import { resourcesRoutes } from './resources';

const StudentLayout = lazy(() => import('./students-layout'))
export const studentsRoutes: RouteObject[] = [
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      ...servicesRoutes,
      ...resourcesRoutes,
      ...specialRoutes,
    ],
  },

];