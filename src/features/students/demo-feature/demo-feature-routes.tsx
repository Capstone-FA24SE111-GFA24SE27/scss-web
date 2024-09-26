import { RouteObject } from 'react-router-dom'
import { lazy } from "react";
const DemoFeature = lazy(() => import("./DemoFeature"));

export const demoFeatureRoutes: RouteObject[] = [
  {
    path: 'demo-feature',
    element: <DemoFeature />,
  },
];
