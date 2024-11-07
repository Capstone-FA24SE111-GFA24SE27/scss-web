import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';

const ProblemTag = lazy(() => import('./ProblemTag'))

export const problemTagsRoutes: RouteObject[] = [
  {
    path: 'tags',
    element: <ProblemTag />,
    children: [

    ],
  },

];