import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { studentListRoutes } from './student-list';
import { studentDemandsRoutes } from './student-demands';

export const counselorStudentsRoutes: RouteObject[] = [
  {
    path: 'students',
    children: [
      ...studentListRoutes,
      ...studentDemandsRoutes
    ],
  },
];