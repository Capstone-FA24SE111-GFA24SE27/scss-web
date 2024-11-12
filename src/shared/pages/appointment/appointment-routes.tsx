import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import AppointmentView from './AppointmentView';


export const appointmentRoutes: RouteObject[] = [
  {
    path: 'appointment/:id',
    element: <AppointmentView />,
  },
];