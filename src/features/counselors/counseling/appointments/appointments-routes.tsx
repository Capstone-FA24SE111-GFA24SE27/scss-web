import { ContentLoading } from '@/shared/components';
import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { reportRoutes } from './report';
import { studentRoutes } from '@features/counselors/counselors-pages';
import AppointmentsContent from './AppointmentsContent';
const Appointments = lazy(() => import('./Appointments'))
const AppointmentCreate = lazy(() => import('./AppointmentCreate'))
export const appointmentsRoutes: RouteObject[] = [
  {
    path: 'appointments',
    element: <Appointments />,
    children: [
      {
        path: 'create',
        element: <AppointmentCreate />
      },
      // ...studentRoutes,
        ...reportRoutes
    ]
  },
];