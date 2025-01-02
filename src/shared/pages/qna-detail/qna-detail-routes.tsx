import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const QnaDetail = lazy(() => import('./QnaDetail'))

export const qnaDetailRoutes: RouteObject[] = [
    {
        path: 'qna-detail/:id',
        element: <QnaDetail />,
        children: [
        ]
    }
];