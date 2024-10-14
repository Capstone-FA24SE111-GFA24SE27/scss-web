import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
const MyQna = lazy(() => import('./MyQna'))

export const myQnaRoutes: RouteObject[] = [
  {
    path: 'my-qna',
    element: <MyQna />
  },
];