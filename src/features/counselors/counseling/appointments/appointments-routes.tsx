import { ContentLoading } from '@/shared/components';
import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { reportRoutes } from './report';
import { studentRoutes } from '@features/counselors/pages';
const Appointments = lazy(() => import('./Appointments'))
export const appointmentsRoutes: RouteObject[] = [
  {
    path: 'appointments',
    element: <Appointments />,
    children: [
      ...studentRoutes,
      ...reportRoutes
    ]
  },
];