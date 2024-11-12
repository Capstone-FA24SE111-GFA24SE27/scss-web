import { RouteObject } from 'react-router-dom';
import { problemTagsRoutes } from './problem-tag';
import { holidaysRoutes } from './holiday';
import { timeSlotRoutes } from './time-slot';

export const resourcesRoutes: RouteObject[] = [
  {
    path: 'resources',
    children: [
      ...problemTagsRoutes,
      ...holidaysRoutes,
      ...timeSlotRoutes
    ],
  },

];