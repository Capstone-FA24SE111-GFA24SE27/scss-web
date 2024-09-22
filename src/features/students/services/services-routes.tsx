import { RouteObject } from 'react-router-dom'
import { studentCalendarRoutes } from './calendar';
import { counselingRoutes } from './counseling';
export const studentServicesRoutes: RouteObject[] = [
  {
    path: 'services',
    children: [
      ...studentCalendarRoutes,
      ...counselingRoutes,
    ],
  },
];
