import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { servicesRoutes } from './services';
import { specialRoutes } from '@shared/configs';
import { profileRoutes } from './profile';
import { settingsRoutes } from '@/shared/pages';
import { homeRoutes } from './home';

const StudentLayout = lazy(() => import('./students-layout'))
export const studentsRoutes: RouteObject[] = [
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      ...homeRoutes,
      ...servicesRoutes,
      ...specialRoutes,
      ...profileRoutes,
      ...settingsRoutes,
    ],
  },

];