import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import { managementRoutes } from './management';
import { profileRoutes, settingsRoutes } from '@/shared/pages';
import { dashboardRoutes } from './dashboard';

const ManagersLayout = lazy(() => import('./ManagersLayout'))
export const managersRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ManagersLayout />,
    children: [{
      path: '',
      element: <Navigate to={`dashboard/overview`}/>
    },
    ...dashboardRoutes,
    ...managementRoutes,
    ...profileRoutes,
    ...settingsRoutes,
    ...specialRoutes,
    ],
  },

];