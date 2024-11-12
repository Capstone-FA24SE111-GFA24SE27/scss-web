import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ContentLoading } from '@/shared/components';
import { reportRoutes } from '../appointments/report';
import { appointmentRoutes } from '@/shared/pages';

const Requests = lazy(() => import('./Requests'))
export const requestsRoutes: RouteObject[] = [
  {
    path: 'requests',
    element: <Requests />,
    children: [
      // ...reportRoutes,
      ...appointmentRoutes
    ]
  },
];