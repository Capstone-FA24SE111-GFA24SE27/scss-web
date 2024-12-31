import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const QnaDetail = lazy(() => import('./QnaDetail'))

export const qnaDetailRoutes: RouteObject[] = [
    {
        path: ':id',
        element: <QnaDetail />,
        children: [
        ]
    }
];