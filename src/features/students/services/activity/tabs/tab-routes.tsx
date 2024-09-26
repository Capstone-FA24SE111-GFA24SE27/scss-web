import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const AppointmentView = lazy(() => import('./AppointmentView'))

export const tabRoutes: RouteObject[] = [
  {
    path: 'appointment/:id',
    element: <AppointmentView />,
  },
];