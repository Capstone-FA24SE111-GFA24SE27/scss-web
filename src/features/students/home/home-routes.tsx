import { RouteObject } from 'react-router-dom'
import { lazy } from "react";
const Home = lazy(() => import("./Home"));

export const homeRoutes: RouteObject[] = [
  {
    path: '',
    element: <Home />,
  },
];
