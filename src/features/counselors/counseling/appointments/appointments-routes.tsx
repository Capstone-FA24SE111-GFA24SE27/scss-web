import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
const Appointments = lazy(() => import('./Appointments'))
export const appointmentsRoutes: RouteObject[] = [
  {
    path: 'appointments',
    element: <Appointments />
  },
];