import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { counselorsRoutes } from './counselors';

export const managementRoutes: RouteObject[] = [
  {
    path: 'management',
    children: [
      ...counselorsRoutes
    ],
  },

];