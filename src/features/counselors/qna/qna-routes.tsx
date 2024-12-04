import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { converastionsRoutes } from './conversation';
import { myQnaRoutes } from './my-qna';
import { counselorQuestionBoardRoutes } from './question-board';


export const qnaRoutes: RouteObject[] = [
  {
    path: 'qna',
    children: [
      ...converastionsRoutes,
      ...myQnaRoutes,
      ...counselorQuestionBoardRoutes
    ]
  },
];