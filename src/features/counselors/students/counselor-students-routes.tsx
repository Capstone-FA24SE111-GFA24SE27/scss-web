import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { studentListRoutes } from './student-list';

export const counselorStudentsRoutes: RouteObject[] = [
  {
    path: 'students',
    children: [
      ...studentListRoutes
    ],
  },
];