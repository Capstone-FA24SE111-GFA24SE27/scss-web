import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';

const AdminLayout = lazy(() => import('./admin-layout'))

export const adminRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AdminLayout />,
    children: [
        ...specialRoutes,
    ],
  },

];