import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { studentServicesRoutes } from './services/services-routes';

const StudentLayout = lazy(() => import('./student-layout'))
// import StudentLayout from './student-layout';
export const studentRoutes: RouteObject[] = [
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      ...studentServicesRoutes,
    ],
  },
  
];