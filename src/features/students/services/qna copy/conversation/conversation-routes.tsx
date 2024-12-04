import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import Conversations from './Conversations';
import ConversationDetail from './ConversationDetail';
// const Conversations = lazy(() => import('./Conversations'))
// const ConversationDetail = lazy(() => import('./ConversationDetail'))

export const converastionsRoutes: RouteObject[] = [
  {
    path: 'conversations',
    element: <Conversations />,
  },
  {
    path: 'conversations/:id',
    element: <ConversationDetail />,
  }
];