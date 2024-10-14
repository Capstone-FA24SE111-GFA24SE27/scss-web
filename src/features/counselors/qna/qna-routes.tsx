import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { questionBoardRoutes } from './question-board';
import { converastionsRoutes } from './conversation';
import { myQnaRoutes } from './my-qna';


export const qnaRoutes: RouteObject[] = [
  {
    path: 'qna',
    children: [
      ...questionBoardRoutes,
      ...converastionsRoutes,
      ...myQnaRoutes,
    ]
  },
];