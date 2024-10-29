import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { requestsRoutes } from './requests'
import { appointmentsRoutes } from './appointments'
import Requests from './requests/Requests';
import { calendarRoutes } from './calendar';
export const counselingRoutes: RouteObject[] = [
    {
        path: 'counseling',
        children: [
            ...requestsRoutes,
            ...appointmentsRoutes,
            ...calendarRoutes
        ]
    },
];