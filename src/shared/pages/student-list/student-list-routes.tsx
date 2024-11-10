import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
// import { studentRoutes } from '@shared/pages/student';
import { studentRoutes } from '../student';

const StudentList = lazy(() => import('./StudentList'))

export const studentListRoutes: RouteObject[] = [
  {
    path: 'student-list',
    element: <StudentList />,
    children: [
      ...studentRoutes
    ]
  },
];