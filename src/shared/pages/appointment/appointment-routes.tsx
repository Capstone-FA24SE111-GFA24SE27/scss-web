import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
// import AppointmentDetail from './AppointmentDetail';
const AppointmentDetail = lazy(() => import('./AppointmentDetail'));



export const appointmentRoutes: RouteObject[] = [
  {
    path: 'appointment/:id',
    element: <AppointmentDetail />,
  },
];