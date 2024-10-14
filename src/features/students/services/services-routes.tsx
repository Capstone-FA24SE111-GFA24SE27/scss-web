import { RouteObject } from 'react-router-dom'
import { studentCalendarRoutes } from './calendar';
import { counselingRoutes } from './counseling';
import { activityRoutes } from './activity';
import { qnaRoutes } from './qna';
export const servicesRoutes: RouteObject[] = [
  {
    path: 'services',
    children: [
      ...studentCalendarRoutes,
      ...counselingRoutes,
      ...activityRoutes,
      ...qnaRoutes
    ],
  },
];
