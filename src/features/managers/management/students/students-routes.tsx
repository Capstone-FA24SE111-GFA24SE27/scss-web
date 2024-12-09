import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { studentsTableRoutes } from './table';
import {studentOverviewRoutes} from './overview';
import { studentRoutes } from './student';

export const studentsRoutes: RouteObject[] = [
  {
    path: 'students',
    children: [
      ...studentsTableRoutes,
      ...studentOverviewRoutes,
      ...studentRoutes
    ]
  },
];