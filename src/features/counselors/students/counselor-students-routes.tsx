import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { studentDemandsRoutes } from './student-demands';
import { studentListRoutes } from '@/shared/pages';

export const counselorStudentsRoutes: RouteObject[] = [
  {
    path: 'students',
    children: [
      ...studentListRoutes,
      ...studentDemandsRoutes
    ],
  },
];