import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { counselorsRoutes } from './counselors';
import { studentsRoutes } from './students';
import { supportStaffsRoutes } from './support-staffs';

export const managementRoutes: RouteObject[] = [
  {
    path: 'management',
    children: [
      ...counselorsRoutes,
      ...studentsRoutes,
      ...supportStaffsRoutes
    ],
  },

];