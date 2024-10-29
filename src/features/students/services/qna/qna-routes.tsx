import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import Conversation from './conversation/Conversations';
import { converastionsRoutes } from './conversation';

const Qna = lazy(() => import('./Qna'))
const QnaList = lazy(() => import('./QnaList'))
const QnaForm = lazy(() => import('./QnaForm'))

export const qnaRoutes: RouteObject[] = [
  {
    path: 'qna',
    element: <Qna />,
    children: [
      {
        path: '',
        element: <QnaList />,
        children: [
        ]
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
    ]
  },

];