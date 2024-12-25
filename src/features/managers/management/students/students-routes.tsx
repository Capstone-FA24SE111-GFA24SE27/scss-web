import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { studentsTableRoutes } from './table';
import { studentOverviewRoutes } from '../../dashboard/analytics/student-overview';
import { studentRoutes } from './student';
const Students = lazy(() => import('./table/Students'))

export const studentsRoutes: RouteObject[] = [
  {
    path: 'students',
    children: [
      {
        index: true,
        element: <Students />,
      },
      ...studentRoutes
      // ...studentsTableRoutes,
      // ...studentOverviewRoutes,
    ]
  },
];