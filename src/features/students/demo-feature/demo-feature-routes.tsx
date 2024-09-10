import { RouteObject } from 'react-router-dom'
import DemoFeature from './demo-feature-pages/DemoFeature';
export const demoFeatureRoutes: RouteObject[] = [
  {
    path: 'demo-feature',
    element: <DemoFeature />,
  },
];
