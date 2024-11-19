import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { studentRoutes } from './student';

const Students = lazy(() => import('./Students'))
// const Student = lazy(() => import('./student/Student'))
export const studentsRoutes: RouteObject[] = [
  {
    path: 'students',
    element: <Students />,
  },
  ...studentRoutes
];