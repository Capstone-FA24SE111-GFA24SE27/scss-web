import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
const MyQna = lazy(() => import('./MyQna'))
// const MyQnaChat = lazy(() => import('./MyQnaChat'))
import MyQnaChat from './MyQnaChat'
import { studentRoutes } from '@/shared/pages';
export const myQnaRoutes: RouteObject[] = [
  {
    path: 'my-qna',
    element: <MyQna />,
    children: [
      {
        path: ':id',
        element: <MyQnaChat />,
      },
      ...studentRoutes
    ]
  },
];