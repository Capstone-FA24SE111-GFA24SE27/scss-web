import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const QnaLayout = lazy(() => import('./QnaLayout'))
const Qna = lazy(() => import('./Qna'))
const QnaForm = lazy(() => import('./QnaForm'))
const QnaView = lazy(() => import('./QnaView'))

export const qnaRoutes: RouteObject[] = [
  {
    path: 'qna',
    element: <QnaLayout />,
    children: [
      {
        path: '',
        element: <Qna />,
        children: [
          {
            path: 'create',
            element: <QnaForm />,
          },
          {
            path: ':id',
            element: <QnaView />,
          }
        ]
      },

    ]
  },

];