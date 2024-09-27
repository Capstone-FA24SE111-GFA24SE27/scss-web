import { lazy } from 'react';
import { eventsRoutes } from './events'
import { RouteObject } from 'react-router-dom';


export const resourcesRoutes: RouteObject[] = [
  {
    path: 'resources',
    children: [
      ...eventsRoutes,
    ]
  }
];