import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { converastionsRoutes } from './conversation';
import { questionBoardRoutes } from '@/shared/pages';

const Qna = lazy(() => import('./Qna'))
const QnaList = lazy(() => import('./QnaList'))
const QnaForm = lazy(() => import('./QnaForm'))

export const qnaRoutes: RouteObject[] = [
  {
    path: 'qna',
    element: <Qna />,
    children: [
      {
        path: 'my-qna',
        element: <QnaList />,
      },
      {
        path: 'create',
        element: <QnaForm />,
      },
      {
        path: 'edit/:questionId',
        element: <QnaForm />,
      },
      ...converastionsRoutes,
      ...questionBoardRoutes,
    ]
  },

];