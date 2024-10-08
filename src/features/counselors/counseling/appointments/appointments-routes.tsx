import { ContentLoading } from '@/shared/components';
import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { reportRoutes } from './report';
import { studentsRoutes } from '../student';
const Appointments = lazy(() => import('./Appointments'))
export const appointmentsRoutes: RouteObject[] = [
  {
    path: 'appointments',
    element: <Appointments />,
    children: [
      ...studentsRoutes,
      ...reportRoutes
    ]
  },
];