import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import QnaDetails from './QnaDetails';
import { reportRoutes } from '@/features/counselors/counseling/appointments/report';
import { studentRoutes, StudentView } from '@/shared/pages';

const Qna = lazy(() => import('./Qna'))

export const qnaStaffRoutes: RouteObject[] = [
    {
        path: 'questions',
        element: <Qna />,
        children: [
            {
                path: ':id/view',
                element: <QnaDetails />
            },
            {
                path: 'student/:id',
                element: <StudentView  actionButton={<></>}/>,
              },
            ...studentRoutes,
			...reportRoutes,
        ]
    }
];