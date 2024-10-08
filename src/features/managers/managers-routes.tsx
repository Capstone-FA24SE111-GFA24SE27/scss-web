import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';

const ManagersLayout = lazy(() => import('./ManagersLayout'))
export const managersRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ManagersLayout />,
    children: [
    ],
  },

];