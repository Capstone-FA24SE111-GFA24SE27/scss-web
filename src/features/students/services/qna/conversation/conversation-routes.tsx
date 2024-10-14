import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
const Conversations = lazy(() => import('./Conversations'))
const ConversationDetail = lazy(() => import('./ConversationDetail'))

export const converastionsRoutes: RouteObject[] = [
  {
    path: 'conversations',
    element: <Conversations />,
    children: [
      {
        path: ':id',
        element: <ConversationDetail />,
      }
    ]
  },
];