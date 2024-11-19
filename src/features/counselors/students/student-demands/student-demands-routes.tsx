import { demandRoutes, studentRoutes } from '@/shared/pages';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const StudentDemands = lazy(() => import('./StudentDemands'))
const StudentDemandsAppointmentCreate = lazy(() => import('./StudentDemandsAppointmentCreate'))

export const studentDemandsRoutes: RouteObject[] = [
  {
    path: 'student-demands',
    element: <StudentDemands />,
    children: [
      {
        path: ':id',
        element: <StudentDemandsAppointmentCreate />,
      },
      ...studentRoutes,
      ...demandRoutes
    ]
  },
];