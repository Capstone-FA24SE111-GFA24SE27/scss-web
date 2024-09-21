import { RouteObject } from 'react-router-dom'
import { lazy } from "react";
const CalendarLayout = lazy(() => import("./calendar/calendar-layout"));

export const studentServicesRoutes: RouteObject[] = [
  {
    path: 'services/calendar',
    element: <CalendarLayout />,
  },
];
