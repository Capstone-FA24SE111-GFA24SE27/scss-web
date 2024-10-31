import { RouteObject } from 'react-router-dom';
import { problemTagsRoutes } from './problem-tag';
import { holidaysRoutes } from './holiday';

export const resourcesRoutes: RouteObject[] = [
  {
    path: 'resources',
    children: [
      ...problemTagsRoutes,
      ...holidaysRoutes
    ],
  },

];