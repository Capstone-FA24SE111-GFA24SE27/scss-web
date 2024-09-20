import { RouteObject } from 'react-router-dom'
import { lazy } from "react";
const Calendar = lazy(() => import("./calendar-layout"));
export const studentCalendarRoutes: RouteObject[] = [
  {
    path: 'calendar',
    element: <Calendar />,
  },
];
