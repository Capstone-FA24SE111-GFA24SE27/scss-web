import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import Student from './Student';

// const Student = lazy(() => import('./Student'))
// const StudentReport = lazy(() => import('./StudentReport'))
export const studentRoutes: RouteObject[] = [
  {
    path: 'student/:id',
    element: <Student />,
  }
];