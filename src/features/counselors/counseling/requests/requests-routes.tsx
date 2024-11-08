import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ContentLoading } from '@/shared/components';
import { studentRoutes } from '@features/counselors/counselors-pages';
import { reportRoutes } from '../appointments/report';

const Requests = lazy(() => import('./Requests'))
export const requestsRoutes: RouteObject[] = [
  {
    path: 'requests',
    element: <Requests />,
    children: [
      // ...studentRoutes,
      ...reportRoutes
    ]
  },
];