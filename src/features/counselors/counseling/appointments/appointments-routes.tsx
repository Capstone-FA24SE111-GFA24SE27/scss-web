import { ContentLoading } from '@/shared/components';
import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { reportRoutes } from './report';
import AppointmentsContent from './AppointmentsContent';
import { appointmentRoutes } from '@/shared/pages';
const Appointments = lazy(() => import('./Appointments'))
const AppointmentCreate = lazy(() => import('./AppointmentCreate'))
export const appointmentsRoutes: RouteObject[] = [
  {
    path: 'appointments',
    element: <Appointments />,
    children: [
      ...reportRoutes,
      ...appointmentRoutes,
    ]
  },
  {
    path: 'appointments/create',
    element: <AppointmentCreate />,
  },
];